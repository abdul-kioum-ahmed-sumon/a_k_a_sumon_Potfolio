import { useEffect, useRef } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingProvider";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import { setProgress } from "../Loading";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef(new THREE.Scene());
  const { setLoading } = useLoading();
  const characterRef = useRef<THREE.Object3D | null>(null);

  useEffect(() => {
    if (!canvasDiv.current) return;

    let isMounted = true;
    let animFrameId: number | null = null;
    const containerEl = canvasDiv.current;

    // 1. Remove ANY existing canvas elements to prevent duplicate overlapping character renderers
    const existingCanvases = containerEl.querySelectorAll("canvas");
    existingCanvases.forEach((c) => c.remove());

    let rect = containerEl.getBoundingClientRect();
    let container = {
      width: rect.width || window.innerWidth,
      height: rect.height || window.innerHeight,
    };
    const aspect = container.width / container.height;
    const scene = sceneRef.current;

    // 2. Clear any existing 3D character/objects from scene before loading a new one
    const toRemove: THREE.Object3D[] = [];
    scene.children.forEach((child) => {
      // Keep only ambient/point lights, remove old character models
      if (child.type === "Group" || child.name.includes("metarig") || child.name === "Scene") {
        toRemove.push(child);
      }
    });
    toRemove.forEach((child) => scene.remove(child));

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setSize(container.width, container.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    containerEl.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
    camera.position.set(0, 13.1, 24.7);
    camera.zoom = 1.1;
    camera.updateProjectionMatrix();

    let headBone: THREE.Object3D | null = null;
    let screenLight: any | null = null;
    let mixer: THREE.AnimationMixer;

    const clock = new THREE.Clock();
    const light = setLighting(scene);
    let progress = setProgress((value) => setLoading(value));
    const { loadCharacter } = setCharacter(renderer, scene, camera);

    const safetyTimer = setTimeout(() => {
      progress.clear();
    }, 5500);

    loadCharacter().then((gltf) => {
      clearTimeout(safetyTimer);
      if (!isMounted || !gltf) return;

      // Ensure no duplicate character object exists in the scene
      if (characterRef.current) {
        scene.remove(characterRef.current);
      }

      const animations = setAnimations(gltf);
      hoverDivRef.current && animations.hover(gltf, hoverDivRef.current);
      mixer = animations.mixer;
      let character = gltf.scene;
      characterRef.current = character;
      scene.add(character);

      headBone = character.getObjectByName("spine006") || character.getObjectByName("spine.006") || null;
      screenLight = character.getObjectByName("screenlight") || null;

      progress.loaded().then(() => {
        if (!isMounted) return;
        setTimeout(() => {
          if (!isMounted) return;
          light.turnOnLights();
          animations.startIntro();
        }, 2500);
      });
    });

    const onResize = () => {
      if (characterRef.current) {
        handleResize(renderer, camera, canvasDiv, characterRef.current);
      }
    };
    window.addEventListener("resize", onResize);

    let mouse = { x: 0, y: 0 },
      interpolation = { x: 0.1, y: 0.2 };

    const onMouseMove = (event: MouseEvent) => {
      handleMouseMove(event, (x, y) => (mouse = { x, y }));
    };

    let debounce: ReturnType<typeof setTimeout> | undefined;
    const onTouchStart = (event: TouchEvent) => {
      const element = event.target as HTMLElement;
      debounce = setTimeout(() => {
        element?.addEventListener("touchmove", (e: TouchEvent) =>
          handleTouchMove(e, (x, y) => (mouse = { x, y }))
        );
      }, 200);
    };

    const onTouchEnd = () => {
      handleTouchEnd((x, y, interpolationX, interpolationY) => {
        mouse = { x, y };
        interpolation = { x: interpolationX, y: interpolationY };
      });
    };

    document.addEventListener("mousemove", onMouseMove);
    const landingDiv = document.getElementById("landingDiv");
    if (landingDiv) {
      landingDiv.addEventListener("touchstart", onTouchStart);
      landingDiv.addEventListener("touchend", onTouchEnd);
    }

    let isVisible = true;
    const visObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { rootMargin: "300px 0px 300px 0px" }
    );
    if (canvasDiv.current) {
      visObserver.observe(canvasDiv.current);
    }

    const animate = () => {
      if (!isMounted) return;
      animFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;
      const delta = clock.getDelta();
      if (mixer) {
        mixer.update(delta);
      }
      if (headBone) {
        handleHeadRotation(
          headBone,
          mouse.x,
          mouse.y,
          interpolation.x,
          interpolation.y,
          THREE.MathUtils.lerp
        );
        light.setPointLight(screenLight);
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      isMounted = false;
      visObserver.disconnect();
      if (animFrameId !== null) {
        cancelAnimationFrame(animFrameId);
      }
      clearTimeout(debounce);
      clearTimeout(safetyTimer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("mousemove", onMouseMove);
      if (landingDiv) {
        landingDiv.removeEventListener("touchstart", onTouchStart);
        landingDiv.removeEventListener("touchend", onTouchEnd);
      }

      // Clean up renderer and domElement
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();

      if (characterRef.current) {
        scene.remove(characterRef.current);
        characterRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <div className="character-container">
        <div className="character-model" ref={canvasDiv}>
          <div className="character-rim"></div>
          <div className="character-hover" ref={hoverDivRef}></div>
        </div>
      </div>
    </>
  );
};

export default Scene;