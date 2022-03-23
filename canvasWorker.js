import { drawMolecule } from "./drawer.js";
import { calculateFPScreator } from "./helper.js";

let cv, fps = calculateFPScreator(10), molecules2Draw, physicsFPS;
/**
 * @type {CanvasRenderingContext2D}
*/
let ctx;

const draw = () =>{
    console.time("initial")
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.font = "15px Arial";
    ctx.strokeStyle = 'rgb(0,128,128)';
    const fillStyles = new Map();
    molecules2Draw.forEach((molecule) =>{
        fillStyles.set(molecule.fillStyle, [...(fillStyles.get(molecule.fillStyle) ?? []), molecule])
    })
    console.timeEnd("initial")
    console.time("render")
    fillStyles.forEach((value, idx)=>{
        ctx.fillStyle = idx;
        value.forEach((molecule) => drawMolecule(molecule, ctx))
    })
    console.timeEnd("render")
    console.time("text")
    ctx.fillStyle = "black";
    ctx.fillText(fps(), cv.width - 26, 20);
    ctx.fillText(physicsFPS, cv.width - 26, 40);
    console.timeEnd("text")
    requestAnimationFrame(draw)
}

const messageListener = (event) => {
    const {canvas, msg, molecules, h, w, phFPS, first} = event.data;
    if(msg === "start"){
        cv = canvas;
        ctx = canvas.getContext("2d");
    }
    if(msg === "draw"){
        molecules2Draw = molecules;
        physicsFPS = phFPS;
        if(first) draw();
    }
    if(msg === "update"){
        cv.height = h;
        cv.width = w;
    }
}

addEventListener("message", messageListener);