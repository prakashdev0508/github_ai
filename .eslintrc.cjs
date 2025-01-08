/** @type {import("eslint").Linter.Config} */
const config = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json", // Ensure this points to your tsconfig.json
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "next/core-web-vitals",

  ],
  rules : {}
};
module.exports = config;
