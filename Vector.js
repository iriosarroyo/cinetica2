export class Vector{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    angle(){
        const angle = Math.atan(this.y/this.x);
        return this.x < 0 ? angle + Math.PI : angle;
    }

    add(vector){
        const {x, y} = vector;
        this.x += x;
        this.y += y;
        return this;
    }

    sub(vector){
        const {x, y} = vector;
        this.x -= x;
        this.y -= y;
        return this;
    }

    squaredModule(){
        return this.x * this.x + this.y * this.y;
    }

    module(){
        return Math.sqrt(this.squaredModule());
    }

    normalize(){
        const module = this.module();
        this.x /= module;
        this.y /= module;
        return this;
    }

    static add(vector1, vector2){
        const {x, y} = vector1;
        const {x:x2, y: y2} = vector2;
        return new Vector(x + x2, y + y2);
    }

    static sub(vector1, vector2){
        const {x, y} = vector1;
        const {x:x2, y: y2} = vector2;
        return new Vector(x - x2, y - y2);
    }

    static mult(vector, cte){
        const {x, y} = vector;
        return new Vector(x * cte, y * cte);
    }

    static dot(vector1, vector2){
        const {x, y} = vector1;
        const {x:x2, y: y2} = vector2;
        return x * x2 + y * y2;
    }

    static reflect(vector, normal){
        const dot = Vector.dot(vector, normal);
        const {x, y} = vector;
        const {x:nx, y: ny} = normal;
        return new Vector(x - 2 * dot * nx, y - 2 * dot * ny)
    }

    static createWithAngle(angle, module = 1){
        return new Vector(module * Math.cos(angle), module * Math.sin(angle));
    }
    
}