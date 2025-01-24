import { NativeModule, requireNativeModule } from 'expo';

import { BgSecureModuleEvents } from './BgSecure.types';

declare class BgSecureModule extends NativeModule<BgSecureModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<BgSecureModule>('BgSecure');
