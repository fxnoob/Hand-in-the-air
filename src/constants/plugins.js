const plugins = {
  "play2048.co": {
    codeString:
      '"use strict";\n\nif (!gesture.error) {\n  var evt;\n\n  if (gesture.direction === "Long up") {\n    evt = new KeyboardEvent(\'keydown\', {\n      altKey: false,\n      bubbles: true,\n      cancelBubble: false,\n      cancelable: true,\n      charCode: 0,\n      code: "Enter",\n      composed: true,\n      ctrlKey: false,\n      currentTarget: null,\n      defaultPrevented: true,\n      detail: 0,\n      eventPhase: 0,\n      isComposing: false,\n      isTrusted: true,\n      keyCode: 38,\n      location: 0,\n      metaKey: false,\n      repeat: false,\n      returnValue: false,\n      shiftKey: false,\n      type: "keydown",\n      which: 38\n    });\n  } else if (gesture.direction === "Long down") {\n    evt = new KeyboardEvent(\'keydown\', {\n      altKey: false,\n      bubbles: true,\n      cancelBubble: false,\n      cancelable: true,\n      charCode: 0,\n      code: "Enter",\n      composed: true,\n      ctrlKey: false,\n      currentTarget: null,\n      defaultPrevented: true,\n      detail: 0,\n      eventPhase: 0,\n      isComposing: false,\n      isTrusted: true,\n      keyCode: 40,\n      location: 0,\n      metaKey: false,\n      repeat: false,\n      returnValue: false,\n      shiftKey: false,\n      type: "keydown",\n      which: 40\n    });\n  } else if (gesture.direction === "Left") {\n    evt = new KeyboardEvent(\'keydown\', {\n      altKey: false,\n      bubbles: true,\n      cancelBubble: false,\n      cancelable: true,\n      charCode: 0,\n      code: "Enter",\n      composed: true,\n      ctrlKey: false,\n      currentTarget: null,\n      defaultPrevented: true,\n      detail: 0,\n      eventPhase: 0,\n      isComposing: false,\n      isTrusted: true,\n      keyCode: 37,\n      location: 0,\n      metaKey: false,\n      repeat: false,\n      returnValue: false,\n      shiftKey: false,\n      type: "keydown",\n      which: 37\n    });\n  } else if (gesture.direction === "Right") {\n    evt = new KeyboardEvent(\'keydown\', {\n      altKey: false,\n      bubbles: true,\n      cancelBubble: false,\n      cancelable: true,\n      charCode: 0,\n      code: "Enter",\n      composed: true,\n      ctrlKey: false,\n      currentTarget: null,\n      defaultPrevented: true,\n      detail: 0,\n      eventPhase: 0,\n      isComposing: false,\n      isTrusted: true,\n      keyCode: 39,\n      location: 0,\n      metaKey: false,\n      repeat: false,\n      returnValue: false,\n      shiftKey: false,\n      type: "keydown",\n      which: 39\n    });\n  }\n\n  if (evt) {\n    document.body.dispatchEvent(evt);\n  }\n}',
    created: 1568466427168,
    isActive: 1
  },
  "tinder.com": {
    codeString:
      '"use strict";\n\nif (!gesture.error) {\n  var el = null;\n\n  if (gesture.direction === "Left") {\n    el = document.querySelector(\'[aria-label="Nope"]\');\n    el.click();\n  } else if (gesture.direction === "Right") {\n    el = document.querySelector(\'[aria-label="Like"]\');\n    el.click();\n  }\n}',
    created: 1568475367804,
    isActive: 1
  },
  "youtube.com": {
    codeString:
      '"use strict";\n\n/* * * url: https://youtube.com * uses: * 1. wave hand right to left for going back to last url * 2. wave hand left to right for playing next video from suggestion. * * */\nif (!gesture.error) {\n  if (gesture.direction === "Left") {\n    window.history.back();\n  } else if (gesture.direction === "Right") {\n    document.querySelector("#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > a.ytp-next-button.ytp-button").click();\n  }\n}',
    created: 1568475352636,
    isActive: 1
  }
};

export default plugins;
