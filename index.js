import { calculateFPScreator } from "./helper.js";
//import { allCollisionCheck } from "./physics.js";
import { updateMoleculePosition } from "./physics.js";
import { checkWallCollisions } from "./physics.js";
import { Molecule } from "./Molecule.js"

const offscreen = document.querySelector("canvas.playground").transferControlToOffscreen();
const dataContainer = document.querySelector("div.data");
const worker = new Worker("./canvasWorker.js", {type: "module"});
const fps = calculateFPScreator(1000);
let phFPS = 0, selectedMolecule;
let molecules = Array(10)
    .fill(null)
    .map(() => new Molecule(15, { minX: 0, minY: 0, maxX:window.innerWidth, maxY:window.innerHeight, minVelX: -0.3, minVelY: -0.3, maxVelX: 0.3, maxVelY: 0.3}))

molecules.forEach(molecule => molecule.checkWallCollisions({ minX: 0, minY: 0, maxX:window.innerWidth, maxY:window.innerHeight}))

const resizeCanvas = () => worker.postMessage({h:window.innerHeight, w:window.innerWidth, msg:"update"});

const allCollisionCheck = (molecules) =>{
    molecules.sort((a,b) => a.minX - b.minX);
    for(let i = 0; i < molecules.length; i++){
        let offset = 1;
        while(molecules[i + offset] && molecules[i].maxX >= molecules[i + offset].minX){
            molecules[i].checkCollision(molecules[i + offset]);
            offset++;
        }
        molecules[i].checkWallCollisions({minX: 0, minY:0, maxX:window.innerWidth, maxY:window.innerHeight})
    }
}

const physicsLoop = () =>{
    molecules.forEach(molecule => molecule.updatePosition())
    allCollisionCheck(molecules);
    phFPS = fps();
    if(selectedMolecule){ selectedMolecule.showInfo(dataContainer) }
    //setTimeout(physicsLoop)
};

const drawLoop = () =>{
    worker.postMessage({msg:"draw", molecules, phFPS})
    window.requestAnimationFrame(drawLoop)
};

worker.postMessage({canvas: offscreen, msg: "start"}, [offscreen]);
resizeCanvas();
window.addEventListener("resize", resizeCanvas);
setInterval(physicsLoop, 40)
physicsLoop();
drawLoop();

window.addEventListener("click", (event)=>{
    const {clientX, clientY} = event;
    let minimum = Infinity, index;
    molecules.forEach((molecule, idx) =>{
        molecules[idx].selected = false;
        const distance = (molecule.x - clientX)**2 + (molecule.y - clientY) ** 2
        if( distance >= minimum) return;
        minimum = distance;
        index = idx
    });
    molecules[index].selected = true;
    molecules[index].fillStyle = "purple";
    selectedMolecule = molecules[index];
})