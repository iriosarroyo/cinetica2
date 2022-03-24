import { drawMolecule } from "./drawer.js";
import { endTimer } from "./helper.js";
import { startTimer } from "./helper.js";
import { calculateFPScreator } from "./helper.js";

let cv, fps = calculateFPScreator(10, true), moleculesByStyle, physicsFPS;
/**
 * @type {CanvasRenderingContext2D}
*/
let ctx, counter = 0;

const draw = () =>{
    const send = counter % 6 === 0;
    send && startTimer("restart");
    console.time("restart");
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.strokeStyle = 'rgb(0,128,128)';
    endTimer("restart", send);
    send && console.timeEnd("restart");

    startTimer("render");
    send && console.time("render");
    for(let i = 0; i< moleculesByStyle.length; i++){
        const [fillStyle, moleculesInGroup] = moleculesByStyle[i];
        ctx.fillStyle = fillStyle;
        for(let j = 0; j<moleculesInGroup.length; j++) drawMolecule(moleculesInGroup[j], ctx);
    }
    endTimer("render", send);
    send && console.timeEnd("render");

    startTimer("fps");
    send && console.time("fps");
    fps();
    endTimer("fps", send);
    send && console.timeEnd("fps");
    
    startTimer("request");
    send && console.time("request");
    requestAnimationFrame(draw)
    endTimer("request", send);
    send && console.timeEnd("request");
    counter++;
}

const messageListener = (event) => {
    const {canvas, msg, molecules, h, w, first} = event.data;
    if(msg === "start"){
        cv = canvas;
        ctx = canvas.getContext("2d", {alfa:0});
    }
    if(msg === "draw"){
        moleculesByStyle = molecules;
        //physicsFPS = phFPS;
        if(first) draw();
    }
    if(msg === "update"){
        cv.height = h;
        cv.width = w;
    }
}

addEventListener("message", messageListener);