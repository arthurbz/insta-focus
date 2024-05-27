document.addEventListener("DOMContentLoaded", async function () {
  const toggleButton = document.getElementById("toggle-button");

  // Load the feed state from storage
  chrome.storage.sync.get(["feedOn"], (result) => {
    let feedOn = result.feedOn !== undefined ? result.feedOn : true;
    toggleButton.textContent = feedOn ? "Turn Feed Off" : "Turn Feed On";

    // Apply the current state to the page
    applyFeedState(feedOn);
  });

  toggleButton.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.storage.sync.get(["feedOn"], (result) => {
      let feedOn = result.feedOn !== undefined ? result.feedOn : true;
      feedOn = !feedOn;

      // Save the new state to storage
      chrome.storage.sync.set({ feedOn: feedOn });

      toggleButton.textContent = feedOn ? "Turn Feed Off" : "Turn Feed On";

      // Apply the new state to the page
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: applyFeedState,
        args: [feedOn],
      });
    });
  });

  function applyFeedState(feedOn) {
    function getFeedPosts() {
      return document.getElementsByTagName("article");
    }

    const posts = getFeedPosts();
    const firstPost = posts[0];
    if (firstPost) {
      firstPost.parentElement.parentElement.parentElement.style.display = feedOn
        ? "block"
        : "none";
    }
  }
});
