import { drawMolecule } from "./drawer.js";
import { calculateFPScreator } from "./helper.js";

let cv, fps = calculateFPScreator(10), moleculesByStyle, physicsFPS;
/**
 * @type {CanvasRenderingContext2D}
*/
let ctx;

const draw = () =>{
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.font = "15px Arial";
    ctx.strokeStyle = 'rgb(0,128,128)';
    // For loop for optimizing
    for(let i = 0; i< moleculesByStyle.length; i++){
        const [fillStyle, moleculesInGroup] = moleculesByStyle[i];
        ctx.fillStyle = fillStyle;
        for(let j = 0; j<moleculesInGroup.length; j++) drawMolecule(moleculesInGroup[j], ctx);
    }
    ctx.fillStyle = "black";
    ctx.fillText(fps(), cv.width - 26, 20);
    ctx.fillText(physicsFPS, cv.width - 26, 40);
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