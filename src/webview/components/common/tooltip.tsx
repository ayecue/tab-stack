import React, {
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState
} from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  delay?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  delay = 200
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const showTooltip = (event: React.MouseEvent) => {
    // Capture the target element immediately before the event is recycled
    const target = event.currentTarget as HTMLElement;

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      if (target) {
        const rect = target.getBoundingClientRect();
        setPosition({
          top: rect.top,
          left: rect.left + rect.width / 2
        });
        setIsVisible(true);
      }
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
    setPosition(null);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Clone the child element and add mouse event handlers
  const childElement = isValidElement(children)
    ? cloneElement(children as React.ReactElement<any>, {
        onMouseEnter: (e: React.MouseEvent) => {
          showTooltip(e);
          const originalOnMouseEnter = (children as any)?.props?.onMouseEnter;
          if (originalOnMouseEnter) originalOnMouseEnter(e);
        },
        onMouseLeave: (e: React.MouseEvent) => {
          hideTooltip();
          const originalOnMouseLeave = (children as any)?.props?.onMouseLeave;
          if (originalOnMouseLeave) originalOnMouseLeave(e);
        }
      })
    : children;

  const tooltipElement =
    isVisible && position ? (
      <div
        className="custom-tooltip"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          position: 'fixed'
        }}
      >
        <div className="custom-tooltip-content">{content}</div>
      </div>
    ) : null;

  return (
    <>
      {childElement}
      {tooltipElement && createPortal(tooltipElement, document.body)}
    </>
  );
};
