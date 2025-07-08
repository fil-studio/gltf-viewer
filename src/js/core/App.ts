import { ThreeDOMLayer } from "@fils/gl-dom";
import { ThreeSketch } from "../gfx/ThreeSketch";
import { Timer } from "@fils/ani";
import { addFileDropHandler } from "@fils/utils";

export class App {
	gl:ThreeDOMLayer;
	sketch:ThreeSketch;
	clock:Timer;

	constructor() {
		this.gl = new ThreeDOMLayer(document.querySelector('.view'), {
			antialias: true
		});
		this.gl.renderer.setClearColor(0xffffff, 1);
		this.sketch = new ThreeSketch(this.gl);
		this.start();

		console.log('^_^ Hello World!');
	}

	start() {
		const animate = () => {
			requestAnimationFrame(animate);
			this.update();
		}

		requestAnimationFrame(animate);

		this.clock = new Timer(true);

		addFileDropHandler(document.documentElement, ((files:File[]) => {
			for(const file of files) {
				const parts = file.name.split(".");
				const ext = parts[parts.length-1].toLocaleLowerCase();

				if(ext === 'gltf' || ext === 'glb') {
					console.log('Found GLTF file');
					this.sketch.gltf = file;
				} else if(ext === 'hdr') {
					console.log('Found HDRI file');
					this.sketch.hdri = file;
				} else if(file.type.indexOf('image/') === 0) {
					console.log('Found image file');
					this.sketch.env = file;
				}
			}
			document.querySelector('.dropper').classList.remove('drop');
		}), () => {
			document.querySelector('.dropper').classList.add('drop');
		}, () => {
			document.querySelector('.dropper').classList.remove('drop');
		})
	}

	update() {
		this.clock.tick();
		const t = this.clock.currentTime;
		this.sketch.update(t);
		this.sketch.render();
	}
}