export const CROPPED_FULL_ABSOLUTE_STYLES: Record<string, string> = {
  position: 'absolute',
  top: '0',
  right: '0',
  bottom: '0',
  left: '0',
  overflow: 'hidden',
};

export const NOT_INTERACTIVE_STYLES: Record<string, string> = {
  pointerEvents: 'none',
  touchAction: 'none',
};

export const INTERACTIVE_STYLES: Record<string, string> = {
  pointerEvents: 'all',
  touchAction: 'auto',
};
