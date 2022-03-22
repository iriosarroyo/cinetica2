export const updateMoleculePosition = (molecule, minMax) => {
    const {x, y, velX, velY} = molecule;
    return {
       ...molecule,
        x: x + velX,
        y: y + velY
    }
}