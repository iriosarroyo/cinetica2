export const drawMolecule = (molecule, ctx) =>{
    const {x, y, r, velX, velY} = molecule;
    const angle = Math.atan(Math.abs(velY/velX))
    const distX = 1.5 * r * Math.cos(angle);
    const distY = 1.5 * r * Math.sin(angle);
    const endX = velX < 0 ? x - distX : x + distX;
    const endY = velY < 0 ? y - distY : y + distY;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2);
    //ctx.stroke();
    ctx.fill();
    ctx.moveTo(x, y);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    ctx.closePath();
}