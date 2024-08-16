chrome.storage.local.get(["focusMode", "allowedSites"], function (data) {
  const focusMode = data.focusMode || false;
  const allowedSites = data.allowedSites || [];

  const currentUrl = new URL(window.location.href);
  const currentHostname = normalizeHostname(currentUrl.hostname);
  const currentProtocol = currentUrl.protocol;

  if (focusMode) {
    const isAllowed = allowedSites.some((site) => {
      try {
        const allowedHostname = normalizeHostname(getHostnameFromUrl(site));
        const allowedProtocol = getProtocolFromUrl(site);

        console.log("Checking:", {
          currentHostname,
          allowedHostname,
          currentProtocol,
          allowedProtocol,
        });

        return (
          (currentHostname === allowedHostname ||
            currentHostname.endsWith(`.${allowedHostname}`)) &&
          (allowedProtocol === "" ||
            allowedProtocol === currentProtocol ||
            allowedProtocol === "http:" ||
            allowedProtocol === "https:")
        );
      } catch (e) {
        console.error("Error parsing allowed URL:", e);
        return false;
      }
    });

    if (!isAllowed) {
      // Redirect to block page
      window.location.replace(chrome.runtime.getURL("block.html"));
    }
  }
});

function normalizeHostname(hostname) {
  // Remove www prefix and convert to lowercase
  return hostname.replace(/^www\./, "").toLowerCase();
}

function getHostnameFromUrl(url) {
  try {
    // Add a default protocol if not present
    if (!/^https?:\/\//i.test(url)) {
      url = "http://" + url;
    }
    const parsedUrl = new URL(url);
    return normalizeHostname(parsedUrl.hostname);
  } catch (e) {
    console.error("Invalid URL format:", url);
    return "";
  }
}

function getProtocolFromUrl(url) {
  try {
    // Add a default protocol if not present
    if (!/^https?:\/\//i.test(url)) {
      url = "http://" + url;
    }
    const parsedUrl = new URL(url);
    return parsedUrl.protocol;
  } catch (e) {
    console.error("Invalid URL format:", url);
    return "";
  }
}
