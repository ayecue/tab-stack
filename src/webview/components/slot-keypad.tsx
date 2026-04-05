import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Tooltip } from './common/tooltip';

interface SlotKeypadProps {
  assignedSlot: string | undefined;
  occupiedSlots: Record<string, string>;
  groupId: string;
  disabled?: boolean;
  onSlotChange: (slot: string | null) => void;
}

const SLOTS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

export const SlotKeypad: React.FC<SlotKeypadProps> = ({
  assignedSlot,
  occupiedSlots,
  groupId,
  disabled,
  onSlotChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [popoverStyle, setPopoverStyle] = useState<React.CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close on click outside using document listener
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        popoverRef.current &&
        !popoverRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleToggle = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      if (disabled) {
        return;
      }
      setIsOpen((prev) => {
        const next = !prev;
        if (next && triggerRef.current) {
          const rect = triggerRef.current.getBoundingClientRect();
          setPopoverStyle({
            top: rect.bottom + 4,
            right: window.innerWidth - rect.right
          });
        }
        return next;
      });
    },
    [disabled]
  );

  const handleSlotClick = useCallback(
    (event: React.MouseEvent, slot: string) => {
      event.stopPropagation();
      if (disabled) {
        return;
      }

      if (assignedSlot === slot) {
        onSlotChange(null);
        setIsOpen(false);
        return;
      }

      onSlotChange(slot);
      setIsOpen(false);
    },
    [disabled, assignedSlot, onSlotChange]
  );

  const handleClear = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      onSlotChange(null);
      setIsOpen(false);
    },
    [onSlotChange]
  );

  const getSlotStatus = (slot: string) => {
    if (assignedSlot === slot) {
      return 'assigned';
    }
    const occupyingGroupId = occupiedSlots[slot];
    if (occupyingGroupId && occupyingGroupId !== groupId) {
      return 'occupied';
    }
    return 'free';
  };

  return (
    <div
      className={`slot-keypad-container${isOpen ? ' open' : ''}`}
      ref={containerRef}
    >
      <Tooltip content={assignedSlot ? `Slot ${assignedSlot}` : 'Assign slot'}>
        <button
          ref={triggerRef}
          type="button"
          className={`slot-keypad-trigger${assignedSlot ? ' has-slot' : ''}`}
          onClick={handleToggle}
          disabled={disabled}
          aria-expanded={isOpen}
          aria-haspopup="grid"
        >
        {assignedSlot ? (
          <span className="slot-keypad-badge">{assignedSlot}</span>
        ) : (
          <i className="codicon codicon-bookmark" aria-hidden="true" />
        )}
        </button>
      </Tooltip>

      {isOpen && (
        <div
          ref={popoverRef}
          className="slot-keypad-popover"
          role="grid"
          aria-label="Quick slot keypad"
          style={popoverStyle}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="slot-keypad-grid">
            {SLOTS.map((slot) => {
              const status = getSlotStatus(slot);
              return (
                <Tooltip
                  content={
                    status === 'assigned'
                      ? `Slot ${slot} (current \u2013 click to unassign)`
                      : status === 'occupied'
                        ? `Slot ${slot} (in use)`
                        : `Assign slot ${slot}`
                  }
                >
                  <button
                    key={slot}
                    type="button"
                    className={`slot-key ${status}`}
                    onClick={(event) => handleSlotClick(event, slot)}
                    aria-label={`Slot ${slot}`}
                  >
                  <span className="slot-key-number">{slot}</span>
                  {status === 'occupied' && (
                    <span className="slot-key-dot" aria-hidden="true" />
                  )}
                </button>
                </Tooltip>
              );
            })}
          </div>
          {assignedSlot && (
            <button
              type="button"
              className="slot-keypad-clear"
              onClick={handleClear}
            >
              <i className="codicon codicon-close" aria-hidden="true" />
              <span>Clear</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
