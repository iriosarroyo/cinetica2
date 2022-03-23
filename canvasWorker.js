import { drawMolecule } from "./drawer.js";
import { calculateFPScreator } from "./helper.js";

let cv, fps = calculateFPScreator(10), moleculesByStyle, physicsFPS;
/**
 * @type {CanvasRenderingContext2D}
*/
let ctx;

const draw = () =>{
    console.time("reset")
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.font = "15px Arial";
    ctx.strokeStyle = 'rgb(0,128,128)';
    console.timeEnd("reset")
    console.time("initial")
    
    console.timeEnd("initial")
    console.time("render")
    Object.entries(moleculesByStyle).forEach(([key, value])=>{
        ctx.fillStyle = key;
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
        moleculesByStyle = molecules;
        physicsFPS = phFPS;
        if(first) draw();
    }
    if(msg === "update"){
        cv.height = h;
        cv.width = w;
    }
}

addEventListener("message", messageListener);