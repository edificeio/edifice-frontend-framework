import { useEffect, useRef, useState } from 'react';

interface SmartEllipsisProps {
  text: string;
}

export default function SmartEllipsis({ text }: SmartEllipsisProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayText, setDisplayText] = useState(text);

  const updateText = () => {
    const el = ref.current;
    if (!el) return;

    el.textContent = text;

    if (el.scrollWidth > el.clientWidth) {
      let startText = text.slice(0, Math.ceil(text.length / 2));
      let endText = text.slice(Math.ceil(text.length / 2));

      while (
        startText.length > 1 &&
        endText.length > 1 &&
        el.scrollWidth > el.clientWidth
      ) {
        startText = startText.slice(0, -1);
        endText = endText.slice(1);
        el.textContent = `${startText}…${endText}`;
      }

      setDisplayText(el.textContent);
    } else {
      setDisplayText(text);
    }
  };

  useEffect(() => {
    updateText();
    window.addEventListener('resize', updateText);
    return () => window.removeEventListener('resize', updateText);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <span ref={ref} className="smart-ellipsis">
      {displayText}
    </span>
  );
}
