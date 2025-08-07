import { forceRemovePrivacyOverlayAsync } from './BgSecureModule';
import React, { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';

interface PrivacyOverlayCleanupProps {
	children: React.ReactNode;
}

export const PrivacyOverlayCleanup: React.FC<PrivacyOverlayCleanupProps> = ({
	children,
}) => {
	useEffect(() => {
		const handleAppStateChange = (nextAppState: AppStateStatus) => {
			if (nextAppState === 'active') {
				// Force cleanup when app becomes active
				setTimeout(() => {
					forceRemovePrivacyOverlayAsync().catch(console.error);
				}, 100);
			}
		};

		const subscription = AppState.addEventListener(
			'change',
			handleAppStateChange
		);

		return () => {
			subscription?.remove();
		};
	}, []);

	return <>{children}</>;
};
