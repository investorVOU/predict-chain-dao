import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.0cc9b0fc591a4823b9f04df969ebfa16',
  appName: 'predict-chain-dao',
  webDir: 'dist',
  server: {
    url: 'https://0cc9b0fc-591a-4823-b9f0-4df969ebfa16.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: "#0f0f23",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#4f46e5",
      splashFullScreen: true,
      splashImmersive: true,
    }
  }
};

export default config;