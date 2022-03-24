export const calculateFPScreator = (maxSize) =>{
    let lastTime = performance.now();
    let fpsHistory = [];
    let count = 0;
    return () => {
        const now = performance.now();
        const nextFps = Math.round(1000/(now - lastTime));
        if(fpsHistory.length >= maxSize) fpsHistory.pop();
        fpsHistory.unshift(nextFps);
        lastTime = now;
        const averageFPS = Math.round(fpsHistory.reduce((acum, val) => acum + val) / fpsHistory.length);
        if(maxSize === 10) postMessage({fps: fpsHistory.toString(), nextFps, averageFPS, time: Math.round(now - lastTime)});
        return averageFPS;
    }
}

export const randomBetween = (min, max) =>{
    return Math.random() * (max - min) + min
}