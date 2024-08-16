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
    if (site && isValidURL(site)) {
      chrome.storage.sync.get(["allowedSites"], function (data) {
        const allowedSites = data.allowedSites || [];
        if (!allowedSites.includes(site)) {
          allowedSites.push(site);
          chrome.storage.sync.set({ allowedSites: allowedSites });
          addSiteToList(site);
          siteInput.value = "";
        }
      });
    } else {
      alert(
        "Please enter a valid URL or domain (e.g., https://example.com or example.com)"
      );
    }
  }

  function isValidURL(site) {
    try {
      // Attempt to create a new URL object. This will throw an error for invalid URLs.
      new URL(site);
      return true;
    } catch (e) {
      // If the URL is invalid, check if it's a valid domain name.
      const domainPattern = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return domainPattern.test(site);
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
