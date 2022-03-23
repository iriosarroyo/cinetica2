import { calculateFPScreator } from "./helper.js";
import { allCollisionCheck } from "./physics.js";
import { updateMoleculePosition } from "./physics.js";
import { checkWallCollisions } from "./physics.js";

const offscreen = document.querySelector("canvas.playground").transferControlToOffscreen();
const dataContainer = document.querySelector("div.data");
const worker = new Worker("./canvasWorker.js", {type: "module"});
const fps = calculateFPScreator(1000);
let phFPS = 0, selectedMolecule;
let molecules = Array(10)
    .fill({r:15})
    .map(updateMoleculePosition)
    .map(molecule => checkWallCollisions(molecule, { minX: 0, minY: 0, maxX:window.innerWidth, maxY:window.innerHeight}))
const resizeCanvas = () => worker.postMessage({h:window.innerHeight, w:window.innerWidth, msg:"update"});
const physicsLoop = () =>{
    molecules = molecules.map(updateMoleculePosition)
    /* molecules = molecules
    .map(molecule => checkWallCollisions(molecule, { minX: 0, minY: 0, maxX:window.innerWidth, maxY:window.innerHeight})) */
    molecules = allCollisionCheck(molecules);
    /* molecules = allCollisionCheck(molecules);
    molecules = allCollisionCheck(molecules); */
    phFPS = fps();
    if(selectedMolecule){
        dataContainer.innerHTML = "";
        Object.entries(molecules.find(x => x.selected)).forEach(([key, value]) =>{
            dataContainer.innerHTML += `<strong>${key}</strong><span>${value}</span>`
        })
    }
    //setTimeout(physicsLoop)
};

const drawLoop = () =>{
    worker.postMessage({msg:"draw", molecules, phFPS})
    window.requestAnimationFrame(drawLoop)
};

worker.postMessage({canvas: offscreen, msg: "start"}, [offscreen]);
resizeCanvas();
window.addEventListener("resize", resizeCanvas);
setInterval(physicsLoop)
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
    molecules[index] = {...molecules[index], fillStyle:"purple", duration: 1000, selected: true}
    selectedMolecule = true
    console.log(molecules, molecules[index], index)
})