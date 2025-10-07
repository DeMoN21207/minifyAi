export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then(() => {
          console.info('Service worker registered');
        })
        .catch((error) => {
          console.error('Service worker registration failed', error);
        });
    });
  }
};
