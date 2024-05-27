document.addEventListener("DOMContentLoaded", async function () {
  const storiesToggle = document.getElementById("stories-toggle");
  const feedToggle = document.getElementById("feed-toggle");

  // Load the state from storage
  chrome.storage.sync.get(["storiesOn", "feedOn"], (result) => {
    let storiesOn = result.storiesOn !== undefined ? result.storiesOn : true;
    let feedOn = result.feedOn !== undefined ? result.feedOn : true;

    storiesToggle.checked = storiesOn;
    feedToggle.checked = feedOn;
  });

  storiesToggle.addEventListener("change", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    let storiesOn = storiesToggle.checked;

    // Save the new state to storage
    chrome.storage.sync.set({ storiesOn: storiesOn });

    // Apply the new state to the page
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (storiesOn) => {
        const storyContainer = document.querySelectorAll(
          "[role='presentation']"
        )[0];

        if (storyContainer) {
          storyContainer.parentElement.parentElement.style.display = storiesOn
            ? "block"
            : "none";
        }
      },
      args: [storiesOn],
    });
  });

  feedToggle.addEventListener("change", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    let feedOn = feedToggle.checked;

    // Save the new state to storage
    chrome.storage.sync.set({ feedOn: feedOn });

    // Apply the new state to the page
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (feedOn) => {
        const posts = document.getElementsByTagName("article");
        const firstPost = posts[0];

        if (firstPost) {
          firstPost.parentElement.parentElement.parentElement.style.display =
            feedOn ? "block" : "none";
        }
      },
      args: [feedOn],
    });
  });
});
