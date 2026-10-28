import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { decryptFile } from "./decrypt";

/**
 * Creates professionally modeled, realistic, symmetrical eyeglasses
 * tailored precisely to the mascot's facial anatomy and attached to the head bone.
 */
const addGlasses = (character: THREE.Object3D) => {
  // Find head bone: GLTFLoader may sanitize name to "spine006" or keep "spine.006"
  let headBone: THREE.Object3D | null =
    character.getObjectByName("spine006") ||
    character.getObjectByName("spine.006") ||
    null;

  if (!headBone) {
    character.traverse((child) => {
      if (
        !headBone &&
        child.name &&
        child.name.toLowerCase().includes("spine") &&
        child.name.includes("6")
      ) {
        headBone = child;
      }
    });
  }

  if (!headBone) {
    console.warn("Head bone not found, cannot attach glasses.");
    return;
  }

  // Remove existing glasses if already present (e.g. during hot module reload)
  const existing = headBone.getObjectByName("character_glasses");
  if (existing) {
    headBone.remove(existing);
  }

  const glassesGroup = new THREE.Group();
  glassesGroup.name = "character_glasses";

  // ── Materials ─────────────────────────────────────────────────────────────
  // 1. Dark polished gunmetal / graphite frame material
  const frameMat = new THREE.MeshStandardMaterial({
    color: 0x1b1c22,
    roughness: 0.22,
    metalness: 0.82,
  });

  // 2. Subtle, elegant champagne gold accents (bridge & hinge hardware)
  const goldAccentMat = new THREE.MeshStandardMaterial({
    color: 0xc9a868,
    roughness: 0.25,
    metalness: 0.88,
  });

  // 3. Ultra-clear optical glass lens material: physically plausible, transparent,
  //    shows eyes crisply with subtle realistic surface reflections
  const lensMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 1.0,
    transmission: 0.96, // Highly transparent optical crown glass
    roughness: 0.02,
    metalness: 0.0,
    ior: 1.52,
    reflectivity: 0.25,
    clearcoat: 0.85,
    clearcoatRoughness: 0.04,
    depthWrite: false, // Critical: prevents z-buffer clipping with eyes and eyelids
    side: THREE.FrontSide,
  });

  // 4. Soft translucent frosted silicone nose pads
  const nosePadMat = new THREE.MeshPhysicalMaterial({
    color: 0xf2f2f4,
    transparent: true,
    opacity: 0.85,
    transmission: 0.55,
    roughness: 0.42,
    metalness: 0.02,
  });

  // ── Exact Anatomical Placement Coordinates ──────────────────────────────
  // Extracted from character's 3D mesh geometry in spine.006 local coordinate space:
  // - Left eye center: X = -0.489, Y = 1.235, Z = 1.108
  // - Right eye center: X = +0.489, Y = 1.235, Z = 1.108
  // - Eye width: 0.671, height: 0.461
  // - Nose crest: X = 0.0, Y = 1.22 to 1.26, Z = 1.140
  const eyeCenterX = 0.475; // Symmetrical offset from center for each eye
  const eyeCenterY = 1.242; // Perfect vertical alignment with pupils
  const frameZ = 1.172;     // Sits ~0.064 units in front of corneas, clears face cleanly

  const lensRadiusX = 0.295; // Radius in X (diameter ~0.59 to frame the full eye width)
  const lensRadiusY = 0.280; // Subtle panto/oval taper in Y (0.95 aspect ratio)
  const frameTubeRadius = 0.015; // Refined, slim modern frame rim (not bulky)

  // ── 1. Left & Right Frame Rims & Lenses ──────────────────────────────────
  // Torus geometry for the rim
  const rimGeom = new THREE.TorusGeometry(
    lensRadiusX,
    frameTubeRadius,
    24,
    64
  );

  // Slightly convex, clean circular lens geometry
  const lensGeom = new THREE.CircleGeometry(
    lensRadiusX - frameTubeRadius * 0.5,
    48
  );

  // Left Eye Frame Subgroup (with subtle pantoscopic tilt and face wrap)
  const leftEyeGroup = new THREE.Group();
  leftEyeGroup.position.set(-eyeCenterX, eyeCenterY, frameZ);
  leftEyeGroup.rotation.set(0.06, 0.04, 0); // Natural face curvature wrap
  leftEyeGroup.scale.set(1, lensRadiusY / lensRadiusX, 1);

  const leftRim = new THREE.Mesh(rimGeom, frameMat);
  leftEyeGroup.add(leftRim);

  const leftLens = new THREE.Mesh(lensGeom, lensMat);
  leftLens.position.z = 0.001; // Sits flush within the rim
  leftLens.renderOrder = 2;
  leftEyeGroup.add(leftLens);

  glassesGroup.add(leftEyeGroup);

  // Right Eye Frame Subgroup (mirrored symmetry)
  const rightEyeGroup = new THREE.Group();
  rightEyeGroup.position.set(eyeCenterX, eyeCenterY, frameZ);
  rightEyeGroup.rotation.set(0.06, -0.04, 0); // Mirrored face curvature wrap
  rightEyeGroup.scale.set(1, lensRadiusY / lensRadiusX, 1);

  const rightRim = new THREE.Mesh(rimGeom, frameMat);
  rightEyeGroup.add(rightRim);

  const rightLens = new THREE.Mesh(lensGeom, lensMat);
  rightLens.position.z = 0.001; // Sits flush within the rim
  rightLens.renderOrder = 2;
  rightEyeGroup.add(rightLens);

  glassesGroup.add(rightEyeGroup);

  // ── 2. Realistic Arched Nose Bridge ───────────────────────────────────────
  // A gentle 3D arched saddle curve that arches smoothly over the upper nose bridge,
  // seamlessly connecting the inner edges of both frame rims.
  const innerRimX = eyeCenterX - lensRadiusX; // ~0.180
  const bridgeCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-innerRimX - 0.005, eyeCenterY - 0.005, frameZ - 0.005),
    new THREE.Vector3(-innerRimX * 0.55, eyeCenterY + 0.024, frameZ + 0.012),
    new THREE.Vector3(0.0, eyeCenterY + 0.034, frameZ + 0.018), // Apex over nose crest
    new THREE.Vector3(innerRimX * 0.55, eyeCenterY + 0.024, frameZ + 0.012),
    new THREE.Vector3(innerRimX + 0.005, eyeCenterY - 0.005, frameZ - 0.005),
  ]);

  const bridgeGeom = new THREE.TubeGeometry(bridgeCurve, 32, 0.011, 16, false);
  const bridge = new THREE.Mesh(bridgeGeom, goldAccentMat);
  glassesGroup.add(bridge);

  // ── 3. Nose Pad Arms & Silicone Pads ─────────────────────────────────────
  // Delicate pad arms branching down from the inner rim
  const leftPadArmCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-innerRimX - 0.01, eyeCenterY - 0.02, frameZ - 0.01),
    new THREE.Vector3(-innerRimX * 0.75, eyeCenterY - 0.07, frameZ - 0.015),
    new THREE.Vector3(-innerRimX * 0.65, eyeCenterY - 0.10, frameZ - 0.01),
  ]);
  const leftPadArm = new THREE.Mesh(
    new THREE.TubeGeometry(leftPadArmCurve, 16, 0.006, 12, false),
    goldAccentMat
  );
  glassesGroup.add(leftPadArm);

  const rightPadArmCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(innerRimX + 0.01, eyeCenterY - 0.02, frameZ - 0.01),
    new THREE.Vector3(innerRimX * 0.75, eyeCenterY - 0.07, frameZ - 0.015),
    new THREE.Vector3(innerRimX * 0.65, eyeCenterY - 0.10, frameZ - 0.01),
  ]);
  const rightPadArm = new THREE.Mesh(
    new THREE.TubeGeometry(rightPadArmCurve, 16, 0.006, 12, false),
    goldAccentMat
  );
  glassesGroup.add(rightPadArm);

  // Translucent oval silicone pads resting gently on the nose sides
  const padGeom = new THREE.SphereGeometry(0.022, 16, 16);
  padGeom.scale(0.6, 1.4, 0.5);

  const leftPad = new THREE.Mesh(padGeom, nosePadMat);
  leftPad.position.set(-innerRimX * 0.65, eyeCenterY - 0.10, frameZ - 0.008);
  leftPad.rotation.set(0.1, 0.35, -0.2);
  glassesGroup.add(leftPad);

  const rightPad = new THREE.Mesh(padGeom, nosePadMat);
  rightPad.position.set(innerRimX * 0.65, eyeCenterY - 0.10, frameZ - 0.008);
  rightPad.rotation.set(0.1, -0.35, 0.2);
  glassesGroup.add(rightPad);

  // ── 4. Endpieces, Hinges & Temple Arms (Sides) ──────────────────────────
  const outerRimX = eyeCenterX + lensRadiusX; // ~0.770

  // Left Endpiece & Hinge Block
  const hingeGeom = new THREE.BoxGeometry(0.032, 0.024, 0.038);
  const leftHinge = new THREE.Mesh(hingeGeom, goldAccentMat);
  leftHinge.position.set(-outerRimX - 0.012, eyeCenterY + 0.01, frameZ - 0.015);
  glassesGroup.add(leftHinge);

  // Left Temple Arm smoothly contouring the head back to the ear
  const leftTempleCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-outerRimX - 0.022, eyeCenterY + 0.01, frameZ - 0.025),
    new THREE.Vector3(-0.815, eyeCenterY + 0.008, 0.70),
    new THREE.Vector3(-0.840, eyeCenterY + 0.004, 0.15),
    new THREE.Vector3(-0.850, eyeCenterY - 0.015, -0.20), // Drops gently behind ear
  ]);
  const leftTemple = new THREE.Mesh(
    new THREE.TubeGeometry(leftTempleCurve, 32, 0.011, 16, false),
    frameMat
  );
  glassesGroup.add(leftTemple);

  // Right Endpiece & Hinge Block
  const rightHinge = new THREE.Mesh(hingeGeom, goldAccentMat);
  rightHinge.position.set(outerRimX + 0.012, eyeCenterY + 0.01, frameZ - 0.015);
  glassesGroup.add(rightHinge);

  // Right Temple Arm smoothly contouring the head back to the ear
  const rightTempleCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(outerRimX + 0.022, eyeCenterY + 0.01, frameZ - 0.025),
    new THREE.Vector3(0.815, eyeCenterY + 0.008, 0.70),
    new THREE.Vector3(0.840, eyeCenterY + 0.004, 0.15),
    new THREE.Vector3(0.850, eyeCenterY - 0.015, -0.20), // Drops gently behind ear
  ]);
  const rightTemple = new THREE.Mesh(
    new THREE.TubeGeometry(rightTempleCurve, 32, 0.011, 16, false),
    frameMat
  );
  glassesGroup.add(rightTemple);

  // Shadows
  glassesGroup.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  // Attached directly to head bone so all mouse rotations move the glasses naturally
  headBone.add(glassesGroup);
};

