import {
	UnavailabilityError,
	requireNativeModule,
	EventSubscription,
} from 'expo-modules-core';
import { useEffect } from 'react';
import { Platform } from 'react-native';

const BgSecure = requireNativeModule('BgSecure');

const activeTags: Set<string> = new Set();
let isAppSwitcherProtectionEnabled = false;

export async function enableSecureViewAsync(
	key: string = 'default'
): Promise<void> {
	if (!BgSecure.enableSecureView) {
		throw new UnavailabilityError('BgSecure', 'enableSecureViewAsync');
	}

	if (!activeTags.has(key)) {
		activeTags.add(key);
		await BgSecure.enableSecureView();
	}
}

export async function disableSecureViewAsync(
	key: string = 'default'
): Promise<void> {
	if (!BgSecure.enableSecureView) {
		throw new UnavailabilityError('BgSecure', 'disableSecureViewAsync');
	}

	activeTags.delete(key);
	if (activeTags.size === 0) {
		await BgSecure.disableSecureView();
	}
}

export async function enableAppSwitcherProtectionAsync(): Promise<void> {
	if (!BgSecure.enableAppSwitcherProtection) {
		throw new UnavailabilityError(
			'BgSecure',
			'enableAppSwitcherProtectionAsync'
		);
	}

	if (!isAppSwitcherProtectionEnabled && Platform.OS === 'ios') {
		await BgSecure.enableAppSwitcherProtection();
		isAppSwitcherProtectionEnabled = true;
	}
}

export async function disableAppSwitcherProtectionAsync(): Promise<void> {
	if (!BgSecure.disableAppSwitcherProtection) {
		throw new UnavailabilityError(
			'BgSecure',
			'disableAppSwitcherProtectionAsync'
		);
	}

	if (isAppSwitcherProtectionEnabled && Platform.OS === 'ios') {
		await BgSecure.disableAppSwitcherProtection();
		isAppSwitcherProtectionEnabled = false;
	}
}

export async function forceRemovePrivacyOverlayAsync(): Promise<void> {
	if (!BgSecure.forceRemovePrivacyOverlay) {
		throw new UnavailabilityError('BgSecure', 'forceRemovePrivacyOverlayAsync');
	}

	if (Platform.OS === 'ios') {
		await BgSecure.forceRemovePrivacyOverlay();
	}
}

export function useAppSwitcherProtection(): void {
	useEffect(() => {
		enableAppSwitcherProtectionAsync();

		return () => {
			disableAppSwitcherProtectionAsync();
		};
	}, []);
}
