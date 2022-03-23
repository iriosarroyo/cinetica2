import { randomBetween } from "./helper";
const DEFAULT_DURATION = 300; 

class Molecule{
    #fillStyle
    #x
    constructor(r, minMax){
        const {minX, minY, minVelX, minVelY, maxX, maxY, maxVelX, maxVelY} = minMax;
        this.r = r;
        this.x = randomBetween(minX + r, maxX - r);
        this.y = randomBetween(minY + r, maxY - r);
        this.velX = randomBetween(minVelX, maxVelX);
        this.velY = randomBetween(minVelY, maxVelY);
        this.fillStyle = "black";
        this.fillDuration = 0;
        this.lastTime = performance.now();
    }

    updatePosition(){
        const now = performance.now();
        const dt = now - lastTime;
        this.lastTime = now;
        this.x = this.x + this.velX * dt;
        this.y = this.y + this.velY * dt;
        this.fillStyle = this.fillDuration < 1 ? "black" : this.fillStyle;
        this.collisioned = false;
    }

    checkWallCollisions(minMax){
        const {x, y, r, velX, velY, duration} = this;
        const {minX, minY, maxX, maxY} = minMax;
        this.x = Math.min(Math.max(x, minX + r), maxX - r);
        this.y = Math.min(Math.max(y, minY + r), maxY - r);
        
        let finalDuration = duration;
        if(this.x !== x) {
            this.fillStyle = "blue";
            this.velX = -velX;
            finalDuration = DEFAULT_DURATION;
        }
        if(this.y !== y){
            this.fillStyle = "green"
            this.velY = -velY;
            finalDuration = DEFAULT_DURATION;
        };
        this.fillDuration = Math.max(finalDuration, 0);
    }

    hasCollisioned(molecule){
        const {x, y, r} = this;
        const {x:x2, y:y2, r:r2} = molecule;
        const dX = x - x2;
        const dY = y - y2;
        const distance = dX * dX + dY * dY;
        return distance <=  (r + r2) * (r + r2);
    }

    checkCollision(molecule){
        if(this.hasCollisioned(molecule)){
            const {velX, velY, x, y, r} = this;
            const {velX:vX2, velY:vY2, x:x2, y:y2, r:r2} = molecule;
            const distance = (r + r2) * 1.01;
            const dX = Math.abs(x - x2);
            const dY = Math.abs(y - y2);
            const angle = Math.atan(dY/dX);
            const newDX = distance * Math.cos(angle);
            const newDY = distance * Math.sin(angle);
            this.x = x2 < x ? x2 + newDX : x2 - newDX;
            this.y = y2 < y ? y2 + newDY : y2 - newDY;
            
            this.velX = vX2;
            this.velY = vY2;
            molecule.velX = velX;
            molecule.velY = velY;

            this.fillDuration = DEFAULT_DURATION;
            molecule.fillDuration = DEFAULT_DURATION;

            this.fillStyle = "red";
            molecule.fillStyle = "red";

            this.collisioned = true;
            molecule.collisioned = true;
            return true;
        }
        return false;
    }
    set x(val){
        this.#x = val;
        this.minX = this.#x - this.r;
        this.maxX = this.#x + this.r;
    }
    get x(){
        return this.#x
    }
    set fillStyle(style){
        if(this.selected) return this.#fillStyle = "purple";
        this.#fillStyle = style;
    }
    get fillStyle(){
        return this.#fillStyle;
    }
}