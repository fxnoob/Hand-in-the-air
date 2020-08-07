import jQuery from "jquery";
require("./deps/jquery.throwable");

const name = "Throwable";

let throwable;

const execHG = gesture => {
  if (gesture.direction === "Left") {
    if (!throwable)
      throwable = jQuery("body").throwable({
        containment: [0, 0, 500, 500],
        drag: true,
        gravity: { x: 0, y: 0 },
        impulse: {
          f: 52,
          p: { x: 1, y: 1 }
        },
        shape: "circle",
        autostart: false,
        bounce: 0.5,
        damping: 100,
        areaDetection: [[0, 0, 300, 300]],
        collisionDetection: true
      });
  } else if (gesture.direction === "Right") {
  }
  console.log(gesture.direction, name);
};

const execVR = command => {
  if (command === "throw left") {
    if (!throwable)
      throwable = jQuery("body").throwable({
        containment: [0, 0, 500, 500],
        drag: true,
        gravity: { x: 0, y: 0 },
        impulse: {
          f: 52,
          p: { x: 1, y: 1 }
        },
        shape: "circle",
        autostart: false,
        bounce: 0.5,
        damping: 100,
        areaDetection: [[0, 0, 300, 300]],
        collisionDetection: true
      });
  } else if (command === "throw right") {
  }
  console.log(command, name);
};

export default {
  name,
  exec: {
    execHG,
    execVR
  }
};
