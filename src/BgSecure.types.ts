export type ChangeEventPayload = {
  value: string;
};

export type BgSecureViewProps = {
  name: string;
};

export interface BgSecureInterface {
  /**
   * Enable or disable secure mode
   * @param enable Whether to enable secure mode
   */
  enabled(enable: boolean): void;

  /**
   * Enable secure view with a custom image for app switcher
   * @param imagePath URL or local path to the image
   */
  enableSecureView(imagePath: string): void;

  /**
   * Disable secure view and remove custom image
   */
  disableSecureView(): void;
}
