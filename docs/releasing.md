# Releases and AppGallery

release-please reads Conventional Commits on main. Its bootstrap is the initial
repository commit; the initial manifest is 0.0.0 so the first feature release is
0.1.0. It updates package.json, CHANGELOG.md and the native manifest's version
name. The build derives the increasing numeric code with version:sync for the
package only and restores the tracked manifest afterwards. Do not bump these
manually. Minor and patch components must stay below 100.

## Native release artifacts

Build and Distribute is callable after a GitHub release or manually. It requires
a trusted self-hosted macOS runner labeled `huawei-sdk` with DevEco 6.1.1 and
Node 22.13+ available. The standard path is used unless DEVECO_STUDIO_HOME is set
in the runner environment. Register the runner through repository Settings >
Actions > Runners using GitHub's instructions before merging a release PR. Do
not install a runner service or expose a personal Mac without owner approval.
The workflow is not triggered by arbitrary pull requests.

The workflow runs npm ci and npm run build, uploads .hap/.app artifacts, and
attaches them to the existing release. Packages are unsigned by default. Release
creation and native build completion are different states; an absent runner
leaves the build queued, not successful.

## Huawei prerequisites

Before store submission, register and verify a Huawei developer account, create
the app with bundle ID io.github.dchernykh1984.huaweiracestats, and obtain Huawei
release signing credentials/profile. Use the authorized signing configuration
in a private local build-profile.json5 or a separately managed release checkout.
Never commit credentials, passwords, certificates or signing profiles. The
repository ignores certificate/profile file types, but review diffs as well.

Validate a signed build on each supported watch/phone combination, including
network recovery, settings persistence, fonts, battery behavior and use during
workouts. Prepare store screenshots, support contacts, release notes and a
privacy-policy URL, then submit through AppGallery Connect. No signing, account
registration, store upload, repository merge or public release is performed by
this initial implementation PR.
