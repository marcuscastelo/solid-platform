export default {
  files: ["src/modules/**/*.{ts,tsx}"],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: ["~/capabilities/**"],
            message: "Modules must not depend on capabilities.",
          },
        ],
      },
    ],
  },
};
