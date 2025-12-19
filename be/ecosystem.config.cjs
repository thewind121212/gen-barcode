module.exports = {
  apps: [
    {
      name: "ciri-be",
      script: "dist/core/index.js",
      interpreter: "bun",
      // Use 1 instance by default; can be overridden via PM2 env/CLI
      instances: 1,
      exec_mode: "fork",
      // Environment variables are taken from the container runtime
      // (Docker/Kubernetes), matching what you define in `.env.example`.
      env: {},
      max_restarts: 10,
      restart_delay: 2000,
      kill_timeout: 8000,
      listen_timeout: 8000,
    },
  ],
};
