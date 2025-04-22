import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer'
import ResumePDF from "./ResumePDF"
import './App.css'
import scrapedData from '../scraped-data.json'; 


function App() {
  return (
    <>
      <h2>Linkedin Resume Generator</h2>
      <PDFViewer width="100%" height={400}>
        <ResumePDF
           profile={scrapedData.ProfileInfo}
           workExperience={scrapedData.workExperience}
           education={scrapedData.education}
        />
      </PDFViewer>
      <br />
      <PDFDownloadLink
          document={<ResumePDF
           profile={scrapedData.ProfileInfo}
           workExperience={scrapedData.workExperience}
           education={scrapedData.education}
          />
        } 
        fileName="resume.pdf"
        >
        <button>Download PDF</button>
      </PDFDownloadLink>
    </>
  )
}

export default App
