import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Nature, StatKey } from "../types/pokemon";

type NatureSelectProps = {
  value: string;
  natures: Nature[];
  onChange: (name: string) => void;
};

type DropdownPosition = {
  top: number;
  left: number;
  width: number;
};

const statLabels: Record<StatKey, string> = {
  hp: "HP",
  atk: "Atk",
  def: "Def",
  spa: "SpA",
  spd: "SpD",
  spe: "Spe",
};

export function NatureSelect({
  value,
  natures,
  onChange,
}: NatureSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [dropdownPosition, setDropdownPosition] =
    useState<DropdownPosition>({
      top: 0,
      left: 0,
      width: 0,
    });

  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const selectedNature = useMemo(
    () => natures.find((nature) => nature.name === value) ?? natures[0],
    [natures, value]
  );

  function updateDropdownPosition() {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();

    setDropdownPosition({
      top: rect.bottom + 10,
      left: rect.left,
      width: rect.width,
    });
  }

  function openDropdown() {
    updateDropdownPosition();
    setIsOpen(true);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  useEffect(() => {
    if (!isOpen) return;

    function handleResizeOrScroll() {
      updateDropdownPosition();
    }

    function handleClickOutside(event: MouseEvent) {
      const target = event.target;

      if (!(target instanceof Node)) return;

      if (!buttonRef.current?.contains(target)) {
        closeDropdown();
      }
    }

    window.addEventListener("resize", handleResizeOrScroll);
    window.addEventListener("scroll", handleResizeOrScroll, true);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("resize", handleResizeOrScroll);
      window.removeEventListener("scroll", handleResizeOrScroll, true);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="nature-select">
      <button
        ref={buttonRef}
        type="button"
        className="nature-select-button"
        onClick={() => {
          if (isOpen) {
            closeDropdown();
          } else {
            openDropdown();
          }
        }}
      >
        <span>{selectedNature.name}</span>

        <span className="nature-effects">
          {selectedNature.increased &&
          selectedNature.decreased ? (
            <>
              <span className="nature-effect nature-up">
                ▲ {statLabels[selectedNature.increased]}
              </span>

              <span className="nature-effect nature-down">
                ▼ {statLabels[selectedNature.decreased]}
              </span>
            </>
          ) : (
            <span className="nature-neutral">
              Neutral
            </span>
          )}
        </span>
      </button>

      {isOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="nature-options nature-options-fixed"
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: dropdownPosition.width,
            }}
          >
            {natures.map((nature) => (
              <button
                key={nature.name}
                type="button"
                className={`nature-option ${
                  nature.name === value
                    ? "nature-option-active"
                    : ""
                }`}
                onMouseDown={(event) => {
                  event.preventDefault();

                  onChange(nature.name);
                  closeDropdown();
                }}
              >
                <span>{nature.name}</span>

                <span className="nature-effects">
                  {nature.increased &&
                  nature.decreased ? (
                    <>
                      <span className="nature-effect nature-up">
                        ▲ {statLabels[nature.increased]}
                      </span>

                      <span className="nature-effect nature-down">
                        ▼ {statLabels[nature.decreased]}
                      </span>
                    </>
                  ) : (
                    <span className="nature-neutral">
                      Neutral
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
}