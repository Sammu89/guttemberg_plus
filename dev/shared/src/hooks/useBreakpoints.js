/**
 * useBreakpoints Hook
 *
 * Manages responsive breakpoint settings for Guttemberg Plus
 * Provides loading, saving, and accessing breakpoint values
 *
 * @package GuttembergPlus
 * @since 1.0.0
 */

import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

const DEFAULT_BREAKPOINTS = {
  mobile: 600,
  tablet: 1024
};

export function useBreakpoints() {
  const [breakpoints, setBreakpoints] = useState(
    window.guttembergPlusSettings?.breakpoints || DEFAULT_BREAKPOINTS
  );
  const [isLoading, setIsLoading] = useState(false);

  // Load breakpoints from WordPress option
  useEffect(() => {
    const loadBreakpoints = async () => {
      try {
        setIsLoading(true);
        const response = await apiFetch({
          path: '/gutenberg-blocks/v1/settings/breakpoints',
        });
        if (response?.mobile && response?.tablet) {
          setBreakpoints(response);
        }
      } catch (error) {
        console.warn('Using default breakpoints:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadBreakpoints();
  }, []);

  // Save breakpoints
  const saveBreakpoints = async (newBreakpoints) => {
    try {
      await apiFetch({
        path: '/gutenberg-blocks/v1/settings/breakpoints',
        method: 'POST',
        data: newBreakpoints,
      });
      setBreakpoints(newBreakpoints);
      return true;
    } catch (error) {
      console.error('Failed to save breakpoints:', error);
      return false;
    }
  };

  return {
    breakpoints,
    setBreakpoints: saveBreakpoints,
    isLoading,
    DEFAULT_BREAKPOINTS
  };
}
