/**
 * SecureIX QuickScan — Background Service Worker (Manifest V3)
 */

chrome.runtime.onInstalled.addListener(() => {
  console.log("SecureIX QuickScan Extension Installed.");
  chrome.action.setBadgeText({ text: "SCAN" });
  chrome.action.setBadgeBackgroundColor({ color: "#38bdf8" });
});

// Update badge when switching tabs
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (
      !tab ||
      !tab.url ||
      tab.url.startsWith("chrome://") ||
      tab.url.startsWith("edge://")
    ) {
      chrome.action.setBadgeText({ tabId: activeInfo.tabId, text: "" });
      return;
    }

    // Check if HTTPS
    try {
      const parsed = new URL(tab.url);
      if (parsed.protocol === "https:") {
        chrome.action.setBadgeText({ tabId: activeInfo.tabId, text: "SEC" });
        chrome.action.setBadgeBackgroundColor({
          tabId: activeInfo.tabId,
          color: "#86efac",
        });
      } else {
        chrome.action.setBadgeText({ tabId: activeInfo.tabId, text: "!" });
        chrome.action.setBadgeBackgroundColor({
          tabId: activeInfo.tabId,
          color: "#ff9ebb",
        });
      }
    } catch {
      chrome.action.setBadgeText({ tabId: activeInfo.tabId, text: "?" });
    }
  } catch (err) {
    // Tab might have been closed
  }
});

// Clear badge on tab removal
chrome.tabs.onRemoved.addListener((tabId) => {
  // automatic cleanup
});
