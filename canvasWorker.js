import { drawMolecule } from "./drawer.js";

let cv, ctx;
const messageListener = (event) => {
    const {canvas, msg, molecules, h, w} = event.data;
    console.log(event.data)
    if(msg === "start"){
        cv = canvas;
        ctx = canvas.getContext("2d");
    }
    if(msg === "draw"){
        console.log(molecules)
        //molecules.forEach(molecule => drawMolecule(molecule, ctx));
    }
    if(msg === "update"){
        cv.height = h;
        cv.width = w;
    }
}
console.log("worker");
addEventListener("message", messageListener);