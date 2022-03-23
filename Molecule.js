import { randomBetween } from "./helper.js";
const DEFAULT_DURATION = 300; 

export class Molecule{
    #selected
    #collisioned
    constructor(r, minMax){
        const {minX, minY, minVelX, minVelY, maxX, maxY, maxVelX, maxVelY} = minMax;
        this.r = r;
        this.setX(randomBetween(minX + r, maxX - r));
        this.y = randomBetween(minY + r, maxY - r);
        this.velX = randomBetween(minVelX, maxVelX);
        this.velY = randomBetween(minVelY, maxVelY);
        this.setFillStyle("black");
        this.fillDuration = 0;
        this.lastTime = performance.now();
    }

    updatePosition(){
        const now = performance.now();
        const dt = now - this.lastTime;
        this.lastTime = now;
        this.setX(this.getX() + this.velX * dt);
        this.y = this.y + this.velY * dt;
        this.setFillStyle(this.fillDuration < 1 ? "black" : this.fillStyle);
        this.collisioned = false;
    }

    checkWallCollisions(minMax){
        const {x, y, r, velX, velY} = this;
        const {minX, minY, maxX, maxY} = minMax;
        this.setX(Math.min(Math.max(x, minX + r), maxX - r));
        this.y = Math.min(Math.max(y, minY + r), maxY - r);
        
        this.fillDuration--;
        if(this.getX() !== x) {
            this.setFillStyle("blue"); //Restablish fillDuration
            this.velX = -velX;
        }
        if(this.y !== y){
            this.setFillStyle("green"); //Restablish fillDuration
            this.velY = -velY;
        };
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
        if(!this.hasCollisioned(molecule)) return false;

        const {velX, velY, x, y, r} = this;
        const {velX:vX2, velY:vY2, x:x2, y:y2, r:r2} = molecule;
        const distance = (r + r2) * 1.01;
        const dX = Math.abs(x - x2);
        const dY = Math.abs(y - y2);
        const angle = Math.atan(dY/dX);
        const newDX = distance * Math.cos(angle);
        const newDY = distance * Math.sin(angle);
        this.setX(x2 < x ? x2 + newDX : x2 - newDX);
        this.y = y2 < y ? y2 + newDY : y2 - newDY;
        
        this.velX = vX2;
        this.velY = vY2;
        molecule.velX = velX;
        molecule.velY = velY;

        this.collisioned = true;
        molecule.collisioned = true;
        return true;
    }

    showInfo(div){
        div.innerHTML = `<strong>x</strong><span>${Math.round(this.getX())}</span>
        <strong>y</strong><span>${Math.round(this.y)}</span>
        <strong>vel. x</strong><span>${Math.round(this.velY * 100) * 0.01}</span>
        <strong>vel. y</strong><span>${Math.round(this.velY * 100) * 0.01}</span>
        <strong>min. x</strong><span>${Math.round(this.minX)}</span>
        <strong>max. x</strong><span>${Math.round(this.maxX)}</span>
        <strong>collisioned</strong><span>${this.collisioned}</span>
        <strong>fill style</strong><span>${this.fillStyle}</span>
        <strong>selected</strong><span>${this.selected}</span>
        <strong>last update</strong><span>${Math.round((performance.now()- this.lastTime) * 100) * 0.01}</span>
        <strong>style time</strong><span>${this.fillDuration}</span>
        `
    }

    set selected(val){
        if(!val) return this.#selected = false;
        this.fillStyle = "purple";
        this.#selected = true;
    }

    set collisioned(val){
        if(!val) return this.#collisioned = false;
        this.#collisioned = true;
        this.setFillStyle("red");
    }

    get collisioned(){return this.#collisioned}

    get selected(){
        return this.#selected;
    }

    setX(val){
        this.x = val;
        this.minX = this.x - this.r;
        this.maxX = this.x + this.r;
    }
    getX(){
        return this.x
    }
    setFillStyle(style){
        if(this.selected) return;
        this.fillStyle = style;
        if(style !== "black") this.fillDuration = DEFAULT_DURATION;
    }
}