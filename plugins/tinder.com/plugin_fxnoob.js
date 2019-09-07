if (!gesture.error) {
  var el = null;
  if (gesture.direction === "Left") {
    el = document.querySelector('[aria-label="Nope"]');
    el.click();
  } else if (gesture.direction === "Right") {
    el = document.querySelector('[aria-label="Like"]');
    el.click();
  }
}
