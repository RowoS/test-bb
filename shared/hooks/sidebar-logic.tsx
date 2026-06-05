import { useState, useCallback } from 'react';

export const useSidebarLogic = () => {
  // isLocked determines if the sidebar is permanently open via click
  const [isLocked, setIsLocked] = useState(true);
  
  // isHovered determines if the sidebar is temporarily open via hover
  const [isHovered, setIsHovered] = useState(false);
  
  // The actual visual state
  const isOpen = isLocked || isHovered;

  const toggleLock = useCallback(() => {
    setIsLocked((prev) => {
      const nextState = !prev;
      // If unlocking, sync hover state to prevent snapping shut immediately if mouse is present
      if (!nextState) setIsHovered(true);
      return nextState;
    });
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (!isLocked) setIsHovered(true);
  }, [isLocked]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return {
    isOpen,
    isLocked,
    toggleLock,
    containerProps: {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    }
  };
};