


export const spoofingMeasures = async (page) => {

    // set user agent resembling human
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36")

    //set more common viewport
    await page.setViewport({ width: 1366, height: 768})

    //set navigator.webdriver to false, set language to en-us, and set plugins to three
    await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, "webdriver", {
            get: () => false,
        })
        Object.defineProperty(navigator, "languages", {
            get: () => ['en-US', 'en'],
        })
        Object.defineProperty(navigator, "plugins", {
            get: () => [1, 2, 3],
        })
    })

    // intercept page requests and check for common tracking stuff likes ads, google analytics, and other stuff
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      const url = req.url();
      const resourceType = req.resourceType();
  
      const blockList = [
        "doubleclick.net",
        "google-analytics.com",
        "ads.linkedin.com",
        "px.ads.linkedin.com",
        "facebook.net",
        "analytics.twitter.com",
        "bat.bing.com",
      ];
  
      const isBlockedDomain = blockList.some((domain) => url.includes(domain));
      const isTrackingPixel = resourceType === "image" && url.includes("1x1");
  
      if (isBlockedDomain || isTrackingPixel) {
        req.abort();
      } else {
        req.continue();
      }
    });

}