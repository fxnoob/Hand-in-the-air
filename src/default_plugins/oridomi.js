import * as OriDomi from "oridomi";

const name = "Oridomi";

let folded;

const exec = gesture => {
  if (!folded)
    folded = new OriDomi("body", {
      vPanels: 5, // number of panels when folding left or right (vertically oriented)
      hPanels: 3, // number of panels when folding top or bottom
      speed: 1200, // folding duration in ms
      ripple: 2, // backwards ripple effect when animating
      shadingIntensity: 0.5, // lessen the shading effect
      perspective: 800, // smaller values exaggerate 3D distortion
      maxAngle: 40, // keep the user's folds within a range of -40 to 40 degrees
      shading: "soft" // change the shading type
    });
  if (gesture.direction === "Left") folded.foldUp();
  else if (gesture.direction === "Right") folded.reveal(0);
  console.log(gesture.direction);
};

export default {
  name,
  exec
};
