import { updateMoleculePosition } from "./physics.js";
import { checkWallCollisions } from "./physics.js";

const offscreen = document.querySelector("canvas.playground").transferControlToOffscreen();
const worker = new Worker("canvasWorker.js", {type: "module"});
worker.postMessage({canvas: offscreen, msg: "start"}, [offscreen]);

window.addEventListener("resize", () => worker.postMessage({h:window.innerHeight, w:window.innerWidth, msg:"update"}));
let molecules = Array(100).fill({r:15, velX:1, velY:1}).map(updateMoleculePosition)
.map(molecule => checkWallCollisions(molecule, { minX: 0, minY: 0, maxX:window.innerWidth, maxY:window.innerHeight}))
window.requestAnimationFrame(()=> window.postMessage({msg:"draw"}))