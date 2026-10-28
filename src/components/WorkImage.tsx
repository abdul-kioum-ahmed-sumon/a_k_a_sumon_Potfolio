import { MdArrowOutward } from "react-icons/md";

interface Props {
  image: string;
  alt?: string;
  video?: string;
  link?: string;
}

const WorkImage = (props: Props) => {
  return (
    <div className="work-image">
      <a
        className="work-image-in"
        href={props.link}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor="disable"
      >
        {/* Browser Mockup Top Bar */}
        <div className="work-mockup-header">
          <div className="work-mockup-dots">
            <span className="mockup-dot red"></span>
            <span className="mockup-dot yellow"></span>
            <span className="mockup-dot green"></span>
          </div>
          <span className="work-mockup-title">{props.alt || "Project Preview"}</span>
          <div className="work-mockup-placeholder"></div>
        </div>

        {/* Image Preview Container */}
        <div className="work-img-container">
          <img src={props.image} alt={props.alt} loading="lazy" />
          {props.link && (
            <div className="work-link-overlay">
              <span className="work-overlay-btn">
                Open <MdArrowOutward />
              </span>
            </div>
          )}
        </div>
      </a>
    </div>
  );
};

export default WorkImage;