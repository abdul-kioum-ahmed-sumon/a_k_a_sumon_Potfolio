import { useEffect, useRef } from "react";
import "./styles/Cursor.css";
import gsap from "gsap";

const Cursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only initialize custom cursor on devices with a precise pointer (mouse / trackpad)
    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    const cursor = cursorRef.current;
    if (!cursor) return;

    let hover = false;
    let isVisible = false;

    // High-performance GSAP quickTo setters (zero allocation per frame, perfectly smoothed)
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.18, ease: "power3.out" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.18, ease: "power3.out" });

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) {
        cursor.style.opacity = "1";
        isVisible = true;
      }
      if (!hover) {
        xTo(e.clientX);
        yTo(e.clientY);
      }
    };

    const handleMouseLeave = () => {
      cursor.style.opacity = "0";
      isVisible = false;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    const interactiveItems = document.querySelectorAll("[data-cursor]");
    const enterHandlers: Array<[Element, (e: Event) => void]> = [];
    const leaveHandlers: Array<[Element, () => void]> = [];

    interactiveItems.forEach((item) => {
      const element = item as HTMLElement;

      const onEnter = (e: Event) => {
        const mouseEvt = e as MouseEvent;
        const target = mouseEvt.currentTarget as HTMLElement;
        const rect = target.getBoundingClientRect();

        if (element.dataset.cursor === "icons") {
          cursor.classList.add("cursor-icons");
          xTo(rect.left);
          yTo(rect.top);
          cursor.style.setProperty("--cursorH", `${rect.height}px`);
          hover = true;
        }
        if (element.dataset.cursor === "disable") {
          cursor.classList.add("cursor-disable");
        }
      };

      const onLeave = () => {
        cursor.classList.remove("cursor-disable", "cursor-icons");
        hover = false;
      };

      element.addEventListener("mouseenter", onEnter);
      element.addEventListener("mouseleave", onLeave);
      enterHandlers.push([element, onEnter]);
      leaveHandlers.push([element, onLeave]);
    });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      enterHandlers.forEach(([el, fn]) => el.removeEventListener("mouseenter", fn));
      leaveHandlers.forEach(([el, fn]) => el.removeEventListener("mouseleave", fn));
    };
  }, []);

  return <div className="cursor-main" ref={cursorRef}></div>;
};

export default Cursor;
