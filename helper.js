export const calculateFPScreator = (maxSize, send) =>{
    let lastTime = performance.now();
    let fpsHistory = [];
    let count = 0;
    return () => {
        const now = performance.now();
        const nextFps = 1000/(now - lastTime);
        if(fpsHistory.length >= maxSize) fpsHistory.pop();
        fpsHistory.unshift(nextFps);
        lastTime = now;
        const averageFPS = Math.round(fpsHistory.reduce((acum, val) => acum + val) / fpsHistory.length);
        if(send) postMessage({msg:"fps", data:averageFPS});
        return averageFPS;
    }
}

export const randomBetween = (min, max) =>{
    return Math.random() * (max - min) + min
}

const timer = () =>{
    let timers = {};
    const start = (name = "default") =>{
        timers[name] = performance.now();
    }
    const end = (name = "default", send = true) =>{
        const time = Math.round(performance.now() - timers[name] * 1000) / 1000;
        if(send) postMessage({msg:"timer", data: {time, name}});
        return time;
    }
    return [start, end];
}

export const [startTimer, endTimer] = timer();