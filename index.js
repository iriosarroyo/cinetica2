import { calculateFPScreator } from "./helper.js";

const dataContainer = document.querySelector("div.data");
const fpsCanvas = document.querySelector(".canvasFps");
const fpsPhysics = document.querySelector(".physicsFps");
const fpsIndex = document.querySelector(".indexFps");
const velMedia = document.querySelector(".velMedia");
const moleculesNum = document.querySelector(".moleculesNum");
const moleculesR = document.querySelector(".moleculesR");
const timerContainer = document.querySelector(".timer");
const idxFPS = calculateFPScreator(10);
let workers = [], moleculeByWorker = [], phFPS; 

const sendResize = (worker) => worker.postMessage({h:window.innerHeight, w:window.innerWidth, msg:"update"});
const resizeCanvas = () => workers.forEach(sendResize);

const workerListener = (e, id) =>{
    const {msg, data} = e.data;
    if(msg === "fps") {
        let thisFPScontainer = document.querySelector(`.fps-${id}`);
        if(!thisFPScontainer){
            document.querySelector(".fps").innerHTML += `<strong>${id}-FPS</strong><span class='fps-${id}'>${data}</span>`
        }else thisFPScontainer.textContent = data;
    }
    else if(msg === "timer"){
        const {time, name} = data;
        let thisTimer = timerContainer.querySelector(`.timer-${id}-${name}`);
        if(!thisTimer){
            timerContainer.innerHTML += `<strong>${id}-${name}</strong><span class='timer-${id}-${name}'>${time}</span>`
        }else thisTimer.textContent = time;
    }
};


const groupByFillStyle = (actualMolecules) =>{
    const fillStyles = {};
    for(let i = 0; i < actualMolecules.length; i++){
        const molecule = actualMolecules[i];
        if(!fillStyles[molecule.fillStyle]) fillStyles[molecule.fillStyle] = [];
        fillStyles[molecule.fillStyle].push(molecule);
    }
    return Object.entries(fillStyles);
}


const drawLoop = (first) =>{
    //worker.postMessage({msg:"draw", molecules, phFPS})
    console.time("velmedia")
    //velMedia.textContent = Math.round(molecules.reduce((acum, val) => acum + val.vel.module() ** 2 * val.m, 0) / molecules.length * 100) / 100;
    fpsPhysics.textContent = phFPS;
    fpsIndex.textContent = idxFPS();
    console.timeEnd("velmedia");
    console.time();
    const numOfMoleculesPerWorker = Math.ceil(molecules.length / workers.length); 
    for(let i = 0; i< workers.length; i++){
        workers[i].postMessage({
            msg:"draw", 
            molecules: moleculeByWorker[i],
        })
    }
    console.timeEnd();
    window.requestAnimationFrame(drawLoop)
};

const startWorkers = () =>{
    const thisWorkers = [];
    for(let i = 0; i < Math.floor(navigator.hardwareConcurrency * 0.75); i++){
        thisWorkers.push(new Worker("./canvasWorker.js", {type: "module"}))
        const canvas = document.createElement("canvas")
        document.body.append(canvas);
        const offscreen = canvas.transferControlToOffscreen();
        thisWorkers[i].postMessage({
            canvas: offscreen,
            id: i, 
            msg: "start"
        }, [offscreen]);
        thisWorkers[i].addEventListener("message", (event) => workerListener(event, i))
    }
    return thisWorkers;
}

workers = startWorkers();
resizeCanvas();
const physicsWorker = new Worker("./physicsWorker.js", {type: "module"});
window.addEventListener("resize", ()=>{
    physicsWorker.postMessage({msg:"resize", data:{w:innerWidth, h:innerHeight}});
    resizeCanvas()
});
physicsWorker.postMessage({msg:"start", data:{w:innerWidth, h:innerHeight}});
physicsWorker.addEventListener("message", (e) =>{
    const {msg, data} = e.data;
    if(msg === "molecules"){
        const molecules = data;
        const numOfMoleculesPerWorker = Math.ceil(molecules.length / workers.length); 
        for(let i = 0; i< workers.length; i++){
            moleculeByWorker[i] = groupByFillStyle(molecules.splice(0, numOfMoleculesPerWorker))
        }
    } 
    else if (msg === "fps") phFPS = data;
});
drawLoop(true);

window.addEventListener("click", (event)=>{
    const {clientX, clientY} = event;
    physicsWorker.postMessage({msg:"select", data:{clientX, clientY, dataContainer}},[dataContainer]);
})



moleculesNum.addEventListener("change", (e) =>{
    physicsWorker.postMessage({msg:"number", data:parseInt(e.target.value)});
})

moleculesR.addEventListener("change", (e) =>{
    physicsWorker.postMessage({msg:"radius", data:parseInt(e.target.value)});
})