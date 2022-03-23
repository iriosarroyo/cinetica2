export const updateMoleculePosition = (molecule) => {
    const {x = 0, y = 0, velX, velY, r} = molecule;
    return {
       ...molecule,
        x: x + velX,
        y: y + velY,
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
        
    }
}