import { Molecule } from "./Molecule.js";
import { calculateFPScreator } from "./helper.js";
const fps = calculateFPScreator(1000);

let r = 2, molecules = [], selectedMolecule, phFPS, div, w, h;

const startMolecules = (number) =>{
    molecules = Array(number)
        .fill(null)
        .map(() => new Molecule(r, { minX: 0, minY: 0, maxX:w, maxY:h, minVelX: -0.3, minVelY: -0.3, maxVelX: 0.3, maxVelY: 0.3}))

    molecules.forEach(molecule => molecule.checkWallCollisions({ minX: 0, minY: 0, maxX:w, maxY:h}));
}

const allCollisionCheck = (molecules) =>{
    molecules.sort((a,b) => a.minX - b.minX);
    for(let i = 0; i < molecules.length; i++){
        let offset = 1;
        while(molecules[i + offset] && molecules[i].maxX >= molecules[i + offset].minX){
            molecules[i].checkCollision(molecules[i + offset]);
            offset++;
        }
        molecules[i].checkWallCollisions({minX: 0, minY:0, maxX:w, maxY:h})
    }
}

const physicsLoop = () =>{
    for(let i = 0; i < molecules.length; i++) molecules[i].updatePosition();
    allCollisionCheck(molecules);
    //phFPS = fps();
    //postMessage({msg:"fps", data:phFPS })
    const infoToSend = []
    for(let i = 0; i < molecules.length; i++) infoToSend.push(molecules[i].getDataToSend());
    if(selectedMolecule){ postMessage({msg:"molecules", data:{molecules: infoToSend, selected:selectedMolecule.getHTMLInfo()} }) }   
    else postMessage({msg:"molecules", data:{molecules: infoToSend, selected:undefined} })
    requestAnimationFrame(physicsLoop);
};



addEventListener("message", (event)=>{
    const {msg, data} = event.data;
    if(msg === "start"){
        w = data.w;
        h = data.h;
        startMolecules(1000);
        physicsLoop();
        //setInterval(physicsLoop);
    }else if(msg === "select"){
        const {clientX, clientY, dataContainer} = data;
        div = dataContainer;
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
    }else if(msg === "number"){
        startMolecules(data);
    }else if(msg === "radius"){
        r = data;
        startMolecules(molecules.length)
    }else if(msg === "resize"){
        w = data.w;
        h = data.h;
    }
})
