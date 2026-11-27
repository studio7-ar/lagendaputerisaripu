
import { loadGLTF } from "../libs/loader.js";

// ============================================
// 1. CONFIGURATION
// ============================================

const TARGET_FILE = "./assets/targets/scene1.mind";
const MODEL_URL = "https://PUT-YOUR-R2-MODEL-URL-HERE/scene1-garden.glb";

const MODEL_SCALE = 0.5;

// ============================================
// 2. HTML ELEMENTS
// ============================================

const container = document.querySelector("#ar-container");
const startButton = document.querySelector("#start-button");
const stopButton = document.querySelector("#stop-button");
const statusText = document.querySelector("#status");

// ============================================
// 3. VARIABLES
// ============================================

let mindarThree = null;
let mixer = null;
let clock = null;
let model = null;
let isRunning = false;

// ============================================
// 4. BUTTON EVENTS
// ============================================

startButton.addEventListener("click", startAR);
stopButton.addEventListener("click", stopAR);

console.log("AR script loaded successfully!");

// ============================================
// 5. START AR
// ============================================

async function startAR() {

  if (isRunning) return;

  startButton.disabled = true;
  statusText.textContent = "Loading Scene 1 model...";
  stopButton.style.display = "none";

  try {

    // ========================================
    // CHECK MINDAR
    // ========================================

    if (!window.MINDAR || !window.MINDAR.IMAGE) {
      throw new Error("MindAR library is missing.");
    }

    const THREE = window.MINDAR.IMAGE.THREE;

    // ========================================
    // LOAD 3D MODEL FIRST
    // ========================================

    const gltf = await loadGLTF(MODEL_URL);

    model = gltf.scene;

    model.scale.set(
      MODEL_SCALE,
      MODEL_SCALE,
      MODEL_SCALE
    );

    model.position.set(0, 0, 0);

    console.log("Scene 1 model loaded successfully!");

    // ========================================
    // CREATE AR
    // ========================================

    mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: container,
      imageTargetSrc: TARGET_FILE,
      maxTrack: 1
    });

    const renderer = mindarThree.renderer;
    const scene = mindarThree.scene;
    const camera = mindarThree.camera;

    // ========================================
    // LIGHTING
    // ========================================

    const ambientLight = new THREE.AmbientLight(
      0xffffff,
      2
    );

    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(
      0xffffff,
      2
    );

    directionalLight.position.set(1, 2, 3);
    scene.add(directionalLight);

    // ========================================
    // MARKER
    // ========================================

    const anchor = mindarThree.addAnchor(0);

    anchor.group.add(model);

    // ========================================
    // MODEL ANIMATION
    // ========================================

    clock = new THREE.Clock();

    if (gltf.animations && gltf.animations.length > 0) {

      mixer = new THREE.AnimationMixer(model);

      gltf.animations.forEach((clip) => {
        mixer.clipAction(clip).play();
      });

      console.log("Model animation started!");

    } else {

      console.log("No animation found in this GLB.");

    }

    // ========================================
    // START CAMERA
    // ========================================

    statusText.textContent = "Opening camera...";

    await mindarThree.start();

    isRunning = true;

    startButton.style.display = "none";
    stopButton.style.display = "inline-block";

    statusText.textContent =
      "AR started! Point your camera at the Scene 1 marker.";

    // ========================================
    // RENDER LOOP
    // ========================================

    renderer.setAnimationLoop(() => {

      if (mixer && clock) {
        mixer.update(clock.getDelta());
      }

      renderer.render(scene, camera);

    });

  } catch (error) {

    console.error("AR ERROR:", error);

    statusText.textContent =
      "Error: " + error.message;

    startButton.disabled = false;
    startButton.style.display = "inline-block";
    stopButton.style.display = "none";

    isRunning = false;

    if (mindarThree) {

      try {
        mindarThree.renderer.setAnimationLoop(null);
        await mindarThree.stop();
      } catch (stopError) {
        console.error("AR cleanup error:", stopError);
      }

      mindarThree = null;
    }

    mixer = null;
    clock = null;
    model = null;

  }

}

// ============================================
// 6. STOP AR
// ============================================

async function stopAR() {

  statusText.textContent = "Stopping AR...";

  if (mindarThree) {

    try {
      mindarThree.renderer.setAnimationLoop(null);
      await mindarThree.stop();
    } catch (error) {
      console.error("AR stop error:", error);
    }

    mindarThree = null;
  }

  mixer = null;
  clock = null;
  model = null;
  isRunning = false;

  startButton.disabled = false;
  startButton.style.display = "inline-block";
  stopButton.style.display = "none";

  statusText.textContent =
    "AR stopped. You can start again.";

  console.log("AR stopped.");

}
