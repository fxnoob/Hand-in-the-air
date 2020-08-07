const name = "Arrow keys";

const exec = direction => {
  if (!gesture.error) {
    var evt;
    if (direction === "Long up") {
      evt = new KeyboardEvent("keydown", {
        altKey: false,
        bubbles: true,
        cancelBubble: false,
        cancelable: true,
        charCode: 0,
        code: "Enter",
        composed: true,
        ctrlKey: false,
        currentTarget: null,
        defaultPrevented: true,
        detail: 0,
        eventPhase: 0,
        isComposing: false,
        isTrusted: true,
        keyCode: 38,
        location: 0,
        metaKey: false,
        repeat: false,
        returnValue: false,
        shiftKey: false,
        type: "keydown",
        which: 38
      });
    } else if (direction === "Long down") {
      evt = new KeyboardEvent("keydown", {
        altKey: false,
        bubbles: true,
        cancelBubble: false,
        cancelable: true,
        charCode: 0,
        code: "Enter",
        composed: true,
        ctrlKey: false,
        currentTarget: null,
        defaultPrevented: true,
        detail: 0,
        eventPhase: 0,
        isComposing: false,
        isTrusted: true,
        keyCode: 40,
        location: 0,
        metaKey: false,
        repeat: false,
        returnValue: false,
        shiftKey: false,
        type: "keydown",
        which: 40
      });
    } else if (direction === "Left") {
      evt = new KeyboardEvent("keydown", {
        altKey: false,
        bubbles: true,
        cancelBubble: false,
        cancelable: true,
        charCode: 0,
        code: "Enter",
        composed: true,
        ctrlKey: false,
        currentTarget: null,
        defaultPrevented: true,
        detail: 0,
        eventPhase: 0,
        isComposing: false,
        isTrusted: true,
        keyCode: 37,
        location: 0,
        metaKey: false,
        repeat: false,
        returnValue: false,
        shiftKey: false,
        type: "keydown",
        which: 37
      });
    } else if (direction === "Right") {
      evt = new KeyboardEvent("keydown", {
        altKey: false,
        bubbles: true,
        cancelBubble: false,
        cancelable: true,
        charCode: 0,
        code: "Enter",
        composed: true,
        ctrlKey: false,
        currentTarget: null,
        defaultPrevented: true,
        detail: 0,
        eventPhase: 0,
        isComposing: false,
        isTrusted: true,
        keyCode: 39,
        location: 0,
        metaKey: false,
        repeat: false,
        returnValue: false,
        shiftKey: false,
        type: "keydown",
        which: 39
      });
    }
    if (evt) {
      document.body.dispatchEvent(evt);
    }
  }
};

const execHG = gesture => {
  exec(gesture.direction);
}

const execVR = command => {
  exec(command);
}

export default {
  name,
  exec: {
    execHG,
    execVR
  }
};
