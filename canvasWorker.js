import { drawMolecule } from "./drawer.js";
import { updateMoleculePosition } from "./physics.js";
import { checkWallCollisions } from "./physics.js";

const startAnimation = (canvas, ctx) =>{
    const molecules = Array(100).fill({r:15, velX:1, velY:1}).map(updateMoleculePosition)
    .map(molecule => checkWallCollisions(molecule, { minX: 0, minY: 0, maxX:canvas.width, maxY:canvas.height}))
    molecules.forEach(molecule => drawMolecule(molecule, ctx));
    console.log("hola")
}

const messageListener = (event) => {
    const {canvas} = event.data;
    console.log(canvas)
    if(canvas){
        /**
         * @type {CanvasRenderingContext2D}
         */
        const ctx = canvas.getContext("2d");
        console.log("hola")
        startAnimation(canvas, ctx);
    }
}
console.log("worker")

addEventListener("message", messageListener);