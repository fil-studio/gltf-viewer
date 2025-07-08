import { TextureLoader } from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

const draco = new DRACOLoader();
draco.setDecoderPath("/assets/libs/draco/");

// export const ktxLoader = new KTX2Loader();
// ktxLoader.setPath("/assets/wasm/basis/");

export const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(draco);
// gltfLoader.setKTX2Loader(ktxLoader);

export const tLoader = new TextureLoader();
export const hdrLoader = new RGBELoader();

export async function readFileAsArrayBuffer(file:File) {
    const arrayBuffer = await file.arrayBuffer();
    return arrayBuffer;
}