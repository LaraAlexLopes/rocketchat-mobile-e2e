import { device } from '../utils/device';

export const goOffline = (): Promise<void> => device.setAirplaneMode(true);

export const goOnline = (): Promise<void> => device.setAirplaneMode(false);
