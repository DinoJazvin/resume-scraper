
import puppeteer from "puppeteer"
import "dotenv/config"
import { writeFile, readFile } from 'fs/promises';
const filePath = './scraped-data.json';
import { loadCookies, saveCookies } from "./utils/cookies.js";
import { spoofingMeasures } from "./utils/spoofing.js";


const loginToLinkedin = async (page) => {

    try {
          await page.goto('https://www.linkedin.com/login', { waitUntil: 'networkidle2' });
          await page.type('#username', process.env.LINKEDIN_EMAIL, { delay: 50 });
          await page.type('#password', process.env.LINKEDIN_PASS, { delay: 50 });

          await page.click('button[type="submit"]');
          await page.waitForNavigation({ waitUntil: 'domcontentloaded' });

          console.log('Logged in');
          
        } catch (err) {
          console.error('Login failed:', err.message);
        }
    };
      
    const run = async () => {
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      // await spoofingMeasures(page);
    
      // const usedCookies = await loadCookies(page);
      // if (!usedCookies) {
      //   await loginToLinkedin(page);
      //   await new Promise(resolve => setTimeout(resolve, 2000));
      //   await saveCookies(page);
      // }
      await page.goto("file:////Users/dinojazvin/Desktop/Programs/Front%20End%20Dev/reactpdf/my-app/data/sample-profile.html", {waitUntil: "networkidle2"})

    
      // const baseProfile = 'https://www.linkedin.com/in/dino-jazvin-26669014a/';
      // const profileUrl = baseProfile.endsWith('/') ? baseProfile : baseProfile + '/';
      // const experienceUrl = profileUrl + 'details/experience/';

      // await page.goto(profileUrl, { waitUntil: "load" });
      // await new Promise(resolve => setTimeout(resolve, 2000));


      try {
        const title = await page.title();
        const nameMatch = title.match(/^(?:\(\d+\)\s*)?(.+?)\s*\|/);
    
        if (nameMatch && nameMatch[1]) {
          
          const profileName = nameMatch[1].trim();    
          const imageSelector = `img[alt^="${profileName}"]`;
    
          try {
            const imageUrl = await page.$eval(imageSelector, el => el.src);
            // console.log('Profile Image URL:', imageUrl);

            const profileData = {
              ProfileInfo: {
                name: profileName,
                url: imageUrl,
              }
            } 

            // fs.writeFileSync('scraped-data.json', JSON.stringify(profileData, null, 2));
            await writeFile(filePath, JSON.stringify(profileData, null, 2));

          } catch (err) {
            console.error('Failed to find profile image:', err.message);
          }
    
        } else {
          console.error('Failed to extract name from title.');
        }
    
      } catch (err) {
        console.error("Couldn't get page title. Probably got redirected or blocked.");
      }
    
      // await page.goto(experienceUrl, { waitUntil: "load" });
      await page.goto("file:///Users/dinojazvin/Desktop/Programs/Front%20End%20Dev/reactpdf/my-app/data/sample-workexp.html", {waitUntil: "networkidle2"})
      // const experienceSection = await page.$('section.pvs-list__outer-container');
      const jobItems = await page.$$('li.pvs-list__paged-list-item');

      let existingData = {};
      try {
        const fileContents = await readFile(filePath, 'utf-8');
        existingData = JSON.parse(fileContents);
      } catch (err) {
        console.log('No existing file found or invalid JSON, starting fresh.');
      }

      if (!Array.isArray(existingData.workExperience)) {
        existingData.workExperience = [];
      }

      for (const item of jobItems) {

        const title = await item.$eval('span[aria-hidden="true"]', el => el.innerText).catch(() => null);
        const company = await item.$eval('.t-14.t-normal > span[aria-hidden="true"]', el => el.innerText).catch(() => null);
        const dates = await item.$eval('.t-14.t-normal.t-black--light > span.pvs-entity__caption-wrapper', el => el.innerText).catch(() => null);
       
        const location = await item.$$eval('.t-14.t-normal.t-black--light span[aria-hidden="true"]', spans => {
          return spans.length > 1 ? spans[1].innerText : null;
        }).catch(() => null);

        const descriptionRaw = await item.$eval(
          '.pvs-entity__sub-components span[aria-hidden="true"]',
          span => span.innerText.trim()
        );
 
        const workItem = {
          title,
          company,
          dates,
          location,
          descriptionRaw
        };
      
        existingData.workExperience.push(workItem);
      }

      await writeFile(filePath, JSON.stringify(existingData, null, 2));

      await page.goto("file:///Users/dinojazvin/Desktop/Programs/Front%20End%20Dev/reactpdf/my-app/data/sample-eduexp.html", {waitUntil: "networkidle2"})

      const educationItems = await page.$$('li.pvs-list__paged-list-item');
      

      try {
        const fileContents = await readFile(filePath, 'utf-8');
        existingData = JSON.parse(fileContents);
      } catch (err) {
        console.log('No existing file found or invalid JSON, starting fresh.');
      }

      if (!Array.isArray(existingData.education)) {
        existingData.education = [];
      }
      
      for (const item of educationItems) {
        const school = await item.$eval('span[aria-hidden="true"]', el => el.innerText).catch(() => null);
        const degree = await item.$eval('.t-14.t-normal > span[aria-hidden="true"]', el => el.innerText).catch(() => null);
        const dates = await item.$eval('.t-14.t-normal.t-black--light > span.pvs-entity__caption-wrapper', el => el.innerText).catch(() => null);

        const grade = await item.$$eval('span[aria-hidden="true"]', spans => {
          const gradeSpan = spans.find(span => span.innerText.trim().startsWith("Grade:"));
          return gradeSpan ? gradeSpan.innerText.trim().replace("Grade: ", "") : null;
        }).catch(() => null);

        const courses = await item.$$eval('span[aria-hidden="true"]', spans => {
          const courseSpan = spans.find(span => span.innerText.includes("Major courses include:"));
          return courseSpan ? courseSpan.innerText.trim() : null;
        }).catch(() => null);

        const skills = await item.$$eval('span[aria-hidden="true"]', spans => {
          const skillsSpan = spans.find(span => span.innerText.trim().startsWith("Skills:"));
          return skillsSpan ? skillsSpan.innerText.trim().replace("Skills: ", "") : null;
        }).catch(() => null);

        const eduItem = {
          school,
          degree,
          dates,
          grade,
          courses,
          skills
        };
      
        existingData.education.push(eduItem);

      }

      await writeFile(filePath, JSON.stringify(existingData, null, 2));

      await browser.close();
    };
    
    // const run = async () => {
    //   const browser = await puppeteer.launch({ headless: false });
    //   const page = await browser.newPage();
    //   await spoofingMeasures(page);
    
    //   await page.goto("https://www.linkedin.com/login");
    //   console.log("Log in manually...");
    //   await new Promise(resolve => setTimeout(resolve, 300000));
    
    //   await saveCookies(page); // Save cookies after login
    //   console.log("Cookies saved manually, you're good to go!");
    
    //   await browser.close();
    // };
    
    run()