$(document.body).append("<div id='troll'>");

function checkTroll() {
  let angrySlide = $(".present").has(".angry").length === 2;
  $(document.body)[angrySlide ? "addClass" : "removeClass"]("troll");
}

window.addEventListener("hashchange", checkTroll);

$(checkTroll);
