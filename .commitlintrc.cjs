module.exports = {
    extends: ["@commitlint/config-conventional"],
  
    // Enforce: type(!?)(scope): subject
    // scope must start with: fe|be|full|pipeline, optionally + "-<topic>"
    // Examples:
    // feat!(fe): ...
    // fix(be-ci-cd): ...
    // chore(pipeline-topic): ...
    parserPreset: {
      parserOpts: {
        headerPattern:
          /^(\w+)(!)?\(((?:fe|be|full|pipeline)(?:-[a-z0-9]+)?)\): (.+)$/,
        headerCorrespondence: ["type", "breaking", "scope", "subject"],
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
  