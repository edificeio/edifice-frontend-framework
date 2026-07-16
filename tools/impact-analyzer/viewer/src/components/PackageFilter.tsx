import { useEffect, useRef, useState } from 'react';

export interface PackageFilterProps {
  packages: string[];
  value: string; // 'all' or a package name
  onChange: (value: string) => void;
}

export function PackageFilter({
  packages,
  value,
  onChange,
}: PackageFilterProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!open) return;
    // Moves keyboard focus into the menu as soon as it opens, onto the
    // currently active option — Escape/arrow keys only make sense once
    // focus has actually left the trigger button.
    const items = menuRef.current?.querySelectorAll('button');
    if (!items || items.length === 0) return;
    const activeIndex = [...items].findIndex(
      (el) => el.getAttribute('aria-checked') === 'true',
    );
    (items[activeIndex] ?? items[0]).focus();
  }, [open]);

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function select(next: string) {
    onChange(next);
    close();
  }

  function handleMenuKeyDown(event: React.KeyboardEvent<HTMLUListElement>) {
    const items = [...(menuRef.current?.querySelectorAll('button') ?? [])];
    const currentIndex = items.indexOf(
      document.activeElement as HTMLButtonElement,
    );

    if (event.key === 'Escape') {
      event.preventDefault();
      close();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      items[(currentIndex + 1) % items.length]?.focus();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      items[(currentIndex - 1 + items.length) % items.length]?.focus();
    }
  }

  const isActive = value !== 'all';

  return (
    <div className="package-filter-wrapper" ref={wrapperRef}>
      <button
        ref={triggerRef}
        type="button"
        className={`icon-button${isActive ? ' icon-button-active' : ''}`}
        title={isActive ? `Filtré : ${value}` : 'Filtrer par package'}
        aria-label="Filtrer par package"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
      </button>
      {open && (
        <ul
          className="package-filter-menu"
          role="menu"
          aria-label="Filtrer par package"
          ref={menuRef}
          onKeyDown={handleMenuKeyDown}
        >
          <MenuItem
            label="Tous les packages"
            active={value === 'all'}
            onClick={() => select('all')}
          />
          {packages.map((p) => (
            <MenuItem
              key={p}
              label={p}
              active={value === p}
              onClick={() => select(p)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

interface MenuItemProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

function MenuItem({ label, active, onClick }: MenuItemProps) {
  return (
    <li role="none">
      <button
        type="button"
        role="menuitemradio"
        aria-checked={active}
        className={active ? 'package-filter-option-active' : ''}
        onClick={onClick}
      >
        <span>{label}</span>
        {active && (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </button>
    </li>
  );
}
