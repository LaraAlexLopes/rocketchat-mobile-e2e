import 'dotenv/config';
import path from 'node:path';

const read = (name: string, fallback: string): string => process.env[name]?.trim() || fallback;

export const env = {
  apiUrl: read('API_URL', 'http://localhost:3000'),
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
