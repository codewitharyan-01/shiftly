import { useEffect } from 'react';

const useAnalytics = (pageName) => {
  useEffect(() => {
    // Mock Analytics: Track Page View
    console.log(`[Analytics] 📊 Page View: ${pageName}`);
  }, [pageName]);

  const trackClick = (elementName, additionalData = {}) => {
    // Mock Analytics: Track Clicks
    console.log(`[Analytics] 👆 Clicked: ${elementName}`, additionalData);
  };

  return { trackClick };
};

export default useAnalytics;
