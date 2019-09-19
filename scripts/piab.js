// ----- Change to thank you

window.addEventListener("hashchange", function() {
  if ($(".present").is("section:last-child > section:last-child")) {
    $("[data-pos='1-0-2'").html(
      "<p>Thank you! :)</p><a href='mailto:david@krawaller.se'>david@krawaller.se</a></p>"
    );
  }
});

// ----- Flag

$(document.body).append("<div id='piab'>");

function checkPiabFlag() {
  let piabSlide =
    $(".present").has(".piab").length === 2 ||
    $(".present").is(".chaptertitle");
  $(document.body)[piabSlide ? "addClass" : "removeClass"]("piab");
}

window.addEventListener("hashchange", checkPiabFlag);

$(checkPiabFlag);

// ---- Firebase

var provider = new firebase.auth.GithubAuthProvider();

var config = {
  apiKey: "AIzaSyBXp4DTU3WhZWvknXbumr7YdRqrwhyLFSM",
  authDomain: "edument-voter.firebaseapp.com",
  databaseURL: "https://edument-voter.firebaseio.com",
  projectId: "edument-voter",
  messagingSenderId: "552952224251"
};
firebase.initializeApp(config);

const EVENT = "piab";

$(".piab[data-piab]").each(function() {
  var key = $(this).attr("data-piab");
  $(this).append(
    '<div class="stars"><span>0</span><span>0</span><span>0</span><span>0</span><span>0</span></div>'
  );
  $(this).prepend(`<div class="piab-key"><span>${key}</span></div>`);
});

firebase
  .auth()
  .signInWithPopup(provider)
  .then(function(result) {
    var username = result.user.uid;
    var eventRef = firebase.database().ref("events/piab");
    window.addEventListener("hashchange", function() {
      var key = $(".slide.present [data-piab]").attr("data-piab");
      if (key) {
        console.log("FLAG", key);
        eventRef.child("current").set(key);
      }
    });
    eventRef.child("questions").on("value", function(snapshot) {
      for (const [qid, data] of Object.entries(snapshot.val())) {
        const votes = Object.values(data.replies || {})
          .reduce(
            (v, val) => {
              v[val]++;
              return v;
            },
            ["X", 0, 0, 0, 0, 0]
          )
          .slice(1);
        const max = Math.max(...votes);
        $(`[data-piab='${qid}'] .stars`).html(
          votes
            .map((count, vote) =>
              count === max && count > 0
                ? `<span class="max">${count}</span>`
                : `<span>${count}</span>`
            )
            .join("")
        );
        console.log(qid, votes, max);
      }
    });
  })
  .catch(function(error) {
    alert("Something went wrong :(");
    console.log(error);
  });
