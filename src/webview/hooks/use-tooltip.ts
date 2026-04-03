import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  arrow,
  autoUpdate,
  flip,
  offset,
  type Placement,
  shift,
  useFloating
} from '@floating-ui/react';

interface UseTooltipOptions {
  content: React.ReactNode;
  delay?: number;
  placement?: Placement;
}

interface TooltipTriggerProps {
  ref: React.Ref<any>;
  'aria-describedby': string | undefined;
  onMouseEnter: (e: React.MouseEvent) => void;
  onMouseLeave: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onFocus: (e: React.FocusEvent) => void;
  onBlur: (e: React.FocusEvent) => void;
}

interface UseTooltipReturn {
  triggerProps: TooltipTriggerProps;
  renderTooltip: () => React.ReactPortal | null;
}

export function useTooltip({
  content,
  delay = 200,
  placement = 'top'
}: UseTooltipOptions): UseTooltipReturn {
  const [isVisible, setIsVisible] = useState(false);
  const [isSuppressed, setIsSuppressed] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const tooltipId = useId();

  const { refs, floatingStyles, middlewareData, placement: resolvedPlacement } = useFloating({
    placement,
    open: isVisible && !isSuppressed,
    middleware: [offset(10), flip(), shift({ padding: 8 }), arrow({ element: arrowRef })],
    whileElementsMounted: autoUpdate
  });

  const clearTimer = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const show = useCallback(() => {
    clearTimer();
    timeoutRef.current = window.setTimeout(() => {
      setIsVisible(true);
      setIsSuppressed(false);
    }, delay);
  }, [delay]);

  const hide = useCallback(() => {
    clearTimer();
    setIsVisible(false);
    setIsSuppressed(false);
  }, []);

  useEffect(() => {
    return () => clearTimer();
  }, []);

  const visible = isVisible && !isSuppressed;

  const triggerProps: TooltipTriggerProps = {
    ref: refs.setReference,
    'aria-describedby': visible ? tooltipId : undefined,
    onMouseEnter: () => show(),
    onMouseLeave: () => hide(),
    onMouseMove: (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      const triggerEl = e.currentTarget as HTMLElement;
      const titledElement = target.closest('[title]') as HTMLElement | null;
      const isOverTitled =
        titledElement !== null &&
        titledElement !== triggerEl &&
        triggerEl.contains(titledElement);

      if (isOverTitled && !isSuppressed) {
        setIsSuppressed(true);
      } else if (!isOverTitled && isSuppressed) {
        setIsSuppressed(false);
        if (!isVisible) {
          show();
        }
      }
    },
    onFocus: () => show(),
    onBlur: () => hide()
  };

  const renderTooltip = (): React.ReactPortal | null => {
    if (!visible) return null;

    const side = resolvedPlacement.split('-')[0] as 'top' | 'bottom' | 'left' | 'right';
    const staticSide = ({ top: 'bottom', bottom: 'top', left: 'right', right: 'left' } as const)[side];
    const arrowX = middlewareData.arrow?.x;
    const arrowY = middlewareData.arrow?.y;

    const element = React.createElement(
      'div',
      {
        id: tooltipId,
        ref: refs.setFloating,
        role: 'tooltip',
        className: 'custom-tooltip',
        style: floatingStyles
      },
      React.createElement(
        'div',
        { className: 'custom-tooltip-content' },
        content
      ),
      React.createElement('div', {
        ref: arrowRef,
        className: `custom-tooltip-arrow custom-tooltip-arrow--${side}`,
        style: {
          left: arrowX != null ? `${arrowX}px` : '',
          top: arrowY != null ? `${arrowY}px` : '',
          [staticSide]: '-4px'
        }
      })
    );

    return createPortal(element, document.body);
  };

  return { triggerProps, renderTooltip };
}
