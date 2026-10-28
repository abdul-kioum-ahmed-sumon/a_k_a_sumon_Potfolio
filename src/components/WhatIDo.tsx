import "./styles/WhatIDo.css";

const WhatIDo = () => {
  return (
    <div className="whatIDO" id="what-i-do">
      <div className="what-box">
        <h2 className="title">
          W<span className="hat-h2">HAT</span>
          <div>
            I<span className="do-h2"> DO</span>
          </div>
        </h2>
      </div>
      <div className="what-box">
        <div className="what-box-in">
          {/* Card 1: DEVELOP */}
          <div className="what-card">
            <div className="what-card-header">
              <h3>DEVELOPER</h3>
              <h4>Practical Software Engineering</h4>
            </div>
            <p>
              I build responsive, reliable web platforms, document-processing
              tools, and backend services focused on clean architecture and
              performance.
            </p>
            <div className="what-skills">
              <h5>Skillset &amp; tools</h5>
              <div className="what-content-flex">
                <span className="what-tags">C / C++</span>
                <span className="what-tags">PHP</span>
                <span className="what-tags">MySQL</span>
                <span className="what-tags">Python</span>
                <span className="what-tags">JavaScript</span>
                <span className="what-tags">TypeScript</span>
                <span className="what-tags">React</span>
                <span className="what-tags">FastAPI</span>
                <span className="what-tags">Flask</span>
                <span className="what-tags">Node.js</span>
                <span className="what-tags">Docker</span>
              </div>
            </div>
          </div>

          {/* Card 2: AI & MOBILE */}
          <div className="what-card">
            <div className="what-card-header">
              <h3>AI &amp; MOBILE</h3>
              <h4>Applied Intelligence &amp; Mobile Apps</h4>
            </div>
            <p>
              I build computer vision classifiers, document-automation
              pipelines, and cross-platform mobile applications with smooth,
              accessible experiences.
            </p>
            <div className="what-skills">
              <h5>Skillset &amp; tools</h5>
              <div className="what-content-flex">
                <span className="what-tags">Flutter</span>
                <span className="what-tags">Dart</span>
                <span className="what-tags">TensorFlow</span>
                <span className="what-tags">Keras</span>
                <span className="what-tags">Pandas</span>
                <span className="what-tags">NumPy</span>
                <span className="what-tags">Firebase</span>
                <span className="what-tags">Git &amp; GitHub</span>
                <span className="what-tags">VS Code</span>
                <span className="what-tags">SQL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatIDo;