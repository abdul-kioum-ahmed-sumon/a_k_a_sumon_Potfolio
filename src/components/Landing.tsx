import { PropsWithChildren } from "react";
import "./styles/Landing.css";

const Landing = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>As-salamu alaykum! I'm</h2>
            <h1>
              ABDUL KAIUM
              <br />
              <span>AHMED SUMON</span>
            </h1>
            <p className="landing-headline">"I build useful technology for real-world problems."</p>
          </div>
          <div className="landing-info">
            <h3>A Software</h3>
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">Developer</div>
              <div className="landing-h2-2">Engineer</div>
            </h2>
            <h2>
              <div className="landing-h2-info">Developer</div>
              <div className="landing-h2-info-1">Engineer</div>
            </h2>
            <p className="landing-bio-short">
              I'm a Computer Science and Engineering graduate who enjoys building practical software, mobile applications, document-processing tools, and applied AI projects.
            </p>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
