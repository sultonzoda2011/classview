import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.classview.app',
  appName: 'ClassView',
  webDir: 'dist',
  android: {
    allowMixedContent: false,
  },
};

export default config;
