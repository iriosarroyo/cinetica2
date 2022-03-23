import { drawMolecule } from "./drawer.js";

let cv, ctx;
const messageListener = (event) => {
    const {canvas, msg, molecules, h, w} = event.data;
    if(msg === "start"){
        cv = canvas;
        ctx = canvas.getContext("2d");
    }
    if(msg === "draw"){
        ctx.clearRect(0, 0, cv.width, cv.height);
        const fillStyles = new Map();
        molecules.forEach((molecule) =>{
            fillStyles.set(molecule.fillStyle, [...(fillStyles.get(molecule.fillStyle) ?? []), molecule])
        })
        fillStyles.forEach((value, idx)=>{
            ctx.fillStyle = idx;
            value.forEach((molecule) => drawMolecule(molecule, ctx))
        })
    }
    if(msg === "update"){
        cv.height = h;
        cv.width = w;
    }
}
addEventListener("message", messageListener);