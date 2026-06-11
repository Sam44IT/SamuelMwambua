import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const viteBin = path.join(
  rootDir,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "vite.cmd" : "vite",
);

const processes = [
  {
    name: "api",
    command: process.execPath,
    args: ["server.js"],
    shell: false,
  },
  {
    name: "vite",
    command: viteBin,
    args: [],
    shell: process.platform === "win32",
  },
];

const children = processes.map(({ name, command, args, shell }) => {
  const child = spawn(command, args, {
    cwd: rootDir,
    stdio: "inherit",
    shell,
    env: {
      ...process.env,
      NODE_ENV: process.env.NODE_ENV || "development",
    },
  });

  child.on("exit", (code, signal) => {
    if (signal) {
      console.log(`${name} stopped with signal ${signal}`);
      return;
    }

    if (code && code !== 0) {
      console.error(`${name} exited with code ${code}`);
      shutdown(code);
    }
  });

  return child;
});

const shutdown = (code = 0) => {
  children.forEach((child) => {
    if (!child.killed) child.kill();
  });
  process.exit(code);
};

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
