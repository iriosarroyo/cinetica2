message = function({canvas}){
    /**
     * @type {CanvasRenderingContext2D}
     */
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.arc(50, 50, 4, 0, 2 * Math.PI);
    ctx.stroke();
}