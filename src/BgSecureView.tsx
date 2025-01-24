import { requireNativeView } from 'expo';
import * as React from 'react';

import { BgSecureViewProps } from './BgSecure.types';

const NativeView: React.ComponentType<BgSecureViewProps> =
  requireNativeView('BgSecure');

export default function BgSecureView(props: BgSecureViewProps) {
  return <NativeView {...props} />;
}
