// -------------------------------------------------------
//  Utility functions — import what you need into runner.js
//  or directly into an activity.
//
//  Usage in runner.js:
//    import { drawAxes } from "./utils.js";
//    // then call drawAxes() inside draw()
// -------------------------------------------------------


// drawAxes()
// Draws the three world axes as coloured arrows at the origin.
//   Red   = X (right)
//   Green = Y (down in p5 WEBGL — worth pointing out to students!)
//   Blue  = Z (toward the viewer)
//
// Parameters:
//   length  — how long each arrow is (default 200)
//   radius  — thickness of the shaft (default 3)

let font;

export function preload() {
  font = loadFont("https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf");
}

export function drawAxes(alpha = 255) {
  let length = 200;
  let radius = 3;
  const headLength = length * 0.15;
  const headRadius = radius * 3;
  const shaftLength = length - headLength;

  noStroke();

  // -- X axis (red) --
  push();
    fill(220, 50, 50, alpha);
    rotateZ(-90);
    translate(0, shaftLength / 2, 0);
    cylinder(radius, shaftLength);
    translate(0, shaftLength / 2 + headLength / 2, 0);
    cone(headRadius, headLength);
  pop();

  // -- Y axis (green) --
  push();
    fill(50, 200, 50, alpha);
    translate(0, shaftLength / 2, 0);
    cylinder(radius, shaftLength);
    translate(0, shaftLength / 2 + headLength / 2, 0);
    cone(headRadius, headLength);
  pop();

  // -- Z axis (blue) --
  push();
    fill(50, 100, 220, alpha);
    rotateX(90);
    translate(0, shaftLength / 2, 0);
    cylinder(radius, shaftLength);
    translate(0, shaftLength / 2 + headLength / 2, 0);                       // flip cone to point in +Z
    cone(headRadius, headLength);
  pop();

  // -- Labels --
  if ( font ){
  const labelOffset = length + 20;
  textFont(font);

  push();
    fill(220, 50, 50, alpha);
    axisLabel("X", labelOffset, 0, 0);
  pop();

  push();
    fill(50, 200, 50, alpha);
    axisLabel("Y", 0, labelOffset, 0);
  pop();

  push();
    fill(50, 100, 220, alpha);
    axisLabel("Z", 0, 0, labelOffset);
  pop();
  }
}


// Helper — draws a text label at a given world position
function axisLabel(label, x, y, z) {
  push();
    translate(x, y, z);
    noStroke();
    textSize(24);
    textAlign(CENTER, CENTER);
    text(label, 0, 0);
  pop();
}