import { drawMolecule } from "./drawer.js";
import { endTimer } from "./helper.js";
import { startTimer } from "./helper.js";
import { calculateFPScreator } from "./helper.js";

let cv, fps = calculateFPScreator(10, true, ID), moleculesByStyle, physicsFPS, ID;
/**
 * @type {CanvasRenderingContext2D}
*/
let ctx, counter = 0;

const draw = () =>{
    const send = counter % 6 === 0;
    startTimer("restart");
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.strokeStyle = 'rgb(0,128,128)';
    endTimer("restart", send, id);

    startTimer("render");
    for(let i = 0; i< moleculesByStyle.length; i++){
        const [fillStyle, moleculesInGroup] = moleculesByStyle[i];
        ctx.fillStyle = fillStyle;
        for(let j = 0; j<moleculesInGroup.length; j++) drawMolecule(moleculesInGroup[j], ctx);
    }
    endTimer("render", send, id);

    startTimer("fps");
    fps();
    endTimer("fps", send, id);
    
    startTimer("request");
    requestAnimationFrame(draw)
    endTimer("request", send, id);
    counter++;
}

const messageListener = (event) => {
    const {canvas, msg, molecules, h, w, first, id} = event.data;
    if(msg === "start"){
        cv = canvas;
        ctx = canvas.getContext("2d");
        ID = id;
    }
    if(msg === "draw"){
        moleculesByStyle = molecules;
        //physicsFPS = phFPS;
        if(first) {
            draw();
            console.log("called draw")
        }
    }
    if(msg === "update"){
        cv.height = h;
        cv.width = w;
    }
}

addEventListener("message", messageListener);