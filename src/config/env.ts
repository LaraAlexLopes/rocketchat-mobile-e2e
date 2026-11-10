import 'dotenv/config';
import path from 'node:path';

const read = (name: string, fallback: string): string => process.env[name]?.trim() || fallback;

export const env = {
  /** Server URL used by the test runner for API seeding and cleanup. */
  apiUrl: read('API_URL', 'http://localhost:3000'),
  /** Server URL typed into the app. 10.0.2.2 is the host machine from inside the Android emulator. */
  appServerUrl: read('APP_SERVER_URL', 'http://10.0.2.2:3000'),
  admin: {
    username: read('ADMIN_USERNAME', 'admin.e2e'),
    password: read('ADMIN_PASSWORD', 'Admin@e2e123'),
  },
  deviceName: read('DEVICE_NAME', 'emulator-5554'),
  apkPath: path.resolve(read('APK_PATH', 'apps/rocketchat.apk')),
  appPackage: 'chat.rocket.android',
  dataPrefix: read('DATA_PREFIX', 'qa'),
} as const;
