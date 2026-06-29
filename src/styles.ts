/** @public Style used for masks and mask inners, exposed to use with external rendered */
export const CroppedFullAbsoluteStyles: Record<string, string> = {
  position: 'absolute',
  top: '0',
  right: '0',
  bottom: '0',
  left: '0',
  overflow: 'hidden',
};

/** @public Style for immerser root, to make in click transparent, exposed to use with external rendered */
export const NotInteractiveStyles: Record<string, string> = {
  pointerEvents: 'none',
  touchAction: 'none',
};

/** @public Style for immerser solids, to make them clickable again inside not clickable immerser root, exposed to use with external rendered */
export const InteractiveStyles: Record<string, string> = {
  pointerEvents: 'all',
  touchAction: 'auto',
};
