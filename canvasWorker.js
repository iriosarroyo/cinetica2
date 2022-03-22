console.log("Loaded  canvas worker")
onmessage = function({canvas}){
    /**
     * @type {CanvasRenderingContext2D}
     */
    console.log(canvas)
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.arc(50, 50, 4, 0, 2 * Math.PI);
    ctx.stroke();

}