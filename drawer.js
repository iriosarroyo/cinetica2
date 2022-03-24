export const drawMolecule = (molecule, ctx) =>{
    const { x, y, r, endX, endY} = molecule;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2);
    ctx.fill();
    ctx.moveTo(x, y);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    ctx.closePath();
}