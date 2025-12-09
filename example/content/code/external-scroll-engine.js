import Immerser from 'immerser';

const immerserInstance = new Immerser({
  // <%= getTranslation('recipes-disable-scroll-handling-with-external-scroll') %>
  isScrollHandled: false,
});

customScrollEngine.on('scroll', () => {
  // <%= getTranslation('recipes-sync-with-external-engine') %>
  immerserInstance.syncScroll();
});
