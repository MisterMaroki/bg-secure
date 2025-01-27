import React, { useEffect, useState } from 'react';
import {
	View,
	AppState,
	AppStateStatus,
	StyleSheet,
	Platform,
	Image,
	ImageSourcePropType,
	Text,
} from 'react-native';

interface SecureOverlayProps {
	image?: ImageSourcePropType;
	gradientColors?: string[];
	backgroundColor?: string;
	children?: React.ReactNode;
}

export const SecureOverlay: React.FC<SecureOverlayProps> = ({
	image,
	gradientColors,
	backgroundColor,
	children,
}) => {
	const [isActive, setIsActive] = useState(true);

	useEffect(() => {
		const subscription = AppState.addEventListener(
			'change',
			(nextAppState: AppStateStatus) => {
				setIsActive(nextAppState === 'active');
			}
		);

		return () => {
			subscription.remove();
		};
	}, []);

	if (Platform.OS !== 'ios' || isActive) {
		return null;
	}

	return (
		<View style={[styles.overlay, { backgroundColor }]}>
			{children}
			{/* example children */}
			{/* <LinearGradient
				colors={gradientColors}
				style={styles.gradient}
				start={{ x: 0, y: 0 }}
				end={{ x: 0, y: 1 }}
			>
				{image ? (
					<Image
						source={image}
						style={styles.secureImage}
						resizeMode="contain"
					/>
				) : null}
			</LinearGradient> */}
		</View>
	);
};

const styles = StyleSheet.create({
	overlay: {
		...StyleSheet.absoluteFillObject,
	},
	gradient: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	secureImage: {
		width: '80%',
		height: '80%',
	},
});
