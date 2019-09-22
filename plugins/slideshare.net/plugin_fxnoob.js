if (!gesture.error) {
  if (gesture.direction === "Left") {
    document.querySelector("#btnNext").click()
  } else if (gesture.direction === "Right") {
    document.querySelector("#btnPrevious").click()
  }
}

