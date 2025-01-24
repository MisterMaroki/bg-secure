import * as React from 'react';

import { BgSecureViewProps } from './BgSecure.types';

export default function BgSecureView(props: BgSecureViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
