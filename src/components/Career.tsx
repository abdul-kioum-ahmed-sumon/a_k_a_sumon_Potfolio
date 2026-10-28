import "./styles/Career.css";

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
  return (
    <div className="career-section section-container" id="career">
      <div className="career-container">
        <div className="career-header">
          <span className="career-kicker">Career &amp; Academics</span>
          <h2>Education &amp; Experience</h2>
        </div>

        <div className="career-info">
          {/* Animated GSAP Center Spine */}
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