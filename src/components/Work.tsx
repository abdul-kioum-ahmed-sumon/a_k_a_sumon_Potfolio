import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MdArrowOutward } from "react-icons/md";
import { FaGithub } from "react-icons/fa6";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface ProjectItem {
  title: string;
  category: string;
  tools: string[];
  description: string;
  image: string;
  link?: string;
  repo?: string;
  liveDemo?: string;
  isPrivate?: boolean;
}

const projects: ProjectItem[] = [
  {
    title: "Post2PDF",
    category: "Web Tool / Document Processing",
    tools: ["React", "TypeScript", "FastAPI", "Python", "Docker"],
    description:
      "A tool for turning social media posts, screenshots, and study materials into customized, print-ready PDFs.",
    image: "/images/post2pdf.png",
    link: "https://post2pdf.onrender.com/",
    repo: "https://github.com/abdul-kioum-ahmed-sumon/Job-Material/tree/main/post2pdf",
    liveDemo: "https://post2pdf.onrender.com/",
  },
  {
    title: "Bangla Word to PDF",
    category: "Document Processing Engine",
    tools: ["Python", "FastAPI", "Docker", "LibreOffice"],
    description:
      "A document-conversion tool focused on Bangla document processing and high-fidelity PDF generation.",
    image: "/images/bangla-doc.png",
    link: "https://bangla-doc-to-pdf.onrender.com/",
    repo: "https://github.com/abdul-kioum-ahmed-sumon/bangla-doc-to-pdf",
    liveDemo: "https://bangla-doc-to-pdf.onrender.com/",
  },
  {
    title: "Joypurhat Connect",
    category: "Mobile Application (Concept)",
    tools: ["Flutter", "Dart", "Firebase", "Cross-Platform"],
    description:
      "A district-services mobile application concept designed to help citizens access healthcare, transport, and emergency services.",
    image: "/images/joypurhat.png",
    isPrivate: true,
  },
  {
    title: "Library Management System",
    category: "Database Application",
    tools: ["PHP", "MySQL", "HTML5", "CSS3", "JavaScript"],
    description:
      "A robust database-backed application designed for cataloging, search, borrowing workflows, and administrative management.",
    image: "/images/lms.png",
    link: "https://github.com/abdul-kioum-ahmed-sumon/LMS",
    repo: "https://github.com/abdul-kioum-ahmed-sumon/LMS",
  },
  {
    title: "Chicken Disease Classification AI",
    category: "Deep Learning / Computer Vision",
    tools: ["Python", "TensorFlow", "Keras", "Flask"],
    description:
      "An image-classification project using deep learning CNNs to accurately detect and classify poultry diseases from images.",
    image: "/images/chicken-ai.jpg",
    link: "https://github.com/abdul-kioum-ahmed-sumon/abdul-kioum-ahmed-sumon-Chicken-Disease-Classification--AI",
    repo: "https://github.com/abdul-kioum-ahmed-sumon/abdul-kioum-ahmed-sumon-Chicken-Disease-Classification--AI",
  },
];

const Work = () => {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1025px)", () => {
      const workFlex = document.querySelector(".work-flex") as HTMLElement;
      const workContainer = document.querySelector(".work-container") as HTMLElement;
      if (!workFlex || !workContainer) return;

      const getScrollDist = () => {
        const totalWidth = workFlex.scrollWidth;
        const visibleWidth = workContainer.clientWidth || window.innerWidth;
        const dist = totalWidth - visibleWidth + 120;
        return Math.max(dist, 100);
      };

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".work-section",
          start: "top top",
          end: () => `+=${getScrollDist()}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          id: "work",
          invalidateOnRefresh: true,
        },
      });

      timeline.to(".work-flex", {
        x: () => -getScrollDist(),
        ease: "none",
      });
    });

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <div className="work-header">
          <span className="work-kicker">Featured Projects</span>
          <h2>
            My <span>Work</span>
          </h2>
        </div>
        <div className="work-flex">
          {projects.map((project, index) => (
            <div className="work-box" key={index}>
              <div className="work-card">
                {/* Header: Project Index & Category */}
                <div className="work-title">
                  <span className="work-index">0{index + 1}</span>
                  <div className="work-title-text">
                    <h4>{project.title}</h4>
                    <p className="work-category">{project.category}</p>
                  </div>
                </div>

                {/* Framed Browser / Device Mockup */}
                <WorkImage
                  image={project.image}
                  alt={project.title}
                  link={project.link}
                />

                {/* Body Info */}
                <div className="work-info">
                  <p className="work-desc">{project.description}</p>

                  {/* Tech Stack Pills */}
                  <div className="work-tools-wrap">
                    <span className="work-tools-label">Tech Stack</span>
                    <div className="work-tags-flex">
                      {project.tools.map((tool, tIdx) => (
                        <span className="work-tag" key={tIdx}>
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions / CTA Links */}
                  <div className="work-actions">
                    {project.liveDemo && (
                      <a
                        href={project.liveDemo}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor="disable"
                        className="work-btn work-btn-primary"
                      >
                        Live Demo <MdArrowOutward />
                      </a>
                    )}
                    {project.repo && (
                      <a
                        href={project.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor="disable"
                        className="work-btn work-btn-secondary"
                      >
                        <FaGithub /> GitHub <MdArrowOutward />
                      </a>
                    )}
                    {project.isPrivate && (
                      <span className="work-private-badge">
                        Private Concept
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;
