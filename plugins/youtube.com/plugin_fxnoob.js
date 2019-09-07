/*
*
* url: https://youtube.com
* uses:
* 1. wave hand right to left for going back to last url
* 2. wave hand left to right for playing next video from suggestion.
*
* */
if (!gesture.error) {
  if (gesture.direction === "Left") {
    window.history.back();
  } else if (gesture.direction === "Right") {
    document.querySelector("#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > a.ytp-next-button.ytp-button").click();
  }
}
