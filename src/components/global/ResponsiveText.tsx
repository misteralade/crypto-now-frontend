import { useEffect, useRef, useState } from "react";

export default function ResponsiveText({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(text);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return;
    const update = () => {
      const style = getComputedStyle(element);
      context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      const width = element.clientWidth;
      if (!width || context.measureText(text).width <= width) { setDisplay(text); return; }
      let count = text.length;
      while (count > 2) {
        const start = Math.ceil(count / 2), end = Math.floor(count / 2);
        const shortened = `${text.slice(0, start)}\u2026${text.slice(-end)}`;
        if (context.measureText(shortened).width <= width) { setDisplay(shortened); return; }
        count--;
      }
      setDisplay("\u2026");
    };
    const observer = new ResizeObserver(update);
    observer.observe(element);
    update();
    return () => observer.disconnect();
  }, [text]);
  return <span ref={ref} title={text} className="block w-full overflow-hidden whitespace-nowrap">{display}</span>;
}
