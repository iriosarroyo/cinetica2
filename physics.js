export const updateMoleculePosition = (molecule, minMax) => {
    const {x, y, velX, velY} = molecule;
    const {minX, minY, maxX, maxY} = minMax;
    return {
       ...molecule,
        x: x + velX,
        y: y + velY
    }
}