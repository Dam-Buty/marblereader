
$.get("stories/marble-hornets.min.json", function(story) {
  story["params"] = {
    story: "marble-hornets",
    autoPlay: false,
    fullScreen: false
  };

  riot.mount("player", story);
});
