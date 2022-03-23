import { randomBetween } from "./helper.js";

export const updateMoleculePosition = (molecule) => {
    const {
        r,
        x = randomBetween(r, window.innerWidth - r), 
        y = randomBetween(r, window.innerHeight - r), 
        velX = randomBetween(-1, 1), 
        velY = randomBetween(-1, 1), 
        duration = 0, fillStyle = "black", lastTime = performance.now()} = molecule;
    const now = performance.now();
    const dt = now - lastTime;
    return {
       ...molecule,
        x: x + velX * dt,
        y: y + velY * dt,
        fillStyle: duration < 1 ? "black" :  fillStyle,
        lastTime: now,
        collisioned: false,
        minX: x - r,
        maxX: x + r
    }
}

export const checkWallCollisions = (molecule, minMax) =>{
    const {x, y, r, velX, velY, duration} = molecule;
    let thisDuration = 100;
    const {minX, minY, maxX, maxY} = minMax;
    const newX = Math.min(Math.max(x, minX + r), maxX - r);
    const newY = Math.min(Math.max(y, minY + r), maxY - r);
    let fillStyle = molecule.fillStyle;
    if(newX !== x) fillStyle = "blue";
    else if(newY !== y) fillStyle = "green";
    else thisDuration = Math.max(duration - 1, 0);
    return {
        ...molecule,
        x: newX,
        y: newY,
        velX: newX === x ? velX : -velX,
        velY: newY === y ? velY : -velY,
        minX: x - r,
        maxX: x + r,
        fillStyle,
        duration: thisDuration,
    }
}

export const haveMoleculesCollisions = (molecule, molecule2) =>{
    const {x, y, r} = molecule;
    const {x:x2, y:y2, r:r2} = molecule2;
    const dX = x - x2;
    const dY = y - y2;
    const distance = dX * dX + dY * dY;
    return distance <=  (r + r2) * (r + r2);
}

//this functin mutates objects !!!
export const checkMoleculesCollision = (molecule, molecule2) =>{
    if(haveMoleculesCollisions(molecule, molecule2)){
        const {velX, velY, x, y, r} = molecule;
        const {velX:vX2, velY:vY2, x:x2, y:y2, r:r2} = molecule2;
        const distance = (r + r2)*1.01;
        const dX = Math.abs(x - x2);
        const dY = Math.abs(y - y2);
        const angle = Math.atan(dY/dX);
        const newDX = distance * Math.cos(angle);
        const newDY = distance * Math.sin(angle);
        const newX = x2 < x ? x2 + newDX : x2 - newDX;
        const newY = y2 < y ? y2 + newDY : y2 - newDY;
        return [true,{
            ...molecule,
            velX:vX2,
            velY:vY2,
            fillStyle:"red",
            x:newX,
            y:newY,
            minX: newX - r2,
            maxX: newX + r2,
            duration: 100,
            collisioned:true,
        },{
            ...molecule2,
            velX,
            velY,
            fillStyle:"red",
            duration: 100,
            collisioned:true,
        }]
    }
    return [false,molecule, molecule2]
}

export const allCollisionCheck = (molecules) =>{
    molecules.sort((a,b) => a.minX - b.minX);
    //const result = [...molecules];
    for(let i = 0; i < molecules.length; i++){
        let offset = 1;
        while(molecules[i + offset] && molecules[i].maxX >= molecules[i + offset].minX){
            const [hasCollisioned, newMolec1, newMolec2] = checkMoleculesCollision(molecules[i], molecules[i + offset]);
            if(hasCollisioned){
                molecules[i] = newMolec1;
                molecules[i + offset] = newMolec2;
            }
            offset++;
        }
        molecules[i] = checkWallCollisions(molecules[i], {minX: 0, minY:0, maxX:window.innerWidth, maxY:window.innerHeight})
    }
    //
    /* const result = [...molecules];
    molecules.forEach((molecule, idx) =>{
        molecules.forEach((molecule2, idx2)=>{
            if(idx === idx2) return;
            const [hasCollissioned, newMolec1, newMolec2] = checkMoleculesCollision(molecule, molecule2);
            if(hasCollissioned){
                result[idx] = newMolec1;
                result[idx2] = newMolec2;
            }
        })
    }) */
    return molecules;
}