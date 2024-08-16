document.addEventListener("DOMContentLoaded", () => {
  const focusModeCheckbox = document.getElementById("focusMode");
  const siteInput = document.getElementById("siteInput");
  const addSiteButton = document.getElementById("addSiteButton");
  const allowedSitesList = document.getElementById("allowedSitesList");

  chrome.storage.sync.get(["focusMode", "allowedSites"], function (data) {
    focusModeCheckbox.checked = data.focusMode || false;
    const allowedSites = data.allowedSites || [];
    allowedSites.forEach((site) => addSiteToList(site));
  });

  focusModeCheckbox.addEventListener("change", function () {
    chrome.storage.sync.set({ focusMode: focusModeCheckbox.checked });
  });

  addSiteButton.addEventListener("click", function () {
    const site = siteInput.value.trim();
    if (site) {
      chrome.storage.sync.get(["allowedSites"], function (data) {
        const allowedSites = data.allowedSites || [];
        if (!allowedSites.includes(site)) {
          allowedSites.push(site);
          chrome.storage.sync.set({ allowedSites: allowedSites });
          addSiteToList(site);
          siteInput.value = "";
        }
      });
    }
  });

  function addSiteToList(site) {
    const li = document.createElement("li");
    li.textContent = site;
    allowedSitesList.appendChild(li);
  }
});
