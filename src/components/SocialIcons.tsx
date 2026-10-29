import {
  FaGithub,
  FaLinkedinIn,
  FaFacebookF,
} from "react-icons/fa6";
import { MdMailOutline } from "react-icons/md";
import "./styles/SocialIcons.css";
import { TbNotes } from "react-icons/tb";
import HoverLinks from "./HoverLinks";

interface SocialItem {
  name: string;
  url: string;
  icon: JSX.Element;
  ariaLabel: string;
}

const socialLinks: SocialItem[] = [
  {
    name: "GitHub",
    url: "https://github.com/abdul-kioum-ahmed-sumon",
    icon: <FaGithub />,
    ariaLabel: "Visit GitHub profile",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/akasumon",
    icon: <FaLinkedinIn />,
    ariaLabel: "Visit LinkedIn profile",
  },
  {
    name: "Facebook",
    url: "https://facebook.com/akasumon1",
    icon: <FaFacebookF />,
    ariaLabel: "Visit Facebook profile",
  },
  {
    name: "Email",
    url: "mailto:abdul.kioum.ahmed.sumon@gmail.com",
    icon: <MdMailOutline />,
    ariaLabel: "Send an email",
  },
];

const SocialIcons = () => {
  return (
    <div className="icons-section">
      <div className="social-icons" data-cursor="disable" id="social">
        {socialLinks.map((item) => (
          <div className="social-icon-wrapper" key={item.name}>
            <a
              href={item.url}
              target={item.url.startsWith("http") ? "_blank" : undefined}
              rel={item.url.startsWith("http") ? "noopener noreferrer" : undefined}
              aria-label={item.ariaLabel}
              className="social-icon-link"
            >
              <span className="social-icon-svg">{item.icon}</span>
              <span className="social-icon-tooltip">{item.name}</span>
            </a>
          </div>
        ))}
      </div>

      <a
        className="resume-button"
        href="/a_k_a_sumon_CV.pdf"
        target="_blank"
        rel="noopener noreferrer"
        title="View Resume"
        data-cursor="disable"
        aria-label="View Resume"
      >
        <span className="resume-btn-text">
          <HoverLinks text="RESUME" />
        </span>
        <span className="resume-btn-icon">
          <TbNotes />
        </span>
      </a>
    </div>
  );
};

export default SocialIcons;
