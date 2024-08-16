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
    addSite(siteInput.value.trim());
  });

  siteInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      addSite(siteInput.value.trim());
    }
  });

  function addSite(site) {
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
  }

  function addSiteToList(site) {
    const li = document.createElement("li");
    li.textContent = site;
    const deleteButton = document.createElement("span");
    deleteButton.innerHTML = '<i class="fas fa-times"></i>'; // Font Awesome icon for the delete button
    deleteButton.className = "delete-button";
    deleteButton.addEventListener("click", function () {
      removeSite(site);
    });
    li.appendChild(deleteButton);
    allowedSitesList.appendChild(li);
  }

  function removeSite(site) {
    chrome.storage.sync.get(["allowedSites"], function (data) {
      const allowedSites = data.allowedSites || [];
      const index = allowedSites.indexOf(site);
      if (index > -1) {
        allowedSites.splice(index, 1);
        chrome.storage.sync.set({ allowedSites: allowedSites });
        updateSiteList();
      }
    });
  }

  function updateSiteList() {
    allowedSitesList.innerHTML = "";
    chrome.storage.sync.get(["allowedSites"], function (data) {
      const allowedSites = data.allowedSites || [];
      allowedSites.forEach((site) => addSiteToList(site));
    });
  }
});
