import { useEffect, useState } from "react";
import "./styles/Loading.css";
import { useLoading } from "../context/LoadingProvider";

import Marquee from "react-fast-marquee";

const Loading = ({ percent }: { percent: number }) => {
  const { setIsLoading } = useLoading();
  const [loaded, setLoaded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (percent >= 100) {
      const t1 = setTimeout(() => {
        setLoaded(true);
      }, 600);
      const t2 = setTimeout(() => {
        setIsLoaded(true);
      }, 1600);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [percent >= 100]);

  useEffect(() => {
    if (isLoaded) {
      setClicked(true);
      import("./utils/initialFX").then((module) => {
        setTimeout(() => {
          if (module.initialFX) {
            module.initialFX();
          }
          setIsLoading(false);
        }, 900);
      });
    }
  }, [isLoaded]);

  const handleSkip = () => {
    setLoaded(true);
    setIsLoaded(true);
  };

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const { currentTarget: target } = e;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    target.style.setProperty("--mouse-x", `${x}px`);
    target.style.setProperty("--mouse-y", `${y}px`);
  }

  return (
    <>
      <div className="loading-header">
        <a href="/#" className="loader-title" data-cursor="disable">
          A.K.A.SUMON
        </a>
        <div className={`loaderGame ${clicked && "loader-out"}`}>
          <div className="loaderGame-container">
            <div className="loaderGame-in">
              {[...Array(27)].map((_, index) => (
                <div className="loaderGame-line" key={index}></div>
              ))}
            </div>
            <div className="loaderGame-ball"></div>
          </div>
        </div>
      </div>
      <div className="loading-screen">
        <div className="loading-marquee">
          <Marquee>
            <span> A.K.A.SUMON</span> <span>A.K.A.SUMON</span>
            <span> A.K.A.SUMON</span> <span>A.K.A.SUMON</span>
          </Marquee>
        </div>
        <div
          className={`loading-wrap ${clicked && "loading-clicked"}`}
          onMouseMove={(e) => handleMouseMove(e)}
          onClick={handleSkip}
          style={{ cursor: "pointer" }}
        >
          <div className="loading-hover"></div>
          <div className={`loading-button ${loaded && "loading-complete"}`}>
            <div className="loading-container">
              <div className="loading-content">
                <div className="loading-content-in">
                  Loading <span>{percent}%</span>
                </div>
              </div>
              <div className="loading-box"></div>
            </div>
            <div className="loading-content2">
              <span>Welcome</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Loading;

export const setProgress = (setLoading: (value: number) => void) => {
  let percent: number = 0;

  let interval = setInterval(() => {
    if (percent <= 50) {
      const rand = Math.round(Math.random() * 6) + 2;
      percent = Math.min(percent + rand, 50);
      setLoading(percent);
    } else if (percent < 95) {
      const rand = Math.round(Math.random() * 3) + 1;
      percent = Math.min(percent + rand, 95);
      setLoading(percent);
    }
  }, 70);

  function clear() {
    clearInterval(interval);
    setLoading(100);
  }

  function loaded() {
    return new Promise<number>((resolve) => {
      clearInterval(interval);
      interval = setInterval(() => {
        if (percent < 100) {
          percent += 2;
          if (percent > 100) percent = 100;
          setLoading(percent);
        } else {
          resolve(percent);
          clearInterval(interval);
        }
      }, 16);
    });
  }

  // Auto-complete fallback after 3.8s so user never waits indefinitely
  const autoFinish = setTimeout(() => {
    loaded();
  }, 3800);

  return {
    loaded: () => {
      clearTimeout(autoFinish);
      return loaded();
    },
    percent,
    clear: () => {
      clearTimeout(autoFinish);
      clear();
    },
  };
};
