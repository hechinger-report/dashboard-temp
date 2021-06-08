$('document').ready(() => {

  function formatTweet(text){
    var via = (typeof twitterTag != "undefined" ? " @" + twitterTag : " @hechingerreport"),
      returnText = text+via,
      linkCharOffset = 21,
      arrayText = [];

    if (returnText.length + linkCharOffset <= 280){
      return returnText;
    } else {
      arrayText = text.split(" ");
      while ((returnText.length + linkCharOffset) > 280){
        arrayText.pop();
        returnText = arrayText.join(" ")+via;
      }
      return returnText;
    }
  }

  $('#twitter-share').append(`<a href="https://twitter.com/intent/tweet?text=${formatTweet(leadText)}&url=${encodeURI(storyURL)}" class="popup"><i class="fab fa-twitter"></i></a>`);

  $('#facebook-share').append(`<a  href="https://www.facebook.com/sharer/sharer.php?u=${encodeURI(storyURL)}" class="popup"><i class="fab fa-facebook"></i></a>`);

});
