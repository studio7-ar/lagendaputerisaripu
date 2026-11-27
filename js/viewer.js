// =========================================
// THE LEGEND OF PUTERI SARIPU
// INDIVIDUAL 3D SCENE VIEWER
// =========================================

const modelViewer = document.getElementById("sceneModel");
const modelMessage = document.getElementById("modelMessage");
const messageTitle = document.getElementById("messageTitle");
const messageText = document.getElementById("messageText");
const sceneTitle = document.getElementById("sceneTitle");
const pageTitle = document.getElementById("pageTitle");
const pageSubtitle = document.getElementById("pageSubtitle");
const sceneBadge = document.getElementById("sceneBadge");
const languageSelect = document.getElementById("languageSelect");
const rotateButton = document.getElementById("rotateButton");
const animationButton = document.getElementById("animationButton");
const resetButton = document.getElementById("resetButton");
const fullscreenButton = document.getElementById("fullscreenButton");
const previousScene = document.getElementById("previousScene");
const nextScene = document.getElementById("nextScene");

const params = new URLSearchParams(window.location.search);
const sceneNumber = Math.min(12, Math.max(1, parseInt(params.get("scene"), 10) || 1));
const language = params.get("lang") || "en";
const sceneLabel = String(sceneNumber).padStart(2, "0");


// Add a model link for each scene here when the Drive assets are ready.
// Example: 1: "https://your-host/model-scene-01.glb"
const SCENE_MODELS = {
  1: "https://PUT-YOUR-R2-MODEL-URL-HERE/scene1-garden.glb",
  2: "", 3: "", 4: "", 5: "", 6: "", 7: "", 8: "", 9: "", 10: "", 11: "", 12: ""
};

const languageLabels = {
  en: { subtitle: "Explore the scene from every angle.", placeholder: "This viewer is ready. Once the scene model link is added, it will appear here for you to rotate and explore." },
  ms: { subtitle: "Terokai babak ini dari setiap sudut.", placeholder: "Paparan ini sudah sedia. Model 3D akan muncul di sini apabila pautannya ditambah." },
  kd: { subtitle: "Explore the scene from every angle.", placeholder: "Model 3D akan dipaparkan di sini apabila pautannya ditambah." }
};


// Update the scene labels and navigation links.
document.title = `Scene ${sceneNumber} | The Legend of Puteri Saripu`;
pageTitle.textContent = `Scene ${sceneLabel}`;
sceneTitle.textContent = `Scene ${sceneNumber}`;
sceneBadge.textContent = `SCENE ${sceneLabel} / 12`;


function updateLanguage(selectedLanguage) {
  const copy = languageLabels[selectedLanguage] || languageLabels.en;
  pageSubtitle.textContent = copy.subtitle || languageLabels.en.subtitle;
  if (!modelViewer.src) {
    messageText.textContent = copy.placeholder || languageLabels.en.placeholder;
  }
}


// Keep the language in the URL so the page can be shared.
languageSelect.value = ["en", "ms", "kd"].includes(language) ? language : "en";
updateLanguage(languageSelect.value);
languageSelect.addEventListener("change", () => {
  params.set("lang", languageSelect.value);
  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, "", newUrl);
  previousScene.href = `viewer.html?scene=${Math.max(1, sceneNumber - 1)}&lang=${languageSelect.value}`;
  nextScene.href = `viewer.html?scene=${Math.min(12, sceneNumber + 1)}&lang=${languageSelect.value}`;
  updateLanguage(languageSelect.value);
});


// Use an optional ?model= URL for quick testing, otherwise use the scene map.
const modelUrl = params.get("model") || SCENE_MODELS[sceneNumber];
if (modelUrl && !modelUrl.includes("PUT-YOUR-R2-MODEL-URL-HERE")) {
  modelViewer.src = modelUrl;
  modelMessage.classList.add("hidden");
} else {
  messageTitle.textContent = "Scene model not connected yet";
  messageText.textContent = "Upload the GLB to Cloudflare R2, then paste its public URL into js/viewer.js.";
}


// Show a message if the model fails to load.
modelViewer.addEventListener("error", () => {
  modelMessage.classList.remove("hidden");
  messageTitle.textContent = "Unable to load this model";
  messageText.textContent = "Check the model URL and sharing permissions, then try again.";
});
modelViewer.addEventListener("load", () => {
  modelMessage.classList.add("hidden");
  const animations = modelViewer.availableAnimations || [];
  animationButton.hidden = animations.length === 0;
  animationButton.textContent = animations.length ? "▶ Play animation" : "No animation";
  animationButton.disabled = animations.length === 0;
});


// Auto-rotation toggle.
rotateButton.addEventListener("click", () => {
  modelViewer.autoRotate = !modelViewer.autoRotate;
  rotateButton.classList.toggle("active", modelViewer.autoRotate);
  rotateButton.textContent = modelViewer.autoRotate ? "⟳ Auto rotate" : "⟳ Rotation off";
});


// Play or pause the first model animation, if present.
let animationPlaying = false;
animationButton.addEventListener("click", () => {
  if (!modelViewer.availableAnimations?.length) return;
  animationPlaying = !animationPlaying;
  modelViewer.animationName = modelViewer.availableAnimations[0];
  modelViewer.playbackRate = 1;
  if (animationPlaying) modelViewer.play();
  else modelViewer.pause();
  animationButton.textContent = animationPlaying ? "Ⅱ Pause animation" : "▶ Play animation";
});


// Reset camera to the model's initial framing.
resetButton.addEventListener("click", () => {
  modelViewer.cameraOrbit = "auto auto auto";
  modelViewer.cameraTarget = "auto auto auto";
  modelViewer.fieldOfView = "auto";
});


// Fullscreen model stage (supported browsers only).
fullscreenButton.addEventListener("click", async () => {
  const stage = document.querySelector(".model-stage");
  try {
    if (!document.fullscreenElement) await stage.requestFullscreen();
    else await document.exitFullscreen();
  } catch (error) {
    fullscreenButton.textContent = "Fullscreen unavailable";
  }
});


// Scene navigation preserves the selected language.
previousScene.href = `viewer.html?scene=${Math.max(1, sceneNumber - 1)}&lang=${languageSelect.value}`;
nextScene.href = `viewer.html?scene=${Math.min(12, sceneNumber + 1)}&lang=${languageSelect.value}`;
previousScene.style.visibility = sceneNumber === 1 ? "hidden" : "visible";
nextScene.style.visibility = sceneNumber === 12 ? "hidden" : "visible";
