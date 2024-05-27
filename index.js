document.addEventListener("DOMContentLoaded", async function () {
  const toggleFeedButton = document.getElementById("toggle-feed-button");
  const toggleStoriesButton = document.getElementById("toggle-stories-button");

  // Load the feed state from storage
  chrome.storage.sync.get(["feedOn", "storiesOn"], (result) => {
    let feedOn = result.feedOn !== undefined ? result.feedOn : true;
    let storiesOn = result.storiesOn !== undefined ? result.storiesOn : true;
    toggleFeedButton.textContent = feedOn ? "Turn Feed Off" : "Turn Feed On";
    toggleStoriesButton.textContent = storiesOn ? "Turn Stories Off" : "Turn Stories On";
  });

  toggleFeedButton.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.storage.sync.get(["feedOn"], (result) => {
      let feedOn = result.feedOn !== undefined ? result.feedOn : true;
      feedOn = !feedOn;

      // Save the new state to storage
      chrome.storage.sync.set({ feedOn: feedOn });

      toggleFeedButton.textContent = feedOn ? "Turn Feed Off" : "Turn Feed On";

      // Apply the new state to the page
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (feedOn) => {
          function getFeedPosts() {
            return document.getElementsByTagName("article");
          }

          const posts = getFeedPosts();
          const firstPost = posts[0];

          console.log("INDEX.JS - Feed");
          console.log("POSTS", posts);
          console.log("FIRST POST", firstPost);

          if (firstPost) {
            firstPost.parentElement.parentElement.parentElement.style.display =
              feedOn ? "block" : "none";
          }
        },
        args: [feedOn],
      });
    });
  });

  toggleStoriesButton.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.storage.sync.get(["storiesOn"], (result) => {
      let storiesOn = result.storiesOn !== undefined ? result.storiesOn : true;
      storiesOn = !storiesOn;

      // Save the new state to storage
      chrome.storage.sync.set({ storiesOn: storiesOn });

      toggleStoriesButton.textContent = storiesOn ? "Turn Stories Off" : "Turn Stories On";

      // Apply the new state to the page
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (storiesOn) => {
          const storyContainer = document.querySelectorAll('[role="presentation"]')[0];
          if (storyContainer) {
            storyContainer.parentElement.parentElement.style.display = storiesOn ? "block" : "none";
          }

          console.log("INDEX.JS - Stories");
          console.log("STORIES", storyContainer);
        },
        args: [storiesOn],
      });
    });
  });
});
