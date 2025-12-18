module.exports = {
    extends: ["@commitlint/config-conventional"],
  
    // Enforce: type(!?)(scope): subject
    // scope must be: fe|be|full optionally + "-<work>"
    // Examples:
    // feat!(fe-shop): ...
    // fix(be): ...
    // chore(full-auth): ...
    parserPreset: {
      parserOpts: {
        headerPattern:
          /^(\w+)(!)?\((fe|be|full)(-[a-z0-9]+)?\): (.+)$/,
        headerCorrespondence: ["type", "breaking", "for", "work", "subject"],
      },
    },
  
    rules: {
      // keep conventional types
      "type-enum": [
        2,
        "always",
        [
          "feat",
          "fix",
          "docs",
          "style",
          "refactor",
          "perf",
          "test",
          "build",
          "ci",
          "chore",
          "revert",
        ],
      ],
  
      // require scope and subject (your format needs scope)
      "scope-empty": [2, "never"],
      "subject-empty": [2, "never"],
  
      // optional but helpful
      "subject-min-length": [2, "always", 3],
    },
  };
  