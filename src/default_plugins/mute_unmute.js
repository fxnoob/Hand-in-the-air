const name = "Sound Mute/Unmute";

class MuteUnmute {
  constructor() {
    this.muted = [];
  }
  muteElement = elem => {
    if (!elem.muted) {
      elem.muted = true;
      elem.pause();
      this.muted.push(elem);
    }
  };
  mutePage = () => {
    const elems = document.querySelectorAll("video, audio");
    [].forEach.call(elems, elem => {
      this.muteElement(elem);
    });
  };
  unmutePage = () => {
    this.muted.map(elem => {
      elem.muted = false;
      elem.play();
    });
    this.muted = [];
  };
}

const mu = new MuteUnmute();

const execHG = gesture => {
  if (gesture.direction === "Left") {
    mu.mutePage();
  } else if (gesture.direction === "Right") {
    mu.unmutePage();
  }
};

const execVR = command => {
  console.log(command);
  if (command === "mute") {
    mu.mutePage();
  } else if (command === "Unmute") {
    mu.unmutePage();
  }
}

export default {
  name,
  exec: {
    execHG,
    execVR
  }
};
