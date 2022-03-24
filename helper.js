export const calculateFPScreator = (maxSize) =>{
    let lastTime = performance.now();
    let fpsHistory = [];
    let count = 0;
    return () => {
        const now = performance.now();
        const nextFps = 1000/(now - lastTime);
        fpsHistory.pop();
        fpsHistory.unshift(Math.round(nextFps));
        lastTime = now;
        const averageFPS = Math.round(fpsHistory.reduce((acum, val) => acum + val) / fpsHistory.length);
        if(maxSize === 10) postMessage({fps: fpsHistory.toString(), nextFps, averageFPS});
        return averageFPS;
    }
}

export const randomBetween = (min, max) =>{
    return Math.random() * (max - min) + min
}