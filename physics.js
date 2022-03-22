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
        velY: velY === y ? velY : -velY,
    }
}