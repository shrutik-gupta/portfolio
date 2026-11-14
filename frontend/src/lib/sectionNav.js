import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSmoothScroll } from './SmoothScroll';

/**
 * Go to a section by id. On the home document that is a scroll; from any
 * other route it is a navigation that lands on the section (Home reads
 * `location.state.section` once its triggers are measured).
 */
export const useSectionNav = () => {
  const navigate = useNavigate();
  const { scrollTo } = useSmoothScroll();

  return useCallback(
    (section, options = {}) => {
      const el = document.getElementById(section);
      if (el) {
        scrollTo(el, { offset: 0, ...options });
        return;
      }
      navigate('/', { state: { section } });
    },
    [navigate, scrollTo],
  );
};

export default useSectionNav;
