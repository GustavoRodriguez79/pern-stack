import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    files: ["src/**/*.js"],
    languageOptions: { ecmaVersion: "latest", sourceType: "module", globals: globals.node },
    rules: {
      // Express reconoce el manejador de errores por sus 4 parámetros.
      "no-unused-vars": ["error", { args: "after-used", argsIgnorePattern: "^(next|_)" }],
    },
  },
];
