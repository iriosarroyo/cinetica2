import { drawMolecule } from "./drawer.js";
import { calculateFPScreator } from "./helper.js";

let cv, fps = calculateFPScreator();
/**
 * @type {CanvasRenderingContext2D}
*/
let ctx;
const messageListener = (event) => {
    const {canvas, msg, molecules, h, w} = event.data;
    if(msg === "start"){
        cv = canvas;
        ctx = canvas.getContext("2d");
        ctx.font = "15px Arial";
        ctx.strokeStyle = 'blue';
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
        
        ctx.fillStyle = "black";
        ctx.fillText(fps(), cv.width - 26, 20);
    }
    if(msg === "update"){
        cv.height = h;
        cv.width = w;
    }
}
addEventListener("message", messageListener);