import type { Servo } from "$lib/types";
import { deg2rad } from "./utils";
import { Vec2, vec2 } from "./vec2";

export function draw(context: CanvasRenderingContext2D, servos: Servo[], base: Vec2, arm: Vec2[], target: Vec2, width: number, height: number, boundingBox: Vec2[], maxReach: number) {

	context.transform(1, 0, 0, -1, 0, height); // Flip Y so that origo is at lower left corner
	context.clearRect(0, 0, width, height);

	// Right-side view
	drawRightSideArena(context, base, boundingBox, maxReach);
	if (arm.length >= 2) {
		drawRightSideArm(context, base, arm, target);
	}

	// drawDivider(context, width / 2.8, height);

	// Top-down view
	// context.transform(1, 0, 0, 1, width * 1.9 / 2.8, 75);
	// drawTopDownArena(context);
	// if (servos.length >= 3) {
		// drawTopDownArm(context,arm, servos, target, base);
	// }
	//context.transform(1, 0, 0, 1, -width * 1.9 / 2.8, -75);

	context.transform(1, 0, 0, -1, 0, height);
}

/*
TODO fix radians
export function drawTopDownArm(context: CanvasRenderingContext2D, arm: Vec2[], servos: Servo[], target: Vec2, base: Vec2) {
	const hand = new Vec2(0, arm[1].x).rotate(servos[2].radians);
	const elbow = new Vec2(0, arm[0].x).rotate(servos[2].radians);
	const _target = new Vec2(0, target.x).rotate(servos[2].radians);

	drawCircle(context, new Vec2(0, 0), 6, "black");
	drawCircle(context, hand, Math.min(Math.max(6 * ((arm[1].y + base.y) / 100), 4), 12), "#000099");
	drawLine(context, elbow, hand, "#000099", 4);
	drawCircle(context, elbow, Math.min(Math.max(6 * ((arm[0].y + base.y) / 100), 4), 12), "#009900");
	drawLine(context, new Vec2(0, 0), elbow, "#009900", 4);
	drawCircle(context, _target, 2, "#ff5500");
	context.beginPath()
}
*/

/*
function PWMToRadians(pwm: number, range: number, midpoint: number) {
	return (pwm / 255.0 * range) - range / 2 + midpoint;
}
*/

export function drawTopDownArena(context: CanvasRenderingContext2D) {
	drawTorus(context, new Vec2(0, 0), 200, 400, 120, 160, "#977");
	drawTorus(context, new Vec2(0, 0), 200, 400, 60, 120, "#797");
	drawTorus(context, new Vec2(0, 0), 200, 400, 20, 60, "#779");
	drawCircle(context, new Vec2(0, 300), 75, "#ff893a");
	context.lineWidth = 1;
	context.stroke();
	drawRect(context, -75, -75, 150, 150, "#666");
}

export function drawDivider(context: CanvasRenderingContext2D, x: number, height: number) {
	context.strokeStyle = "black";
	context.lineWidth = 1;
	context.beginPath();
	context.moveTo(x, 0);
	context.lineTo(x, height);
	context.stroke();
}

export function drawTorus(context: CanvasRenderingContext2D, pos: Vec2, innerRadius: number, outerRadius: number, start: number, end: number, color: string) {
	context.beginPath();
	context.fillStyle = color;
	context.strokeStyle = "#000";
	context.lineWidth = 2;
	context.arc(0, 0, outerRadius, deg2rad(start), deg2rad(end));
	context.arc(0, 0, innerRadius, deg2rad(end), deg2rad(start), true);
	context.arc(0, 0, outerRadius, deg2rad(start), deg2rad(end));
	context.fill();
	context.stroke();
}

export function drawRightSideArena(context: CanvasRenderingContext2D, base: Vec2, boundingBox: Vec2[], armLength: number) {
	// Mounting point
	drawRect(context, -150 / 2, 0, 150, 2, "#666");

	// Tower
	drawRectOutline(context, 300 - (60 / 2), 0, 60, 60);
	drawRectOutline(context, 300 - (50 / 2), 60, 50, 50);
	drawRectOutline(context, 300 - (40 / 2), 60 + 50, 40, 40);
	drawRectOutline(context, 300 - (30 / 2), 60 + 50 + 40, 30, 30);
	drawRectOutline(context, 300 - (20 / 2), 60 + 50 + 40 + 30, 20, 20);

	// Zone
	drawRect(context, 200, 0, 200, 2, "black");

	// Bounding Box
	drawRectOutline(context,
		boundingBox[0].x,
		boundingBox[0].y,
		boundingBox[1].x - boundingBox[0].x,
		boundingBox[1].y - boundingBox[0].y,
		"orange"
	);
	
	// Range
	drawCircleOutline(context, vec2(0, 0).add(base), armLength, "#555500", 2);
}

export function drawRightSideArm(context: CanvasRenderingContext2D, base: Vec2, arm: Vec2[], target: Vec2) {
	drawLine(context, base, base.add(arm[0]), "#005500", 4);
	drawLine(context, base.add(arm[0]), base.add(arm[1]), "#000088", 4);

	drawCircle(context, base, 6, "black");
	drawCircle(context, arm[0].add(base), 6, "#009900");
	drawCircle(context, arm[1].add(base), 6, "#000099");
	drawCircle(context, target.add(base), 2, "#ff5500");

	const vectorToTarget = distanceVector(arm[1], target);

	drawVector(context, base.add(arm[1]), base.add(arm[1]).add(vectorToTarget), "orange");
}

export function drawLine(context: CanvasRenderingContext2D, start: Vec2, end: Vec2, color: string, thickness: number) {
	context.beginPath();
	context.lineWidth = thickness;
	context.strokeStyle = color;
	context.moveTo(start.x, start.y);
	context.lineTo(end.x, end.y);
	context.stroke();
	context.lineWidth = 1;
}


export function drawRect(context: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
	context.beginPath();
	context.rect(x, y, w, h);
	context.fillStyle = color;
	context.fill();
}

export function drawRectOutline(context: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color = "#666", width = 2) {
	context.beginPath();
	context.rect(x, y, w, h);
	context.strokeStyle = color;
	context.lineWidth = width;
	context.stroke();
}

export function drawCircle(context: CanvasRenderingContext2D, pos: Vec2, radius: number, color: string) {
	context.moveTo(pos.x, pos.y);
	context.beginPath();
	context.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
	context.fillStyle = color;
	context.fill();
}

export function drawCircleOutline(context: CanvasRenderingContext2D, pos: Vec2, radius: number, color: string, width: number) {
	context.moveTo(pos.x, pos.y);
	context.beginPath();
	context.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
	context.strokeStyle = color;
	context.lineWidth = width;
	context.stroke();
}

export function drawVector(context: CanvasRenderingContext2D, start: Vec2, vector: Vec2, color: string) {
	context.beginPath();
	context.strokeStyle = color;
	context.moveTo(start.x, start.y);
	context.lineTo(vector.x, vector.y);
	context.arc(vector.x, vector.y, 5, 0, Math.PI * 2);
	context.stroke();
}

export function distanceVector(origin: Vec2, target: Vec2) {
	return new Vec2(target.x - origin.x, target.y - origin.y);
}