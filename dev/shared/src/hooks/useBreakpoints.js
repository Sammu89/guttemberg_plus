/**
 * useBreakpoints Hook
 *
 * Manages responsive breakpoint settings for Guttemberg Plus
 * Provides loading, saving, and accessing breakpoint values with manual save support
 *
 * @package GuttembergPlus
 * @since 1.0.0
 */

import { useState, useEffect, useMemo } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

const DEFAULT_BREAKPOINTS = {
  mobile: 481,
  tablet: 768
};

export function useBreakpoints() {
  // Saved breakpoints (from server)
  const [breakpoints, setBreakpoints] = useState(
    window.guttembergPlusSettings?.breakpoints || DEFAULT_BREAKPOINTS
  );

  // Local editing state (unsaved changes)
  const [localBreakpoints, setLocalBreakpoints] = useState(breakpoints);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
          setLocalBreakpoints(response);
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };
    loadBreakpoints();
  }, []);

  // Check if there are unsaved changes
  const hasUnsavedChanges = useMemo(() => {
    return localBreakpoints.mobile !== breakpoints.mobile ||
           localBreakpoints.tablet !== breakpoints.tablet;
  }, [localBreakpoints, breakpoints]);

  // Check if saved values differ from defaults
  const hasChangesFromDefaults = useMemo(() => {
    return breakpoints.mobile !== DEFAULT_BREAKPOINTS.mobile ||
           breakpoints.tablet !== DEFAULT_BREAKPOINTS.tablet;
  }, [breakpoints]);

  // Save breakpoints to server
  const saveBreakpoints = async () => {
    try {
      setIsSaving(true);
      const response = await apiFetch({
        path: '/gutenberg-blocks/v1/settings/breakpoints',
        method: 'POST',
        data: localBreakpoints,
      });
      if (response?.mobile && response?.tablet) {
        setBreakpoints(response);
        return { success: true, data: response };
      }
      return { success: false, error: 'Invalid response from server' };
    } catch (error) {
      return { success: false, error: error.message || 'Unknown error' };
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to default breakpoints
  const resetToDefaults = async () => {
    try {
      setIsSaving(true);
      const response = await apiFetch({
        path: '/gutenberg-blocks/v1/settings/breakpoints',
        method: 'POST',
        data: DEFAULT_BREAKPOINTS,
      });
      if (response?.mobile && response?.tablet) {
        setBreakpoints(response);
        setLocalBreakpoints(response);
        return { success: true, data: response };
      }
      return { success: false, error: 'Invalid response from server' };
    } catch (error) {
      return { success: false, error: error.message || 'Unknown error' };
    } finally {
      setIsSaving(false);
    }
  };

  return {
    breakpoints,              // Saved/server state
    localBreakpoints,         // Local editing state
    setLocalBreakpoints,      // Update local state (no save)
    saveBreakpoints,          // Save to server
    resetToDefaults,          // Reset to defaults and save
    hasUnsavedChanges,        // Has unsaved edits?
    hasChangesFromDefaults,   // Saved values differ from defaults?
    isLoading,                // Loading from server
    isSaving,                 // Saving to server
    DEFAULT_BREAKPOINTS       // Default values constant
  };
}
