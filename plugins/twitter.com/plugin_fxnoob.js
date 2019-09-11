if (!gesture.error) {
  var scrollTop = window.pageYOffset || document.documentElement.scrollTo;
  if (gesture.direction === "Long up") {
    window.scrollTo({
      'behavior': 'smooth',
      'left': 0,
      'top': scrollTop+350
    });
  } else if (gesture.direction === "Long down") {
    window.scrollTo({
      'behavior': 'smooth',
      'left': 0,
      'top': scrollTop-350
    });
  }
}
