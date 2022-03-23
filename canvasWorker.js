import { drawMolecule } from "./drawer.js";

const startAnimation = (canvas, ctx) =>{
    const molecules = Array(100).fill({r:15, velX:1, velY:1}).map(updateMoleculePosition)
    .map(molecule => checkWallCollisions(molecule, { minX: 0, minY: 0, maxX:canvas.width, maxY:canvas.height}))
    molecules.forEach(molecule => drawMolecule(molecule, ctx));
    console.log("hola")
}

const cv, ctx;
const messageListener = (event) => {
    const {canvas, msg, molecules, h, w} = event.data;
    if(msg === "start"){
        cv = canvas;
        ctx = canvas.getContext("2d");
    }
    if(msg === "draw"){
        molecules.forEach(molecules => drawMolecule(molecule, ctx));
    }
    if(msg === "update"){
        cv.height = h;
        cv.width = w;
    }
}

addEventListener("message", messageListener);