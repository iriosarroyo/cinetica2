const offscreen = document.querySelector("canvas.playground").transferControlToOffscreen();
const worker = new Worker("canvasWorker.js");
worker.postMessage({canvas: offscreen}, [offscreen]);