import { requireNativeModule } from 'expo-modules-core';

// It loads the native module object from the JSI or falls back to
// the bridge module (from NativeModulesProxy) if the remote debugger is on.
const BgSecure = requireNativeModule('BgSecure');

export default BgSecure;

export interface BgSecureInterface {
	/**
	 * Enables or disables secure mode which prevents screenshots and recording
	 * @param enable - Whether to enable or disable secure mode
	 */
	enabled(enable: boolean): void;

	/**
	 * Sets the background color for the secure view overlay
	 * @param color - Color in hex format (e.g. "#000000" for black)
	 */
	setBackgroundColor(color: string): void;

	/**
	 * Enables secure view mode with a custom image shown in app switcher
	 * @param imagePath - URL or local path to the image to show in app switcher
	 */
	enableSecureView(imagePath: string): void;

	/**
	 * Disables secure view mode and removes the custom image
	 */
	disableSecureView(): void;
}
