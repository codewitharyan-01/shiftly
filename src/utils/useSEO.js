import { useEffect } from 'react';

const useSEO = (title, description) => {
  useEffect(() => {
    const defaultTitle = 'Shiftly';
    document.title = title ? `${title} | ${defaultTitle}` : defaultTitle;

    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.name = 'description';
        document.head.appendChild(metaDescription);
      }
      metaDescription.content = description;
    }
  }, [title, description]);
};

export default useSEO;
