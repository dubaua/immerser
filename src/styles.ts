export const CroppedFullAbsoluteStyles: Record<string, string> = {
  position: 'absolute',
  top: '0',
  right: '0',
  bottom: '0',
  left: '0',
  overflow: 'hidden',
};

export const NotInteractiveStyles: Record<string, string> = {
  pointerEvents: 'none',
  touchAction: 'none',
};

export const InteractiveStyles: Record<string, string> = {
  pointerEvents: 'all',
  touchAction: 'auto',
};
