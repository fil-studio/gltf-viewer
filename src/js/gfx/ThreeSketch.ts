import { ThreeDOMLayer, ThreeLayer } from "@fils/gl-dom";
import { UI, UIGroup } from "@fils/ui";
import { uiWorld } from "@fils/ui-icons";
import { ACESFilmicToneMapping, AgXToneMapping, CineonToneMapping, DataTexture, EquirectangularReflectionMapping, FloatType, LinearToneMapping, Mesh, MeshStandardMaterial, NeutralToneMapping, NoToneMapping, PerspectiveCamera, ReinhardToneMapping, RGBAFormat } from "three";
import { gltfLoader, hdrLoader, readFileAsArrayBuffer, tLoader } from "./Loaders";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { getHDRI } from "@fils/gfx";

export class ThreeSketch extends ThreeLayer {
    camera:PerspectiveCamera;
    ui:UI;
    bgColor:string = "#ffffff";
    sceneUI:UIGroup;
    controls:OrbitControls;

    constructor(_gl:ThreeDOMLayer) {
        super(_gl);
        const w = this.gl.rect.width;
        const h = this.gl.rect.height;
        this.camera = new PerspectiveCamera(35, w/h, .1, 500);
        this.scene.add(this.camera);
        this.params.camera = this.camera;

        this.camera.position.z = 10;
        this.controls = new OrbitControls(this.camera, this.gl.dom);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = .06;

        this.gl.renderer.outputColorSpace = 'srgb';

        this.initGUI();
    }

    initGUI() {
        this.ui = new UI({
            title: 'GL Settings',
            icon: uiWorld
        });

        this.ui.addInfo([
            "Drag and drop files anywhere to load.",
            "Supported File types:",
            "GLTF / GLB: Scene files",
            ".hdr: HDRI equirectangular images for environment",
            ".jpg, .png, .webp: Regular images for environment"
        ]);

        const core = this.ui.addGroup({
            title: '🍩 Rendering Settings'
        });
        core.add(this, 'bgColor', {
            view: 'color',
            title: 'BG Color'
        }).on('change', () => {
            this.gl.renderer.setClearColor(this.bgColor);
        });

        core.add(this.gl.renderer, 'outputColorSpace', {
            title: 'Color Space',
            options: {
                // 'No Color Space': '',
                'SRGB (recomended)': 'srgb',
                'Linear SRGB': 'srgb-linear'
            }
        })

        core.add(this.gl.renderer, 'toneMapping', {
            title: 'Tone Mapping',
            options: {
                'None': NoToneMapping,
                'Linear': LinearToneMapping,
                'Reinhard': ReinhardToneMapping,
                'Cineon': CineonToneMapping,
                'ACES Filmic': ACESFilmicToneMapping,
                'AgX': AgXToneMapping,
                'Neutral': NeutralToneMapping,
            }
        });

        console.log(this.scene.children.length);

        if(this.scene.children.length === 1) return;

        this.sceneUI = this.ui.addGroup({
            title: '🎬 Scene'
        });

        const addMaterial = (mat:MeshStandardMaterial) => {
            const g = this.sceneUI.addGroup({
                title: `Matertial: ${mat.name}`
            });
            g.add(mat, 'envMapIntensity', {
                min: 0,
                max: 1,
                overExpose: [0, 1]
            }).on('change', () => {
                mat.needsUpdate = true;
            })
        }

        this.scene.traverse(obj => {
            if(obj['isMesh']) {
                const mesh = obj as Mesh;
                const mat = mesh.material as MeshStandardMaterial;
                mat.envMap = this.scene.environment;
                addMaterial(mat);
            }
        })
    }

    set gltf(value:File) {
        const arrayBuffer = readFileAsArrayBuffer(value).then((buff:ArrayBuffer) => {
            this.scene.clear();
            this.scene.add(this.camera);

            gltfLoader.parse(buff, null, gltf => {
                this.scene.add(gltf.scene);
                this.ui.destroy();
                this.initGUI();
            });

        }, () => {
            console.warn('Error Parsing file');
        });
    }

    set hdri(value:File) {
        const arrayBuffer = readFileAsArrayBuffer(value).then((buff:ArrayBuffer) => {
            const uint8Array = new Uint8Array(buff);
            const blob = new Blob([uint8Array], { type: 'application/octet-stream' });
            const url = URL.createObjectURL(blob);
            // Convert RGBE to DataTexture

            hdrLoader.load(url, texture => {
                const env = getHDRI(texture, this.gl.renderer);
                this.scene.environment = env;

                this.scene.traverse(obj => {
                    if(obj['isMesh']) {
                        const mesh = obj as Mesh;
                        const mat = mesh.material as MeshStandardMaterial;
                        mat.envMap = env;
                        // addMaterial(mat);
                    }
                })
            })
        }, () => {
            console.warn('Error Parsing file');
        });
    }

    set env(value:File) {
        const arrayBuffer = readFileAsArrayBuffer(value).then((buff:ArrayBuffer) => {
            const uint8Array = new Uint8Array(buff);
            const blob = new Blob([uint8Array], { type: 'application/octet-stream' });
            const url = URL.createObjectURL(blob);
            // Convert RGBE to DataTexture

            tLoader.load(url, texture => {
                const env = getHDRI(texture, this.gl.renderer);
                this.scene.environment = env;
            })
        }, () => {
            console.warn('Error Parsing file');
        });
    }

    update(time:number) {
        this.controls.update();
    }
}