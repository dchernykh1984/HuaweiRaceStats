import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export function versionCode(version) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);
  if (!match) throw new Error("Use a stable major.minor.patch version");
  const [major, minor, patch] = match.slice(1).map(Number);
  const code = major * 10000 + minor * 100 + patch;
  if (
    minor >= 100 ||
    patch >= 100 ||
    !Number.isSafeInteger(code) ||
    code < 1 ||
    code > 2147483647
  ) {
    throw new Error("Version cannot be represented as a Huawei version code");
  }
  return code;
}

export function syncVersion(root, check = false) {
  const read = (name) => JSON.parse(readFileSync(resolve(root, name), "utf8"));
  const version = read("package.json").version;
  const code = versionCode(version);
  const name = "entry/src/main/config.json";
  const config = read(name);
  // release-please updates the name in its PR; the build derives the numeric code.
  if (check) {
    if (config.app.version.name !== version) throw new Error("Run npm run version:sync");
    return;
  }
  config.app.version = { code, name: version };
  writeFileSync(resolve(root, name), JSON.stringify(config, null, 2) + "\n");
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  syncVersion(process.cwd(), process.argv.includes("--check"));
}
