import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.cuidarbem.app",
  appName: "CuidarBem",
  webDir: "dist",
  bundledWebRuntime: false,
  ios: {
    contentInset: "always",
  },
};

export default config;
