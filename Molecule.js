import { randomBetween } from "./helper.js";
import { Vector } from "./Vector.js";
const DEFAULT_DURATION = 100; 

export class Molecule{
    #selected
    #collisioned
    constructor(r, minMax){
        const {minX, minY, minVelX, minVelY, maxX, maxY, maxVelX, maxVelY} = minMax;
        this.r = r;
        this.setPos(new Vector(randomBetween(minX + r, maxX - r), randomBetween(minY + r, maxY - r)))
        this.setVel(new Vector(randomBetween(minVelX, maxVelX), randomBetween(minVelY, maxVelY)));
        this.setFillStyle("black");
        this.fillDuration = 0;
        this.lastTime = performance.now();
    }

    updatePosition(){
        const now = performance.now();
        const dt = now - this.lastTime;
        this.lastTime = now;
        this.setPos(Vector.add(this.pos, Vector.mult(this.vel, dt)));
        this.setFillStyle(this.fillDuration < 1 ? "black" : this.fillStyle);
        this.collisioned = false;
    }

    checkWallCollisions(minMax){
        const {pos, r, vel} = this;
        const {x, y} = pos;
        const {x:velX, y:velY} = vel;
        const {minX, minY, maxX, maxY} = minMax;
        this.setPos(new Vector(Math.min(Math.max(x, minX + r), maxX - r),
                               Math.min(Math.max(y, minY + r), maxY - r)));
        
        this.fillDuration = Math.max(0, this.fillDuration - 1);
        if(x - minX - r < 0) this.setVel(Vector.reflect(this.vel, new Vector(1, 0)));
        if(maxX - r - x < 0) this.setVel(Vector.reflect(this.vel, new Vector(-1, 0)));
        if(y - minY - r < 0) this.setVel(Vector.reflect(this.vel, new Vector(0, -1)));
        if(maxY - r - y  < 0) this.setVel(Vector.reflect(this.vel, new Vector(0, 1)));
    }

    hasCollisioned(molecule){
        const {pos, r} = this;
        const {pos:pos2, r:r2} = molecule;
        const dPos = Vector.sub(pos, pos2);
        const distance = dPos.squaredModule();
        return distance <=  (r + r2) * (r + r2);
    }

    checkCollision(molecule){
        if(!this.hasCollisioned(molecule)) return false;

        const {pos, vel, r} = this;
        const {pos:pos2, vel:vel2, r:r2} = molecule;
        const distance = (r + r2) * 1.01;
        const dPos = Vector.sub(pos, pos2);
        const angle = dPos.angle();
        const newDPos = Vector.createWithAngle(angle, distance);
        if(Math.random() < 0.25){
            this.setPos(Vector.add(pos2, newDPos));
        }else{
            molecule.setPos(Vector.sub(pos, newDPos));
        }
        
        /* this.setVel(vel2);
        molecule.setVel(vel); */
        const cOfMass = Vector.mult(Vector.add(this.vel, molecule.vel), 0.5);
        const normal1 = Vector.sub(molecule.pos, this.pos).normalize();
        const normal2 = Vector.sub(this.pos, molecule.pos).normalize();

        this.changeVelocityAfterCol(cOfMass, normal);
        molecule.changeVelocityAfterCol(cOfMass, normal2)

        this.collisioned = true;
        molecule.collisioned = true;
        return true;
    }

    changeVelocityAfterCol(cOfMass, normal){
        this.vel.sub(cOfMass);
        this.setVel(Vector.reflect(this.vel, normal));
        this.vel.add(cOfMass);
    }

    showInfo(div){
        div.innerHTML = `
        <strong>r</strong><span>${this.r}</span>
        <strong>x</strong><span>${Math.round(this.pos.x)}</span>
        <strong>y</strong><span>${Math.round(this.pos.y)}</span>
        <strong>vel. x</strong><span>${Math.round(this.vel.x * 100) * 0.01}</span>
        <strong>vel. y</strong><span>${Math.round(this.vel.y * 100) * 0.01}</span>
        <strong>min. x</strong><span>${Math.round(this.minX)}</span>
        <strong>max. x</strong><span>${Math.round(this.maxX)}</span>
        <strong>collisioned</strong><span>${this.collisioned}</span>
        <strong>fill style</strong><span>${this.fillStyle}</span>
        <strong>selected</strong><span>${this.selected}</span>
        <strong>style time</strong><span>${this.fillDuration}</span>
        `
        //<strong>last update</strong><span>${Math.round((this.lastTime) * 100) * 0.01}</span>
    }

    getLineOfDirection(){
        const {pos, r, vel} = this;
        const angle = vel.angle();
        const dist = Vector.createWithAngle(angle, 1.5 * r);
        const end = Vector.add(pos, dist);
        return {endX: end.x, endY: end.y};
    }

    getDataToSend(){
        const {pos, r} = this;
        const {endX, endY} = this.getLineOfDirection();
        return {x:Math.round(pos.x), y:Math.round(pos.y), r:Math.round(r), endX, endY}
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

    setPos(val){
        this.pos = val;
        const {x} = val;
        this.minX = x - this.r;
        this.maxX = x + this.r;
    }
    
    setVel(val){
        this.vel = val;
    }

    setFillStyle(style){
        if(this.selected) return;
        this.fillStyle = style;
        if(style !== "black") this.fillDuration = DEFAULT_DURATION;
    }
}