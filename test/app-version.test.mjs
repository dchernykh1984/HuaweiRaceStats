import { describe, it, expect } from "vitest";
import { versionCode } from "../scripts/sync-app-version.mjs";

describe("Huawei app version", () => {
  it("is monotonic across patch, minor and major releases", () => {
    expect(versionCode("0.1.0")).toBe(100);
    expect(versionCode("1.0.0")).toBeGreaterThan(versionCode("0.99.99"));
  });
  it("rejects ambiguous, prerelease and overflowing versions", () => {
    for (const value of ["1.100.0", "1.0.100", "1.0.0-beta", "1.0", "0.0.0", "999999.0.0"])
      expect(() => versionCode(value)).toThrow();
  });
});
