import { cpSync, mkdirSync } from "node:fs";

const destination = "entry/src/main/js/MainAbility/common/lib";
mkdirSync(destination, { recursive: true });
cpSync("lib", destination, { recursive: true });
