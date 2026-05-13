/// <reference types="p5/global" />

import { drawAxes } from "../utils/axes";

export function draw() {
    translate(0, -50, 0);
    fill(150, 90, 20);
    cylinder(10, 100);
    translate(0, -90, 0);
    fill(50, 180, 50);
    sphere();

    translate(150,140,0);

    push();

    rotateX(45);
    scale(.5);

    translate(0, -50, 0);
    fill(150, 90, 20);
    cylinder(10, 100);
    translate(0, -90, 0);
    fill(50, 180, 50);
    sphere();

    pop();
}