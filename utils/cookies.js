import fs from "fs/promises";

const COOKIE_FILE = "linkedin-cookies.json";

// Load cookies from file and inject into browser session
export const loadCookies = async (page) => {
  try {
    const cookiesString = await fs.readFile(COOKIE_FILE, "utf-8");
    const cookies = JSON.parse(cookiesString);
    await page._client().send("Network.setCookies", { cookies });
    console.log("Cookies loaded");
    return true;
  } catch {
    console.log("⚠️ No cookies found, will log in...");
    return false;
  }
};

// Save cookies after login **only if we're definitely logged in**
export const saveCookies = async (page) => {
  try {
    // Confirm we're on LinkedIn and signed in before saving
    const currentUrl = page.url();
    const isLoggedIn = currentUrl.includes("linkedin.com/feed") || currentUrl.includes("/in/");

    if (!isLoggedIn) {
      console.log("Not logged in, skipping cookie save");
      return;
    }

    const { cookies } = await page._client().send("Network.getAllCookies");
    await fs.writeFile(COOKIE_FILE, JSON.stringify(cookies, null, 2));
    console.log("Cookies saved");
  } catch (err) {
    console.error("Failed to save cookies:", err.message);
  }
};
