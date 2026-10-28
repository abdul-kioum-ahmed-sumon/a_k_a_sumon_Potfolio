import { lazy, PropsWithChildren, Suspense, useEffect, useState } from "react";
import About from "./About";
import Career from "./Career";
import Contact from "./Contact";
import Cursor from "./Cursor";
import Landing from "./Landing";
import Navbar from "./Navbar";
import SocialIcons from "./SocialIcons";
import WhatIDo from "./WhatIDo";
import Work from "./Work";
import setSplitText from "./utils/splitText";

const TechStack = lazy(() => import("./TechStack"));

const MainContainer = ({ children }: PropsWithChildren) => {
  const [isDesktopView, setIsDesktopView] = useState<boolean>(
    () => typeof window !== "undefined" && window.innerWidth > 1024
  );

  useEffect(() => {
    let resizeTimer: ReturnType<typeof setTimeout>;

    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setSplitText();
        setIsDesktopView(window.innerWidth > 1024);
      }, 180);
    };

    // Initial SplitText setup
    setSplitText();

    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="container-main">
      <Cursor />
      <Navbar />
      <SocialIcons />
      {/* Ensure character is rendered strictly once */}
      {isDesktopView ? children : null}
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <div className="container-main">
            <Landing>{!isDesktopView ? children : null}</Landing>
            <About />
            <WhatIDo />
            <Career />
            <Work />
            {isDesktopView && (
              <Suspense fallback={<div style={{ minHeight: "800px" }}></div>}>
                <TechStack />
              </Suspense>
            )}
            <Contact />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContainer;
