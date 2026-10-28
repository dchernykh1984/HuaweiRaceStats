# Releases and AppGallery

release-please reads Conventional Commits on main from the initial repository
commit. The first release was 1.0.0 (tag `huawei-race-stats-v1.0.0`); later
releases bump from the manifest by commit type. It updates package.json, CHANGELOG.md and the native manifest's version
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
release signing credentials/profile. Never commit credentials, passwords,
certificates or signing profiles. The repository ignores certificate/profile
file types, but review diffs as well.

## Signed packages

Keep the release signing files in a private directory outside Git, for example
`~/.huawei-signing/huaweiracestats`:

- `release.p12`: the keystore with the release key.
- `release.csr`: the request uploaded to AppGallery Connect.
- `release.cer` and `release.p7b`: the certificate and release profile
  downloaded from AppGallery Connect.
- `signing.json`: the paths and DevEco-style encrypted passwords, with the
  `material/` folder that decrypts them.

Then run:

```sh
HUAWEI_SIGNING_DIR=~/.huawei-signing/huaweiracestats npm run build
```

The build adds the signing configuration to `build-profile.json5` only while
Hvigor runs and restores the tracked file afterwards. It writes
`dist/huawei-race-stats-<version>-signed.app` for AppGallery Connect. Back up the
directory and its password: a lost keystore means a new certificate and profile.

Validate a signed build on each supported watch/phone combination, including
network recovery, settings persistence, fonts, battery behavior and use during
workouts. Prepare store screenshots, support contacts, release notes and a
privacy-policy URL, then submit through AppGallery Connect. Signing, account
registration and store upload are separate explicit actions; a GitHub release
does not perform them.
