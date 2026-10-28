import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { withSigning } from "../scripts/signing.mjs";

const profile = readFileSync("build-profile.json5", "utf8");

function signingDir(files = ["release.p12", "release.cer", "release.p7b"]) {
  const dir = mkdtempSync(join(tmpdir(), "signing-"));
  const signing = {
    storeFile: "release.p12",
    storePassword: "00".repeat(32),
    keyAlias: "huaweiracestats",
    keyPassword: "11".repeat(32),
    certpath: "release.cer",
    profile: "release.p7b",
    signAlg: "SHA256withECDSA",
  };
  writeFileSync(join(dir, "signing.json"), JSON.stringify(signing));
  for (const file of files) writeFileSync(join(dir, file), "x");
  return dir;
}

describe("release signing", () => {
  it("points the default product at the private signing files", () => {
    const dir = signingDir();
    const signed = withSigning(profile, dir);
    expect(signed).toContain('signingConfig: "release"');
    expect(signed).toContain(JSON.stringify(join(dir, "release.p7b")));
    expect(signed).toContain('"keyAlias":"huaweiracestats"');
    expect(profile).toContain("signingConfigs: [],");
  });
  it("stops before building when an AppGallery Connect file is missing", () => {
    expect(() => withSigning(profile, signingDir(["release.p12"]))).toThrow(/release\.cer/);
  });
});
