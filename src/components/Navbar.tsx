import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
export let smoother: ScrollSmoother;

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const isDesktop = typeof window !== "undefined" && window.innerWidth > 1024;

    // Create optimized ScrollSmoother: snappy 1.1s smooth on desktop, 0 on touch to preserve native 120Hz momentum
    smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: isDesktop ? 1.1 : 0,
      speed: 1,
      effects: isDesktop,
      autoResize: true,
      ignoreMobileResize: true,
      smoothTouch: 0,
    });

    smoother.scrollTop(0);
    smoother.paused(true);
    if (typeof window !== "undefined") {
      (window as any).smoother = smoother;
    }

    const updateScrollState = (scrollPos: number) => {
      const isPast = scrollPos > 30;
      setScrolled((prev) => (prev !== isPast ? isPast : prev));
    };

    // Scroll listener for native window scroll (passive for lag-free performance)
    const checkScroll = () => {
      const currentScroll = smoother ? smoother.scrollTop() : window.scrollY;
      updateScrollState(currentScroll);
    };
    window.addEventListener("scroll", checkScroll, { passive: true });

    // GSAP ScrollTrigger real-time observer
    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        updateScrollState(self.scroll());
      },
    });

    // Smooth navigation anchor links
    const links = document.querySelectorAll(".header ul a");
    const linkClickHandlers: Array<[HTMLAnchorElement, (e: MouseEvent) => void]> = [];

    links.forEach((elem) => {
      const element = elem as HTMLAnchorElement;
      const onClick = (e: MouseEvent) => {
        const target = e.currentTarget as HTMLAnchorElement;
        const section = target.getAttribute("data-href");
        if (section) {
          if (smoother && window.innerWidth > 1024) {
            e.preventDefault();
            smoother.scrollTo(section, true, "top 80px");
          } else {
            const targetEl = document.querySelector(section);
            if (targetEl) {
              e.preventDefault();
              targetEl.scrollIntoView({ behavior: "smooth" });
            }
          }
        }
      };
      element.addEventListener("click", onClick);
      linkClickHandlers.push([element, onClick]);
    });

    // Debounced window resize to prevent layout thrashing
    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        ScrollSmoother.refresh(true);
      }, 150);
    };
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      st.kill();
      clearTimeout(resizeTimer);
      window.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", handleResize);
      linkClickHandlers.forEach(([el, fn]) => el.removeEventListener("click", fn));
    };
  }, []);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (smoother && window.innerWidth > 1024) {
      smoother.scrollTo(0, true);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <div className={`header-wrapper ${scrolled ? "scrolled" : ""}`}>
        <header className="header">
          {/* Brand Identity with live rolling hover animation */}
          <a
            href="/#"
            onClick={handleLogoClick}
            className="navbar-brand"
            data-cursor="disable"
          >
            <HoverLinks text="A.K.A.SUMON" />
          </a>

          {/* Clean Navigation Links with live rolling hover animation */}
          <ul className="navbar-links">
            <li>
              <a data-href="#about" href="#about">
                <HoverLinks text="ABOUT" />
              </a>
            </li>
            <li>
              <a data-href="#career" href="#career">
                <HoverLinks text="EXPERIENCE" />
              </a>
            </li>
            <li>
              <a data-href="#work" href="#work">
                <HoverLinks text="WORK" />
              </a>
            </li>
            <li>
              <a data-href="#contact" href="#contact">
                <HoverLinks text="CONTACT" />
              </a>
            </li>
          </ul>
        </header>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
