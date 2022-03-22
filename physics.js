export const updateMolecule = (molecule, minMax) => {
    const {minX, minY, maxX, maxY} = minMax;
    return {
       ...molecule,
        x: Math.random() * maxX,
        y: Math.random() * maxY
    }
}