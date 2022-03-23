export const drawMolecule = (molecule, ctx) =>{
    const {x, y, r} = molecule;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2);
    ctx.stroke();
}