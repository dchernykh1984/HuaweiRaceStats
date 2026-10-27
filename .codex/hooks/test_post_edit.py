"""Exercise Codex patch payloads, exemptions and repository boundaries."""

from __future__ import annotations

import importlib.util
import json
import re
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).with_name("post_edit.py")
REPO = SCRIPT.parents[2]
SPEC = importlib.util.spec_from_file_location("post_edit", SCRIPT)
if SPEC is None or SPEC.loader is None:
    raise RuntimeError("Cannot load hook")
HOOK = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(HOOK)


def pre_commit_ascii_policy() -> tuple[str, str, str]:
    """The top-level exclude and the no-non-ascii files/exclude from pre-commit."""
    text = (REPO / ".pre-commit-config.yaml").read_text(encoding="utf-8")
    top = re.search(r"^exclude: '([^']*)'$", text, re.MULTILINE)
    hook = text[text.index("id: no-non-ascii") :]
    files = re.search(r"^\s+files: '([^']*)'$", hook, re.MULTILINE)
    exclude = re.search(r"^\s+exclude: '([^']*)'$", hook, re.MULTILINE)
    if not (top and files and exclude):
        raise AssertionError("pre-commit ASCII policy not found")
    return top.group(1), files.group(1), exclude.group(1)


class PostEditTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name).resolve()
        self.checked = self.root / "source.md"
        self.checked.write_text("plain ASCII\n", encoding="utf-8")
        self.checks = {"files": r"\.md$", "exclude": r"^translations/"}

    def payload(self, command: str, **extra: str) -> dict:
        return {"cwd": str(self.root), "tool_input": {"command": command}, **extra}

    def test_crlf_patch_reports_every_edited_file(self) -> None:
        other = self.root / "other.md"
        other.write_text(chr(0x416), encoding="utf-8")
        self.checked.write_bytes(b"\xff")
        paths = HOOK.edited_paths(
            self.payload(
                "*** Update File: source.md\r\n"
                "*** Add File: other.md\r\n"
                "*** Move to: other.md\r\n"
            ),
            self.root,
        )
        self.assertEqual(paths, [self.checked, other])
        self.assertEqual(
            HOOK.violations(paths, self.root, self.checks),
            ["source.md", "other.md"],
        )

    def test_multi_file_patch_reports_every_offending_file(self) -> None:
        other = self.root / "other.md"
        other.write_text(chr(0x416), encoding="utf-8")
        self.checked.write_bytes(b"\xff")
        paths = HOOK.edited_paths(
            self.payload("*** Update File: source.md\n*** Add File: other.md\n"),
            self.root,
        )
        self.assertEqual(
            HOOK.violations(paths, self.root, self.checks),
            ["source.md", "other.md"],
        )

    def test_move_checks_the_destination(self) -> None:
        self.checked.write_text(chr(0x416), encoding="utf-8")
        paths = HOOK.edited_paths(
            self.payload("*** Update File: missing.md\n*** Move to: source.md\n"),
            self.root,
        )
        self.assertEqual(HOOK.violations(paths, self.root, self.checks), ["source.md"])

    def test_delete_and_missing_files_are_ignored(self) -> None:
        paths = HOOK.edited_paths(
            self.payload("*** Delete File: source.md\n*** Add File: missing.md\n"),
            self.root,
        )
        self.assertEqual(paths, [])

    def test_subdirectory_payload_resolves_relative_files(self) -> None:
        subdir = self.root / "nested"
        subdir.mkdir()
        paths = HOOK.edited_paths(
            self.payload("*** Update File: ../source.md\n", cwd=str(subdir)),
            self.root,
        )
        self.assertEqual(paths, [self.checked])

    def test_paths_outside_the_repository_are_ignored(self) -> None:
        with tempfile.TemporaryDirectory() as outside:
            external = Path(outside) / "external.md"
            external.write_text(chr(0x416), encoding="utf-8")
            paths = HOOK.edited_paths(
                self.payload(f"*** Add File: {external}\n"), self.root
            )
            self.assertEqual(paths, [])

    def test_symlink_to_outside_is_ignored(self) -> None:
        with tempfile.TemporaryDirectory() as outside:
            external = Path(outside) / "external.md"
            external.write_text(chr(0x416), encoding="utf-8")
            link = self.root / "link.md"
            try:
                link.symlink_to(external)
            except OSError:
                self.skipTest("Symlinks are unavailable")
            self.assertEqual(
                HOOK.edited_paths(self.payload("*** Update File: link.md\n"), self.root),
                [],
            )

    def test_exempt_translations_are_allowed(self) -> None:
        translated = self.root / "translations/ru.md"
        translated.parent.mkdir()
        translated.write_text(chr(0x416), encoding="utf-8")
        self.assertEqual(HOOK.violations([translated], self.root, self.checks), [])

    def test_ascii_and_unchecked_types_are_allowed(self) -> None:
        binary = self.root / "image.png"
        binary.write_bytes(b"\xff")
        self.assertEqual(
            HOOK.violations([self.checked, binary], self.root, self.checks), []
        )

    def test_legacy_file_path_is_supported_and_deduplicated(self) -> None:
        payload = self.payload("*** Update File: source.md\n")
        payload["tool_input"]["file_path"] = str(self.checked)
        self.assertEqual(HOOK.edited_paths(payload, self.root), [self.checked])

    def test_non_object_tool_input_is_ignored(self) -> None:
        self.assertEqual(HOOK.edited_paths({"tool_input": "text"}, self.root), [])

    def test_cli_reports_bytes_from_a_different_working_directory(self) -> None:
        folder = self.root / ".codex/hooks"
        folder.mkdir(parents=True)
        script = folder / "post_edit.py"
        script.write_bytes(SCRIPT.read_bytes())
        (folder / "checks.json").write_text(json.dumps(self.checks), encoding="utf-8")
        self.checked.write_bytes(b"\xff")
        result = subprocess.run(  # noqa: S603
            [sys.executable, str(script)],
            input=json.dumps(self.payload("*** Update File: source.md\n")),
            text=True,
            capture_output=True,
            cwd=folder,
            check=False,
        )
        self.assertEqual(result.returncode, 2)
        self.assertIn("source.md", result.stderr)

    def test_repository_policy_preserves_translation_exemptions(self) -> None:
        checks = json.loads(SCRIPT.with_name("checks.json").read_text(encoding="utf-8"))
        cases = [('lib/i18n/labels.js', False), ('CHANGELOG.md', False), ('package-lock.json', False), ('lib/source.js', True), ('entry/page.hml', True), ('entry/config.json5', True), ('entry/hvigorfile.ts', True)]
        for relative, rejected in cases:
            with self.subTest(path=relative):
                path = self.root / relative
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text(chr(0x416), encoding="utf-8")
                self.assertEqual(
                    bool(HOOK.violations([path], self.root, checks)), rejected
                )

    def test_repository_policy_matches_pre_commit(self) -> None:
        checks = json.loads(SCRIPT.with_name("checks.json").read_text(encoding="utf-8"))
        top, files, exclude = pre_commit_ascii_policy()
        samples = [
            "lib/config.js",
            "lib/i18n/ui.js",
            "entry/src/main/js/MainAbility/pages/index/index.hml",
            "docs/development.md",
            "CHANGELOG.md",
            "package-lock.json",
            "scripts/run.sh",
            ".specify/memory/constitution.md",
            ".specify/templates/plan-template.md",
            ".specify/workflows/speckit/workflow.yml",
            ".claude/skills/speckit-plan/SKILL.md",
            ".agents/skills/speckit-plan/SKILL.md",
            ".claude/skills/review-cycle/SKILL.md",
            "specs/app/live-stats.md",
        ]
        for relative in samples:
            with self.subTest(path=relative):
                pre_commit = bool(
                    re.search(files, relative)
                    and not re.search(top, relative)
                    and not re.search(exclude, relative)
                )
                hook = bool(
                    re.search(checks["files"], relative)
                    and not re.search(checks["exclude"], relative)
                )
                self.assertEqual(hook, pre_commit)

    def test_claude_hook_applies_the_shared_policy(self) -> None:
        (self.root / ".claude/hooks").mkdir(parents=True)
        (self.root / ".codex/hooks").mkdir(parents=True)
        script = self.root / ".claude/hooks/check_ascii.py"
        script.write_bytes((REPO / ".claude/hooks/check_ascii.py").read_bytes())
        (self.root / ".codex/hooks/checks.json").write_text(
            json.dumps(self.checks), encoding="utf-8"
        )
        translated = self.root / "translations/ru.md"
        translated.parent.mkdir()
        outside = tempfile.TemporaryDirectory()
        self.addCleanup(outside.cleanup)
        elsewhere = Path(outside.name) / "notes.md"
        for path in (self.checked, translated, elsewhere):
            path.write_text(chr(0x416), encoding="utf-8")
        for path, code in ((self.checked, 2), (translated, 0), (elsewhere, 0)):
            with self.subTest(path=path.name):
                result = subprocess.run(  # noqa: S603
                    [sys.executable, str(script)],
                    input=json.dumps({"tool_input": {"file_path": str(path)}}),
                    text=True,
                    capture_output=True,
                    check=False,
                )
                self.assertEqual(result.returncode, code, result.stderr)

    def test_cli_ignores_invalid_json(self) -> None:
        result = subprocess.run(  # noqa: S603
            [sys.executable, str(SCRIPT)],
            input="not JSON",
            text=True,
            capture_output=True,
            check=False,
        )
        self.assertEqual(result.returncode, 0)


if __name__ == "__main__":
    unittest.main()
