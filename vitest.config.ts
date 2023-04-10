import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    include: [
      "./web/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
      "./infra/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
    ],
    globals: true,
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
    reporters: ["verbose", "vitest-sonar-reporter"],
    outputFile: {
      "vitest-sonar-reporter": "report/sonar-report.xml",
    },
    coverage: {
      provider: "c8",
      all: true,
      src: ["./web", "./infra"],
      exclude: [
        "**/__generated__",
        "**/cdk.out",
        "**/vite*.ts",
        "**/?(*.)+(spec|test).+(ts|tsx|js)",
      ],
      reporter: ["text", "html", "lcov"],
    },
  },
});
