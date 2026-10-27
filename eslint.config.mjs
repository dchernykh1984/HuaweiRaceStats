import js from "@eslint/js";
import globals from "globals";
import prettier from "eslint-config-prettier";

export default [
  {
    ignores: [
      "node_modules/",
      "**/build/",
      "dist/",
      "coverage/",
      ".hvigor/",
      "entry/src/main/js/MainAbility/common/lib/",
    ],
  },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        ...globals.es2021,
        console: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
      },
    },
  },
  {
    // Lite JerryScript is built without RegExp, so the watch has no regex literals
    // and no String methods built on them.
    files: ["lib/**/*.js", "entry/**/*.js"],
    rules: {
      "no-restricted-properties": [
        "error",
        ...["replace", "replaceAll", "match", "matchAll", "search"].map((property) => ({
          property,
          message: "Lite Wearable has no RegExp; use indexOf, slice and split.",
        })),
      ],
      "no-restricted-syntax": [
        "error",
        { selector: "Literal[regex]", message: "Lite Wearable has no RegExp." },
        { selector: "Identifier[name='RegExp']", message: "Lite Wearable has no RegExp." },
      ],
    },
  },
  {
    files: ["**/*.test.mjs", "*.config.mjs", "scripts/**/*.mjs"],
    languageOptions: { globals: globals.node },
  },
  prettier,
];
