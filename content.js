// Load the feed and stories state from storage and apply them
chrome.storage.sync.get(["feedOn", "storiesOn"], (result) => {
  let feedOn = result.feedOn !== undefined ? result.feedOn : true;
  let storiesOn = result.storiesOn !== undefined ? result.storiesOn : true;
  applyFeedState(feedOn);
  applyStoriesState(storiesOn);
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

function applyStoriesState(storiesOn) {
  const storyContainer = document.querySelectorAll('[role="presentation"]')[0];

  if (storyContainer) {
    storyContainer.parentElement.parentElement.style.display = storiesOn
      ? "block"
      : "none";
  }
}
