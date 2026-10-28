import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

// Add the private release signing configuration from HUAWEI_SIGNING_DIR to the
// tracked build profile text. The directory stays outside Git and holds
// signing.json (DevEco-style encrypted passwords), its material/ folder, the
// .p12 keystore and the AppGallery Connect .cer and .p7b files.
export function withSigning(profile, dir) {
  const signing = JSON.parse(readFileSync(resolve(dir, "signing.json"), "utf8"));
  const material = { ...signing };
  for (const key of ["storeFile", "certpath", "profile"]) {
    material[key] = resolve(dir, signing[key]);
    if (!existsSync(material[key])) throw new Error("Missing signing file " + material[key]);
  }
  const config = JSON.stringify([{ name: "release", type: "HarmonyOS", material }]);
  if (!profile.includes("signingConfigs: [],") || !profile.includes('name: "default",'))
    throw new Error("build-profile.json5 no longer has the expected signing placeholders");
  return profile
    .replace("signingConfigs: [],", "signingConfigs: " + config + ",")
    .replace('name: "default",', 'name: "default",\n        signingConfig: "release",');
}
