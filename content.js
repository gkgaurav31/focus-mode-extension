chrome.storage.local.get(["focusMode", "allowedSites"], function (data) {
  const focusMode = data.focusMode || false;
  const allowedSites = data.allowedSites || [];

  const currentUrl = new URL(window.location.href);
  const currentHostname = currentUrl.hostname;
  const currentProtocol = currentUrl.protocol;

  if (focusMode) {
    const isAllowed = allowedSites.some((site) => {
      try {
        const allowedUrl = new URL(site);
        const allowedHostname = allowedUrl.hostname;

        // Check if the current hostname ends with the allowed hostname
        // Allow access for both http and https protocols
        return (
          currentHostname === allowedHostname ||
          currentHostname.endsWith(`.${allowedHostname}`) ||
          allowedHostname === "" ||
          currentProtocol === "http:" ||
          currentProtocol === "https:"
        );
      } catch (e) {
        return false;
      }
    });

    if (!isAllowed) {
      // Redirect to block page
      window.location.replace(chrome.runtime.getURL("block.html"));
    }
  }
});
