
// import { writeFile, readFile } from 'fs/promises';
// const filePath = '../scraped-data.json';

// export const getProfileInfo = async (page) => {

//     await page.goto("file:///Users/dinojazvin/Desktop/Programs/Front%20End%20Dev/reactpdf/my-app/data/sample-profile.html", {waitUntil: "networkidle2"})

//     try {
//         const title = await page.title();
//         const nameMatch = title.match(/^(?:\(\d+\)\s*)?(.+?)\s*\|/);
    
//         if (nameMatch && nameMatch[1]) {
          
//           const profileName = nameMatch[1].trim();    
//           const imageSelector = `img[alt^="${profileName}"]`;
    
//           try {
//             const imageUrl = await page.$eval(imageSelector, el => el.src);
//             console.log('Profile Image URL:', imageUrl);

//             const profileData = {
//               ProfileInfo: {
//                 name: profileName,
//                 url: imageUrl,
//               }
//             } 

//             await writeFile(filePath, JSON.stringify(profileData, null, 2));

//           } catch (err) {
//             console.error('Failed to find profile image:', err.message);
//           }
    
//         } else {
//           console.error('Failed to extract name from title.');
//         }
    
//       } catch (err) {
//         console.error("Couldn't get page title. Probably got redirected or blocked.");
//       }
// }


// // export default getProfileInfo