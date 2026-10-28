import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { HiBars3, HiXMark } from "react-icons/hi2";
import { TbNotes } from "react-icons/tb";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
export let smoother: ScrollSmoother;

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    setMobileMenuOpen(false);
    if (smoother && window.innerWidth > 1024) {
      smoother.scrollTo(0, true);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNavClick = (e: React.MouseEvent, section: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (smoother && window.innerWidth > 1024) {
      smoother.scrollTo(section, true, "top 80px");
    } else {
      const targetEl = document.querySelector(section);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth" });
      }
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

          {/* Clean Navigation Links with live rolling hover animation (Desktop) */}
          <ul className="navbar-links">
            <li>
              <a data-href="#about" href="#about" data-cursor="disable">
                <HoverLinks text="ABOUT" />
              </a>
            </li>
            <li>
              <a data-href="#career" href="#career" data-cursor="disable">
                <HoverLinks text="EXPERIENCE" />
              </a>
            </li>
            <li>
              <a data-href="#work" href="#work" data-cursor="disable">
                <HoverLinks text="WORK" />
              </a>
            </li>
            <li>
              <a data-href="#contact" href="#contact" data-cursor="disable">
                <HoverLinks text="CONTACT" />
              </a>
            </li>
          </ul>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className={`mobile-menu-toggle ${mobileMenuOpen ? "open" : ""}`}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            data-cursor="disable"
          >
            {mobileMenuOpen ? <HiXMark /> : <HiBars3 />}
          </button>
        </header>
      </div>

      {/* Mobile Navigation Drawer / Overlay */}
      <div className={`mobile-nav-menu ${mobileMenuOpen ? "active" : ""}`}>
        <div
          className="mobile-nav-backdrop"
          onClick={() => setMobileMenuOpen(false)}
        />
        <div className="mobile-nav-content">
          <ul className="mobile-nav-links">
            <li>
              <a
                data-href="#about"
                href="#about"
                onClick={(e) => handleNavClick(e, "#about")}
                data-cursor="disable"
              >
                <span className="mobile-nav-num">01</span>
                <span>ABOUT</span>
              </a>
            </li>
            <li>
              <a
                data-href="#career"
                href="#career"
                onClick={(e) => handleNavClick(e, "#career")}
                data-cursor="disable"
              >
                <span className="mobile-nav-num">02</span>
                <span>EXPERIENCE</span>
              </a>
            </li>
            <li>
              <a
                data-href="#work"
                href="#work"
                onClick={(e) => handleNavClick(e, "#work")}
                data-cursor="disable"
              >
                <span className="mobile-nav-num">03</span>
                <span>WORK</span>
              </a>
            </li>
            <li>
              <a
                data-href="#contact"
                href="#contact"
                onClick={(e) => handleNavClick(e, "#contact")}
                data-cursor="disable"
              >
                <span className="mobile-nav-num">04</span>
                <span>CONTACT</span>
              </a>
            </li>
          </ul>

          <div className="mobile-nav-footer">
            <a
              href="/a_k_a_sumon_CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="mobile-nav-cv"
              data-cursor="disable"
            >
              <TbNotes /> View Full Resume
            </a>
          </div>
        </div>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
