export function vec2(x: number, y: number) {
    return new Vec2(x, y);
}

export class Vec2 {

    x : number;
    y : number;

    constructor(x : number, y : number) {
        this.x = x;
        this.y = y;
    }

    add(other: Vec2) {
        return vec2(this.x + other.x, this.y + other.y);
    }

    length() {
        return Math.hypot(this.x, this.y);
    }

    scale(factor : number) {
        return vec2(this.x * factor, this.y * factor);
    }

    normalize() {
        return this.scale(1 / this.length());
    }

    resize(length : number) {
        return this.normalize().scale(length);
    }

    invert() {
        return this.scale(-1);
    }

    dot(other : Vec2) {
        return this.x * other.x + this.y * other.y;
    }

    angle() {
        return Math.atan2(this.y, this.x);
    }

    angleTo(other : Vec2) {
        return other.angle() - this.angle();
    }

    rotate(radians : number) {
        return vec2(
            this.x * Math.cos(radians) - this.y * Math.sin(radians),
            this.x * Math.sin(radians) + this.y * Math.cos(radians)
        );
    }
}