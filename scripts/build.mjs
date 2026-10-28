import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { deveco, run } from "./deveco.mjs";
import { syncVersion } from "./sync-app-version.mjs";
import { withSigning } from "./signing.mjs";
import "./prepare-app.mjs";

const { home, node, env } = deveco();
const mode = process.argv.includes("--debug") ? "debug" : "release";
const manifest = "entry/src/main/config.json";
const tracked = readFileSync(manifest, "utf8");
const buildProfile = "build-profile.json5";
const trackedProfile = readFileSync(buildProfile, "utf8");
const signingDir = process.env.HUAWEI_SIGNING_DIR;
syncVersion(process.cwd());
try {
  if (signingDir) writeFileSync(buildProfile, withSigning(trackedProfile, signingDir));
  run(
    node,
    [
      join(home, "tools/hvigor/bin/hvigorw.js"),
      "--mode",
      "project",
      "-p",
      "product=default",
      "-p",
      "buildMode=" + mode,
      "assembleApp",
      "--no-daemon",
    ],
    env
  );
} finally {
  // The derived version code and private signing belong in the package, not in Git.
  writeFileSync(manifest, tracked);
  writeFileSync(buildProfile, trackedProfile);
}
run(process.execPath, ["scripts/check-native-bundle.mjs"]);
const snapshot = join(
  home,
  "sdk/default/openharmony/js/build-tools/ace-loader/bin/jerry-snapshot" +
    (process.platform === "win32" ? ".exe" : "")
);
const nativePage =
  "entry/build/default/intermediates/loader_out_lite/default/js/MainAbility/pages/index/index.js";
run(snapshot, ["generate", "-o", nativePage + ".bc", nativePage]);
mkdirSync("dist", { recursive: true });
for (const file of readdirSync("dist")) {
  if (/^huawei-race-stats-.*\.(hap|app)$/.test(file)) rmSync(join("dist", file));
}
const version = JSON.parse(readFileSync("package.json", "utf8")).version;
const packages = new Set();
function collect(directory) {
  if (!existsSync(directory)) return;
  for (const item of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, item.name);
    if (item.isDirectory()) collect(path);
    else {
      const match = /-(unsigned|signed)\.(hap|app)$/.exec(item.name);
      if (match) {
        cpSync(
          path,
          join("dist", "huawei-race-stats-" + version + "-" + match[1] + "." + match[2])
        );
        packages.add(match[2]);
      }
    }
  }
}
collect("entry/build/default/outputs");
collect("build/outputs");
if (!packages.has("hap") || !packages.has("app"))
  throw new Error("Hvigor must produce both a HAP and an APP package");
console.log(
  "Huawei packages written to dist/ (unsigned unless a signing configuration is supplied)."
);
