import { MdArrowOutward, MdCode, MdEmojiEvents, MdSchool } from "react-icons/md";
import "./styles/About.css";

const About = () => {
  return (
    <div className="about-section" id="about">
      <div className="about-me">
        {/* Kicker & Title */}
        <div className="about-header">
          <span className="about-kicker">Who I Am</span>
          <h3 className="title">About Me</h3>
        </div>

        {/* Narrative Paragraph (GSAP SplitText target) */}
        <p className="para">
          I'm a Computer Science &amp; Engineering graduate from Bangladesh Army
          University of Science and Technology (BAUST). Passionate about turning
          complex ideas into reliable digital products, I specialize in full-stack
          web platforms, document-processing tools, and applied AI. Driven by a
          competitive programming foundation, I build with clean architecture and
          real-world utility in mind.
        </p>

        {/* Key Focus Tags */}
        <div className="about-tags">
          <span className="about-tag">
            <span className="about-tag-dot" />
            Full-Stack Systems
          </span>
          <span className="about-tag">
            <span className="about-tag-dot" />
            Applied AI &amp; Vision
          </span>
          <span className="about-tag">
            <span className="about-tag-dot" />
            Document Processing
          </span>
          <span className="about-tag">
            <span className="about-tag-dot" />
            Mobile Applications
          </span>
        </div>

        {/* Quick Stats Grid */}
        <div className="about-stats-grid">
          <div className="about-stat-card">
            <div className="stat-card-icon">
              <MdCode />
            </div>
            <div className="stat-card-info">
              <span className="stat-number">200+</span>
              <span className="stat-label">Problems Solved</span>
            </div>
          </div>

          <div className="about-stat-card">
            <div className="stat-card-icon">
              <MdEmojiEvents />
            </div>
            <div className="stat-card-info">
              <span className="stat-number">ICPC</span>
              <span className="stat-label">Regionalist '24</span>
            </div>
          </div>

          <div className="about-stat-card">
            <div className="stat-card-icon">
              <MdSchool />
            </div>
            <div className="stat-card-info">
              <span className="stat-number">B.Sc.</span>
              <span className="stat-label">CSE (BAUST)</span>
            </div>
          </div>
        </div>

        {/* Resume / Connect Action */}
        <div className="about-actions">
          <a
            href="/a_k_a_sumon_CV.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="about-btn about-btn-primary"
            data-cursor="disable"
          >
            View Resume <MdArrowOutward />
          </a>
          <a
            href="#contact"
            className="about-btn about-btn-secondary"
            data-cursor="disable"
          >
            Let's Talk
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
