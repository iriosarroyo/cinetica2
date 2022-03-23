export const calculateFPScreator = (maxSize) =>{
    let lastTime = performance.now();
    let fpsHistory = [];
    let count = 0;
    return () => {
        const now = performance.now();
        const nextFps = 1000/(now - lastTime);
        fpsHistory = [nextFps, ...fpsHistory.slice(0, maxSize - 1)];
        lastTime = now;
    
        const averageFPS = Math.round(fpsHistory.reduce((acum, val) => acum + val) / fpsHistory.length);
        return averageFPS;
    }
}

export const randomBetween = (min, max) =>{
    console.log({min,max})
    return Math.random() * (max - min) + min
}