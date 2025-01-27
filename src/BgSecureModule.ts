import { NativeEventEmitter } from 'react-native';
import { requireNativeModule } from 'expo-modules-core';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { BgSecureInterface } from './BgSecure.types';

console.log('🔍 Initializing BgSecureModule...');

type FN = (resp: any) => void;
type Return = {
	readonly remove: () => void;
};

// Initialize native module
let BgSecureNative;
try {
	if (Platform.OS !== 'web') {
		BgSecureNative = requireNativeModule('BgSecure');
		console.log('✅ Native module methods:', Object.keys(BgSecureNative));
	}
} catch (error) {
	console.error('❌ Failed to load native module:', error);
}

// Create module interface
const createBgSecure = (): BgSecureInterface => {
	if (Platform.OS !== 'web' && BgSecureNative) {
		console.log('📱 Creating native interface');
		return {
			enableSecureView(imagePath: string = '') {
				console.log('📱 Calling native enableSecureView with:', imagePath);
				if (typeof BgSecureNative.enableSecureView === 'function') {
					BgSecureNative.enableSecureView(imagePath);
				} else {
					console.error('❌ Native enableSecureView method not found');
				}
			},
			disableSecureView() {
				console.log('📱 Calling native disableSecureView');
				if (typeof BgSecureNative.disableSecureView === 'function') {
					BgSecureNative.disableSecureView();
				} else {
					console.error('❌ Native disableSecureView method not found');
				}
			},
		};
	}

	console.log('🌐 Creating web interface');
	return {
		enableSecureView(imagePath: string = '') {
			console.warn(
				'BgSecure: enableSecureView not work in web.' +
					(!!imagePath ? ' send: ' + imagePath : '')
			);
		},
		disableSecureView() {
			console.warn('BgSecure: disableSecureView not work in web');
		},
	};
};

const BgSecure = createBgSecure();
console.log('✅ BgSecure module initialized');

// Set up event emitter
const eventEmitter =
	Platform.OS !== 'web' && BgSecureNative
		? new NativeEventEmitter(BgSecureNative)
		: null;

export const addListener = (fn: FN): Return => {
	if (typeof fn !== 'function') {
		console.error('BgSecure: addListener requires valid callback function');
		return {
			remove: () => {
				console.error(
					'BgSecure: remove not work because addListener requires valid callback function'
				);
			},
		};
	}

	if (!eventEmitter) {
		console.warn('BgSecure: addListener not available');
		return {
			remove: () => {
				console.warn('BgSecure: remove addListener not available');
			},
		};
	}

	return eventEmitter.addListener('onScreenshot', fn);
};

export const useSecureView = (imagePath: string = '') => {
	useEffect(() => {
		BgSecure.enableSecureView(imagePath);
		return () => {
			BgSecure.disableSecureView();
		};
	}, [imagePath]);
};

export { BgSecure };
export default BgSecure;
