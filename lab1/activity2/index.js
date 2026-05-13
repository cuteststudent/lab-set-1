import * as activity from "../02-lollipop-tree";
export * from "../02-lollipop-tree";
import { drawAxes } from "@/utils/axes.js";
import { drawGrid } from "@/utils/grid.js";
import { drawWithPause } from "@/utils/animatedDraw.js";

export function setup() {
    camera(300, -200, 700);
}

export function draw(t) {
    orbitControl();
    background(30);
    ambientLight(80);
    directionalLight(255, 255, 255, 1, 1, -1);
    drawGrid();
    noStroke();
    drawWithPause(activity.draw);
   // drawAxes();
}

