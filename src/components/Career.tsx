import { useRef } from "react";
import "./styles/Career.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface Milestone {
  role: string;
  org: string;
  period: string;
  isCurrent?: boolean;
  description: string;
  highlights: string[];
}

const milestones: Milestone[] = [
  {
    role: "B.Sc. in Computer Science & Engineering",
    org: "BAUST",
    period: "2022-26",
    description:
      "Graduated with a B.Sc. in Computer Science and Engineering from Bangladesh Army University of Science and Technology (BAUST). Completed coursework in Data Structures, Algorithms, Software Engineering, Database Systems, AI, and Mobile App Development.",
    highlights: ["Algorithms", "Data Structures", "Software Engineering", "AI", "Mobile Apps"],
  },
  {
    role: "ICPC Regionalist",
    org: "BAUST Computer Club",
    period: "2023–24",
    description:
      "Competed at ICPC Asia Dhaka Regional 2024. Former Treasurer and Development Head at BAUST Computer Club. Solved 200+ competitive programming challenges across Codeforces, HackerRank, and Beecrowd.",
    highlights: ["ICPC Dhaka Regional", "Treasurer & Dev Head", "200+ Problems Solved", "Codeforces"],
  },
  {
    role: "Software Developer",
    org: "Independent / Open Source",
    period: "NOW",
    isCurrent: true,
    description:
      "Building practical software solutions, document-processing tools (Post2PDF, Bangla Word to PDF), applied AI classification models, and cross-platform mobile services (Joypurhat Connect).",
    highlights: ["Post2PDF", "Bangla Word to PDF", "Applied AI", "Joypurhat Connect"],
  },
];

const Career = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const infoEl = document.querySelector(".career-info") as HTMLElement;
      const trackEl = document.querySelector(".career-timeline-track") as HTMLElement;
      const timelineEl = document.querySelector(".career-timeline") as HTMLElement;
      const nodes = document.querySelectorAll(".career-node");

      if (!infoEl || !timelineEl || nodes.length < 2) return;

      const updateDimensions = () => {
        if (!nodes.length || !infoEl) return 0;
        const infoRect = infoEl.getBoundingClientRect();
        const r0 = nodes[0].getBoundingClientRect();
        const rLast = nodes[nodes.length - 1].getBoundingClientRect();

        const startY = r0.top + r0.height / 2 - infoRect.top;
        const endY = rLast.top + rLast.height / 2 - infoRect.top;
        const total = Math.max(endY - startY, 40);

        if (trackEl) {
          trackEl.style.top = `${startY}px`;
          trackEl.style.height = `${total}px`;
        }
        if (timelineEl) {
          timelineEl.style.top = `${startY}px`;
        }

        return total;
      };

      let totalHeight = updateDimensions();
      let ticking = false;

      const updateProgress = () => {
        ticking = false;
        if (!nodes.length || !timelineEl) return;
        const r0 = nodes[0].getBoundingClientRect();
        const rLast = nodes[nodes.length - 1].getBoundingClientRect();
        const focusY = window.innerHeight * 0.6;
        const start = r0.top + r0.height / 2;
        const end = rLast.top + rLast.height / 2;
        const dist = end - start;
        if (dist <= 10) return;

        const progress = Math.max(0, Math.min(1, (focusY - start) / dist));
        timelineEl.style.height = `${progress * totalHeight}px`;
      };

      const onScroll = () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(updateProgress);
        }
      };

      const handleResizeOrReflow = () => {
        totalHeight = updateDimensions();
        onScroll();
      };

      // Real-time passive event listeners for both desktop and mobile
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("touchmove", onScroll, { passive: true });
      document.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", handleResizeOrReflow, { passive: true });

      // ResizeObserver to recalibrate on font load or DOM layout shift
      let ro: ResizeObserver | null = null;
      if (typeof ResizeObserver !== "undefined") {
        ro = new ResizeObserver(() => {
          handleResizeOrReflow();
        });
        ro.observe(infoEl);
      }

      if (typeof document !== "undefined" && document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
          handleResizeOrReflow();
        });
      }

      // Initial progress sync
      handleResizeOrReflow();

      // GSAP ScrollTrigger hook for smooth integration if present
      const st = ScrollTrigger.create({
        trigger: ".career-info",
        start: "top bottom",
        end: "bottom top",
        onUpdate: () => {
          onScroll();
        },
      });

      return () => {
        st.kill();
        if (ro) ro.disconnect();
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("touchmove", onScroll);
        document.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", handleResizeOrReflow);
      };
    },
    { scope: containerRef }
  );

  return (
    <div className="career-section section-container" id="career" ref={containerRef}>
      <div className="career-container">
        <div className="career-header">
          <span className="career-kicker">Career &amp; Academics</span>
          <h2>Education &amp; Experience</h2>
        </div>

        <div className="career-info">
          {/* Static Background Spine Track */}
          <div className="career-timeline-track"></div>

          {/* Animated GSAP Progress Spine */}
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>

          {milestones.map((item, index) => (
            <div className="career-info-box" key={index}>
              {/* Left Column: Role, Institution & Period Badge */}
              <div className="career-info-in">
                <div className="career-role">
                  <h4>{item.role}</h4>
                  <h5>{item.org}</h5>
                </div>
                <div
                  className={`career-period-badge ${
                    item.isCurrent ? "career-period-current" : ""
                  }`}
                >
                  <h3>{item.period}</h3>
                </div>
              </div>

              {/* Center Timeline Node Marker */}
              <div className="career-node">
                <span className="career-node-dot"></span>
              </div>

              {/* Right Column: Glassmorphic Details Card */}
              <div className="career-card">
                <p>{item.description}</p>
                <div className="career-tags">
                  {item.highlights.map((tag, tIdx) => (
                    <span className="career-tag" key={tIdx}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Career;
