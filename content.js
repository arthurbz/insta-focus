// Load the feed state from storage and apply it
chrome.storage.sync.get(["feedOn"], (result) => {
  let feedOn = result.feedOn !== undefined ? result.feedOn : true;
  applyFeedState(feedOn);
});

function applyFeedState(feedOn) {
  const posts = document.getElementsByTagName("article");
  const firstPost = posts[0];

  if (firstPost) {
    firstPost.parentElement.parentElement.parentElement.style.display = feedOn
      ? "block"
      : "none";
  }
}
