export const updateMoleculePosition = (molecule) => {
    const {x = Math.random() * 1000, y = Math.random()*600, velX, velY, r} = molecule;
    return {
       ...molecule,
        x: x + velX,
        y: y + velY,
        fillStyle: "black",
    }
}

export const checkWallCollisions = (molecule, minMax) =>{
    const {x, y, r, velX, velY} = molecule;
    const {minX, minY, maxX, maxY} = minMax;
    const newX = Math.min(Math.max(x, minX + r), maxX - r);
    const newY = Math.min(Math.max(y, minY + r), maxY - r);
    return {
        ...molecule,
        x: newX,
        y: newY,
        velX: newX === x ? velX : -velX,
        velY: newY === y ? velY : -velY,
        minX: x - r,
        maxX: x + r
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
        const distance = r + r2;
        const dX = Math.abs(x - x2);
        const dY = Math.abs(y - y2);
        const angle = Math.atan(dY/dX);
        const newDX = distance * Math.cos(angle);
        const newDY = distance * Math.sin(angle);
        const newX = x2 < x ? x - newDX : x + newDX;
        const newY = y2 < y ? y - newDY : y + newDY;
        /* molecule2.x = newX;
        molecule2.y = newY; 
        molecule.velX = vX2;
        molecule.velY = vY2;
        molecule.fillStyle = "red";
        molecule2.fillStyle = "red";
        molecule2.velX = velX;
        molecule2.velY = velY; */
        return [{
            ...molecule,
            velX:vX2,
            velY:vY2,
            fillStyle:"red",
        },{
            ...molecule2,
            velX,
            velY,
            fillStyle:"red",
            x:newX,
            y:newY,
            minX: newX - r2,
            maxX: newX + r2
        }]
    }
    return [molecule, molecule2]
}

export const allCollisionCheck = (molecules) =>{
    /* molecules.sort((a,b) => a.minX - b.minX);
    //const result = [...molecules];
    for(let i = 0; i < molecules.length - 1; i++){
        let offset = 1;
        while(molecules[i + offset] && molecules[i].maxX >= molecules[i + offset].minX){
            const [newMolec1, newMolec2] = checkMoleculesCollision(molecules[i], molecules[i + offset]);
            molecules[i] = newMolec1;
            molecules[i + offset] = newMolec2;
            offset++;
        }
    } */
    molecules.forEach((molecule, idx) =>{
        molecules.forEach((molecule2, idx2)=>{
            const [newMolec1, newMolec2] = checkMoleculesCollision(molecule, molecule2);
            molecules[idx] = newMolec1;
            molecules[idx2] = newMolec2;
        })
    })
    return molecules;
}