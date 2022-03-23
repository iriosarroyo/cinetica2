export const calculateFPScreator = () =>{
    let lastTime = performance.now();
    let fpsHistory = [];
    return () => {
        const now = performance.now();
        const nextFps = 1000/(now - lastTime);
        fpsHistory = [nextFps, ...fpsHistory.slice(0,10)];
        lastTime = now;
        const averageFPS = Math.round(fpsHistory.reduce((acum, val) => acum + val) / fpsHistory.length);
        return averageFPS;
    }
}