document.getElementById("toggleFeedButton").addEventListener("click", toggleFeed)

const FEED_STATUS = Object.freeze({
    ON: 1,
    OFF: 2
})

function getFeedPosts() {
    return document.getElementsByTagName("article")
}

function removeFeed() {
    const posts = getFeedPosts()
    console.log(posts)
    const firstPost = posts[0]

    if (firstPost) {
        firstPost.parentElement.parentElement.parentElement.style.display = "none"
    }
}

function getNewFeedStatus(currentFeedStatus) {
    return currentFeedStatus == FEED_STATUS.OFF
        ? FEED_STATUS.ON
        : FEED_STATUS.OFF
}

function getFeedStatusDescription(feedStatus) {
    const [key] = Object.entries(FEED_STATUS).find(([key, value]) => value === feedStatus)
    return key
}

async function toggleFeed() {
    const currentFeedStatus = await getStoreItem("feedStatus")
    const newFeedStatus = getNewFeedStatus(currentFeedStatus)

    if (newFeedStatus == FEED_STATUS.OFF) {
        removeFeed()
    }

    await setStoreItem("feedStatus", newFeedStatus) 
    document.getElementById("feedStatus").innerText = getFeedStatusDescription(newFeedStatus)
}

async function setStoreItem(key, value) {
    await chrome.storage.local.set({ [key]: value })
    console.log(`SET: Key: ${key}; Value: ${value}`)
}

async function getStoreItem(key) {
    const { [key]: value } = await chrome.storage.local.get(key)
    console.log(`GET: Key: ${key}; Value: ${value}`)
    return value
}