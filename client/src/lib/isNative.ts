import { Capacitor } from '@capacitor/core';

export default function isNative() {
    return Capacitor.isNativePlatform();
}