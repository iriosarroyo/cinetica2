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
let molecules = Array(1000)
    .fill(null)
    .map(() => new Molecule(2, { minX: 0, minY: 0, maxX:window.innerWidth, maxY:window.innerHeight, minVelX: -0.3, minVelY: -0.3, maxVelX: 0.3, maxVelY: 0.3}))

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
    console.time("first")
    molecules.forEach(molecule => molecule.updatePosition())
    console.timeEnd("first")
    console.time("collisions")
    allCollisionCheck(molecules);
    console.timeEnd("collisions")
    phFPS = fps();
    if(selectedMolecule){ selectedMolecule.showInfo(dataContainer) }
    console.time("group")
    const fillStyles = {};
    molecules.forEach((molecule) =>{
        if(!fillStyles[molecule.fillStyle]) fillStyles[molecule.fillStyle] = [];
        fillStyles[molecule.fillStyle].push(molecule);
    })
    console.timeEnd("group")
    worker.postMessage({msg:"draw", molecules:fillStyles, phFPS})
    //setTimeout(physicsLoop)
};

const drawLoop = () =>{
    //worker.postMessage({msg:"draw", molecules, phFPS})
    //window.requestAnimationFrame(drawLoop)
};

worker.postMessage({canvas: offscreen, msg: "start"}, [offscreen]);
resizeCanvas();
window.addEventListener("resize", resizeCanvas);
setInterval(physicsLoop)
physicsLoop();
//drawLoop();
const fillStyles = {};
molecules.forEach((molecule) =>{
    fillStyles[molecule.fillStyle] = [...(fillStyles[molecule.fillStyle] ?? []), molecule]
})
worker.postMessage({msg:"draw", molecules:fillStyles, phFPS, first:true})

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