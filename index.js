import { allCollisionCheck } from "./physics.js";
import { updateMoleculePosition } from "./physics.js";
import { checkWallCollisions } from "./physics.js";

const offscreen = document.querySelector("canvas.playground").transferControlToOffscreen();
const worker = new Worker("./canvasWorker.js", {type: "module"});
const fps = calculateFPScreator();
let molecules = Array(100)
    .fill({r:15})
    .map(x => ({...x, velX: (Math.random() - 0.5) * 2, velY: (Math.random() - 0.5) * 2}))
    .map(updateMoleculePosition)
    .map(molecule => checkWallCollisions(molecule, { minX: 0, minY: 0, maxX:window.innerWidth, maxY:window.innerHeight}))

const resizeCanvas = () => worker.postMessage({h:window.innerHeight, w:window.innerWidth, msg:"update"});
const physicsLoop = () =>{
    molecules = molecules.map(updateMoleculePosition)
    .map(molecule => checkWallCollisions(molecule, { minX: 0, minY: 0, maxX:window.innerWidth, maxY:window.innerHeight}))
    molecules = allCollisionCheck(molecules);
    /* molecules = allCollisionCheck(molecules);
    molecules = allCollisionCheck(molecules); */
    console.log(fps());
    setTimeout(physicsLoop, 40)
};

const drawLoop = () =>{
    worker.postMessage({msg:"draw", molecules})
    window.requestAnimationFrame(drawLoop)
};

worker.postMessage({canvas: offscreen, msg: "start"}, [offscreen]);
resizeCanvas();
window.addEventListener("resize", resizeCanvas);
//setInterval(physicsLoop)
physicsLoop();
drawLoop();