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
    files: ["**/*.test.mjs", "*.config.mjs", "scripts/**/*.mjs"],
    languageOptions: { globals: globals.node },
  },
  prettier,
];