/**
 * Changes the mascot from all-white clay/mannequin to a realistic human developer:
 * - Natural, warm human skin tone on Face (Plane.007), Ears, Neck, and Hands
 * - Stylish dark modern developer attire for shirt and pants
 */
const applyHumanColors = (character: THREE.Object3D) => {
  // Realistic warm human skin tone (warm South Asian tan)
  const skinColor = new THREE.Color(0xbd7d4c);
  // Stylish modern developer attire
  const shirtColor = new THREE.Color(0x22242c); // Dark charcoal hoodie/tee
  const pantColor = new THREE.Color(0x181920);  // Dark sleek pants
  const shoeColor = new THREE.Color(0xe4e4e7);  // Clean sneakers
  const soleColor = new THREE.Color(0x2d2e36);  // Sneaker sole

  character.traverse((child: any) => {
    if (child.isMesh) {
      const mesh = child as THREE.Mesh;
      const name = (mesh.name || "").toLowerCase();

      // Clone material so changes to one mesh don't affect other meshes sharing 'default'
      if (mesh.material) {
        if (Array.isArray(mesh.material)) {
          mesh.material = mesh.material.map((m) => m.clone());
        } else {
          mesh.material = (mesh.material as THREE.Material).clone();
        }
      }

      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

      mats.forEach((mat: any) => {
        if (!mat || !mat.color) return;

        // Skip eyes and screen lights
        const matName = (mat.name || "").toLowerCase();
        if (
          name.includes("eye") ||
          matName.includes("eye") ||
          name.includes("screen") ||
          matName.includes("screen")
        ) {
          return;
        }

        // 1. Human Skin: Face/Head (Plane.007), Ears, Neck, Hands
        if (
          name.includes("plane.007") ||
          name.includes("plane007") ||
          name.includes("ear") ||
          name.includes("neck") ||
          name.includes("hand")
        ) {
          mat.color.copy(skinColor);
          if (mat.roughness !== undefined) mat.roughness = 0.6;
          if (mat.metalness !== undefined) mat.metalness = 0.02;
          return;
        }

        // 2. Shirt / Hoodie
        if (name.includes("shirt") || name.includes("body")) {
          mat.color.copy(shirtColor);
          if (mat.roughness !== undefined) mat.roughness = 0.85;
          if (mat.metalness !== undefined) mat.metalness = 0.05;
          return;
        }

        // 3. Pants
        if (name.includes("pant")) {
          mat.color.copy(pantColor);
          if (mat.roughness !== undefined) mat.roughness = 0.8;
          if (mat.metalness !== undefined) mat.metalness = 0.05;
          return;
        }

        // 4. Shoes & Soles
        if (name.includes("sole")) {
          mat.color.copy(soleColor);
          return;
        }
        if (name.includes("shoe")) {
          mat.color.copy(shoeColor);
          return;
        }
      });
    }
  });
};

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);

  const loadCharacter = () => {
    return new Promise<GLTF | null>(async (resolve, reject) => {
      try {
        const encryptedBlob = await decryptFile(
          "/models/character.enc",
          "Character3D#@"
        );
        const blobUrl = URL.createObjectURL(new Blob([encryptedBlob]));

        let character: THREE.Object3D;
        loader.load(
          blobUrl,
          async (gltf) => {
            character = gltf.scene;
            try {
              await Promise.race([
                renderer.compileAsync(character, camera, scene),
                new Promise((r) => setTimeout(r, 1500)),
              ]);
            } catch (compileErr) {
              console.warn("Shader compilation fallback:", compileErr);
            }
            character.traverse((child: any) => {
              if (child.isMesh) {
                const mesh = child as THREE.Mesh;
                child.castShadow = true;
                child.receiveShadow = true;
                mesh.frustumCulled = true;
              }
            });

            // Apply realistic human skin tone and modern developer attire
            applyHumanColors(character);

            // Add expertly fitted, realistic eyeglasses to the mascot's face
            addGlasses(character);

            resolve(gltf);
            setCharTimeline(character, camera);
            setAllTimeline();
            character!.getObjectByName("footR")!.position.y = 3.36;
            character!.getObjectByName("footL")!.position.y = 3.36;
            dracoLoader.dispose();
          },
          undefined,
          (error) => {
            console.error("Error loading GLTF model:", error);
            reject(error);
          }
        );
      } catch (err) {
        reject(err);
        console.error(err);
      }
    });
  };

  return { loadCharacter };
};

export default setCharacter;