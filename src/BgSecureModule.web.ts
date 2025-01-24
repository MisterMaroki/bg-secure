import { registerWebModule, NativeModule } from 'expo';

import { BgSecureModuleEvents } from './BgSecure.types';

class BgSecureModule extends NativeModule<BgSecureModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(BgSecureModule);
