const offscreen = document.querySelector("canvas.playground").transferControlToOffscreen();
const worker = new Worker("canvasWorker.js", {type: "module"});
worker.postMessage({canvas: offscreen}, [offscreen]);