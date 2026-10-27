import { existsSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

export function deveco() {
  const home = process.env.DEVECO_STUDIO_HOME || "/Applications/DevEco-Studio.app/Contents";
  const nodeHome = join(home, "tools", "node");
  const node = join(nodeHome, process.platform === "win32" ? "node.exe" : "bin/node");
  if (!existsSync(node))
    throw new Error(
      "Set DEVECO_STUDIO_HOME to DevEco Studio's Contents directory (or its Windows install directory)"
    );
  const env = {
    ...process.env,
    NODE_HOME: nodeHome,
    DEVECO_SDK_HOME: process.env.DEVECO_SDK_HOME || join(home, "sdk"),
    JAVA_HOME:
      process.env.JAVA_HOME ||
      join(home, process.platform === "darwin" ? "jbr/Contents/Home" : "jbr"),
  };
  return { home, node, env };
}

export function run(command, args, env = process.env) {
  const result = spawnSync(command, args, { env, stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error("Command failed with exit code " + result.status);
}
