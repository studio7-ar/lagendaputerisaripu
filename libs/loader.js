
import { GLTFLoader } from "./three.js-r132/examples/jsm/loaders/GLTFLoader.js";

const loader = new GLTFLoader();

export function loadGLTF(path) {
  return loader.loadAsync(path);
}
