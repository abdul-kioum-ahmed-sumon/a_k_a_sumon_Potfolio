import { useState } from "react";
import {
  MdArrowOutward,
  MdArrowUpward,
  MdCheck,
  MdContentCopy,
  MdCopyright,
  MdMailOutline,
  MdPlace,
  MdSchool,
  MdWorkOutline,
  MdCode,
} from "react-icons/md";
import { FaGithub, FaLinkedinIn, FaWhatsapp, FaFacebookF } from "react-icons/fa6";
import { TbNotes } from "react-icons/tb";
import { smoother } from "./Navbar";
import "./styles/Contact.css";

const Contact = () => {
  const [copied, setCopied] = useState(false);
  const email = "abdul.kioum.ahmed.sumon@gmail.com";

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2500);
  };

  const scrollToTop = () => {
    if (smoother) {
      smoother.scrollTo(0, true);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const socialLinks = [
    {
      name: "GitHub",
      handle: "@abdul-kioum-ahmed-sumon",
      badge: "Open Source & Repos",
      url: "https://github.com/abdul-kioum-ahmed-sumon",
      icon: <FaGithub />,
    },
    {
      name: "LinkedIn",
      handle: "akasumon",
      badge: "Professional Network",
      url: "https://www.linkedin.com/in/akasumon",
      icon: <FaLinkedinIn />,
    },
    {
      name: "WhatsApp",
      handle: "akasumon",
      badge: "Direct Message",
      url: "https://wa.me/akasumon",
      icon: <FaWhatsapp />,
    },
    {
      name: "Facebook",
      handle: "akasumon1",
      badge: "Social Profile",
      url: "https://facebook.com/akasumon1",
      icon: <FaFacebookF />,
    },
  ];

  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        {/* Header */}
        <div className="contact-header">
          <span className="contact-kicker">Get In Touch</span>
          <h2>
            Let's <span>Connect</span>
          </h2>
          <p className="contact-subtitle">
            Have a project in mind, an opportunity to discuss, or just want to
            say hello? Feel free to reach out — my inbox is always open.
          </p>
        </div>

        {/* Main Grid */}
        <div className="contact-grid">
          {/* Left Card: Direct Contact & Info */}
          <div className="contact-card contact-main-card">
            <div className="contact-card-head">
              <h4>Direct Contact</h4>
              <p>Reach out directly for collaborations, inquiries, or opportunities.</p>
            </div>

            {/* Email Box */}
            <div className="contact-email-box">
              <div className="contact-email-label">
                <MdMailOutline className="contact-icon-subtle" />
                <span>Direct Email</span>
              </div>
              <a
                href={`mailto:${email}`}
                className="contact-email-link"
                data-cursor="disable"
              >
                {email}
              </a>

              <div className="contact-action-row">
                <a
                  href={`mailto:${email}`}
                  className="contact-action-btn contact-btn-primary"
                  data-cursor="disable"
                >
                  <MdMailOutline /> Send Email <MdArrowOutward />
                </a>

                <button
                  type="button"
                  onClick={handleCopy}
                  className={`contact-action-btn contact-btn-secondary ${
                    copied ? "copied" : ""
                  }`}
                  data-cursor="disable"
                  aria-label="Copy email address"
                >
                  {copied ? (
                    <>
                      <MdCheck className="icon-success" /> Copied!
                    </>
                  ) : (
                    <>
                      <MdContentCopy /> Copy Email
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Academic & Professional Info (2x2 Grid) */}
            <div className="contact-info-pills">
              <div className="contact-info-item">
                <MdSchool className="contact-info-icon" />
                <div className="contact-info-text">
                  <span className="contact-info-title">Degree &amp; Alma Mater</span>
                  <p className="contact-info-desc">
                    B.Sc. in CSE &bull; BAUST
                  </p>
                </div>
              </div>

              <div className="contact-info-item">
                <MdPlace className="contact-info-icon" />
                <div className="contact-info-text">
                  <span className="contact-info-title">Location</span>
                  <p className="contact-info-desc">Bangladesh &bull; Remote Available</p>
                </div>
              </div>

              <div className="contact-info-item">
                <MdWorkOutline className="contact-info-icon" />
                <div className="contact-info-text">
                  <span className="contact-info-title">Availability</span>
                  <p className="contact-info-desc">Open for Roles &bull; Full-time / Remote</p>
                </div>
              </div>

              <div className="contact-info-item">
                <MdCode className="contact-info-icon" />
                <div className="contact-info-text">
                  <span className="contact-info-title">Specialization</span>
                  <p className="contact-info-desc">Full Stack &bull; Problem Solving</p>
                </div>
              </div>
            </div>

            {/* Resume Button */}
            <div className="contact-cv-wrap">
              <a
                href="/a_k_a_sumon_CV.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-cv-btn"
                data-cursor="disable"
              >
                <TbNotes /> View Full Resume / CV <MdArrowOutward />
              </a>
            </div>
          </div>

          {/* Right Card: Social & Profiles */}
          <div className="contact-card contact-social-card">
            <div className="contact-card-head">
              <h4>Profiles &amp; Networks</h4>
              <p>Explore my repositories, competitive records, and social handles.</p>
            </div>

            <div className="contact-social-list">
              {socialLinks.map((item, index) => (
                <a
                  key={index}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-social-item"
                  data-cursor="disable"
                >
                  <div className="social-item-left">
                    <span className="social-item-icon">{item.icon}</span>
                    <div className="social-item-details">
                      <h5>{item.name}</h5>
                      <span className="social-item-handle">{item.handle}</span>
                    </div>
                  </div>
                  <div className="social-item-right">
                    <span className="social-item-badge">{item.badge}</span>
                    <MdArrowOutward className="social-item-arrow" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="contact-footer">
          <div className="footer-left">
            <h2>
              Designed &amp; Developed by{" "}
              <span>Abdul Kioum Ahmed Sumon</span>
            </h2>
            <p className="footer-subtext">A.K.A.SUMON &bull; Software Developer</p>
          </div>

          <div className="footer-right">
            <span className="footer-copyright">
              <MdCopyright /> {new Date().getFullYear()} All Rights Reserved.
            </span>
            <button
              type="button"
              onClick={scrollToTop}
              className="footer-top-btn"
              data-cursor="disable"
              aria-label="Back to top"
            >
              <span>Back to Top</span>
              <MdArrowUpward />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
