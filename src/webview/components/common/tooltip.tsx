import type { Placement } from '@floating-ui/react';
import React, { cloneElement, isValidElement } from 'react';

import { useTooltip } from '../../hooks/use-tooltip';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  delay?: number;
  placement?: Placement;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  delay = 200,
  placement = 'top'
}) => {
  const { triggerProps, renderTooltip } = useTooltip({
    content,
    delay,
    placement
  });

  const childElement = isValidElement(children)
    ? cloneElement(children as React.ReactElement<any>, {
        ref: triggerProps.ref,
        'aria-describedby': triggerProps['aria-describedby'],
        onMouseEnter: (e: React.MouseEvent) => {
          triggerProps.onMouseEnter(e);
          const originalOnMouseEnter = (children as any)?.props?.onMouseEnter;
          if (originalOnMouseEnter) originalOnMouseEnter(e);
        },
        onMouseLeave: (e: React.MouseEvent) => {
          triggerProps.onMouseLeave(e);
          const originalOnMouseLeave = (children as any)?.props?.onMouseLeave;
          if (originalOnMouseLeave) originalOnMouseLeave(e);
        },
        onMouseMove: (e: React.MouseEvent) => {
          triggerProps.onMouseMove(e);
          const originalOnMouseMove = (children as any)?.props?.onMouseMove;
          if (originalOnMouseMove) originalOnMouseMove(e);
        },
        onFocus: (e: React.FocusEvent) => {
          triggerProps.onFocus(e);
          const originalOnFocus = (children as any)?.props?.onFocus;
          if (originalOnFocus) originalOnFocus(e);
        },
        onBlur: (e: React.FocusEvent) => {
          triggerProps.onBlur(e);
          const originalOnBlur = (children as any)?.props?.onBlur;
          if (originalOnBlur) originalOnBlur(e);
        }
      })
    : children;

  return (
    <>
      {childElement}
      {renderTooltip()}
    </>
  );
};
