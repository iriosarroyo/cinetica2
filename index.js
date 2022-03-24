import { calculateFPScreator } from "./helper.js";
//import { allCollisionCheck } from "./physics.js";
import { updateMoleculePosition } from "./physics.js";
import { checkWallCollisions } from "./physics.js";
import { Molecule } from "./Molecule.js"

const offscreen = document.querySelector("canvas.playground").transferControlToOffscreen();
const dataContainer = document.querySelector("div.data");
const fpsCanvas = document.querySelector(".canvasFps");
const fpsPhysics = document.querySelector(".physicsFps");
const fpsIndex = document.querySelector(".indexFps");
const velMedia = document.querySelector(".velMedia");
const moleculesNum = document.querySelector(".moleculesNum");
const moleculesR = document.querySelector(".moleculesR");
const timerContainer = document.querySelector(".timer");
const worker = new Worker("./canvasWorker.js", {type: "module"});
const fps = calculateFPScreator(1000);
const idxFPS = calculateFPScreator(10);
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

const groupByFillStyle = (actualMolecules) =>{
    const fillStyles = {};
    actualMolecules.forEach((molecule) =>{
        if(!fillStyles[molecule.fillStyle]) fillStyles[molecule.fillStyle] = [];
        fillStyles[molecule.fillStyle].push(molecule.getDataToSend());
    })
    return Object.entries(fillStyles);
}

const physicsLoop = () =>{
    molecules.forEach(molecule => molecule.updatePosition())
    allCollisionCheck(molecules);
    phFPS = fps();
    if(selectedMolecule){ selectedMolecule.showInfo(dataContainer) }
    
    //setTimeout(physicsLoop)
};




const drawLoop = (first) =>{
    //worker.postMessage({msg:"draw", molecules, phFPS})
    velMedia.textContent = Math.round(molecules.reduce((acum, val) => acum + val.vel.module() ** 2 * val.m, 0) / molecules.length * 100) / 100;
    fpsPhysics.textContent = phFPS;
    fpsIndex.textContent = idxFPS();
    worker.postMessage({msg:"draw", molecules:groupByFillStyle(molecules), first:first === true})
    window.requestAnimationFrame(drawLoop)
};


worker.postMessage({canvas: offscreen, msg: "start"}, [offscreen]);
resizeCanvas();
window.addEventListener("resize", resizeCanvas);
setInterval(physicsLoop)
physicsLoop();
drawLoop(true);

window.addEventListener("click", (event)=>{
    const {clientX, clientY} = event;
    let minimum = Infinity, index;
    molecules.forEach((molecule, idx) =>{
        molecules[idx].selected = false;
        const distance = (molecule.pos.x - clientX)**2 + (molecule.pos.y - clientY) ** 2
        if( distance >= minimum) return;
        minimum = distance;
        index = idx
    });
    molecules[index].selected = true;
    molecules[index].fillStyle = "purple";
    selectedMolecule = molecules[index];
})

worker.addEventListener("message", (e) =>{
    const {msg, data} = e.data;
    if(msg === "fps") fpsCanvas.textContent = data;
    else if(msg === "timer"){
        const {time, name} = data;
        let thisTimer = timerContainer.querySelector(`.timer-${name}`);
        if(!thisTimer){
            timerContainer.innerHTML += `<strong>${name}</strong><span class='timer-${name}'>${time}</span>`
        }else thisTimer.textContent = time;
    }
})

let r = 2;
moleculesNum.addEventListener("change", (e) =>{
    while(parseInt(e.target.value) > molecules.length)
        molecules.push(new Molecule(r, { minX: 0, minY: 0, maxX:window.innerWidth, maxY:window.innerHeight, minVelX: -0.3, minVelY: -0.3, maxVelX: 0.3, maxVelY: 0.3}))
    molecules.sort(()=>Math.random() - 0.5)
    molecules.length = parseInt(e.target.value);
})

moleculesR.addEventListener("change", (e) =>{
    const newR = parseInt(e.target.value);
    r = newR;
    molecules.forEach(molecule => molecule.r = newR)
})