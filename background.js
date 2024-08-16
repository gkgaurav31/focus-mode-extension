chrome.runtime.onInstalled.addListener(() => {
  updateRules();
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.focusMode || changes.allowedSites) {
    updateRules();
  }
});

function updateRules() {
  chrome.storage.sync.get(["focusMode", "allowedSites"], function (data) {
    const focusMode = data.focusMode || false;
    const allowedSites = data.allowedSites || [];

    chrome.storage.local.set({ focusMode, allowedSites });
  });
}
