# Specifications

The app is developed spec-first with [Spec Kit](https://github.com/github/spec-kit).
Claude Code and Codex both carry its skills (`speckit-specify`, `speckit-plan`,
`speckit-tasks`, `speckit-implement`, ...). The principles every plan is checked
against are in [the constitution](../.specify/memory/constitution.md).

## What lives here

```
specs/
  app/                         the app as it works today, one file per area
    live-stats.md              server contract, polling and the results screen
    watch-settings.md          settings screens, keyboard and storage
    layout-and-languages.md    screen shapes, field layout and translations
  <issue>-<short-name>/        one feature, from its GitHub issue
    spec.md, plan.md, tasks.md ...
```

`specs/app/` was written from the code and its tests. Each file lists user
stories with acceptance scenarios, functional requirements, the tests that pin
them and what still needs real hardware. **Keep them true:** a change that alters
an area's behaviour updates its file in the same pull request.

## The workflow

With Claude Code type the commands; with Codex ask for the skill of the same name.

1. `/speckit-specify SPECIFY_FEATURE_DIRECTORY=specs/<issue>-<short-name> <what and why>`
2. `/speckit-clarify` (optional) to settle open questions.
3. `/speckit-plan` with the technical approach; it checks the constitution.
4. `/speckit-tasks`, then `/speckit-implement`.
5. Fold the result into `specs/app/` once the feature ships.
