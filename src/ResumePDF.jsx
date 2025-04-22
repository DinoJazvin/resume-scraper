import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    paddingTop: 80, 
    paddingBottom: 60,
    paddingHorizontal: 30,
  },
  section: {
    marginBottom: 10,
  },
  heading: {
    fontSize: 18,
    paddingTop: 20,
  },
  subheading: {
    fontSize: 14,
    marginBottom: 8,
    paddingTop: 20,
  },
  text: {
    fontSize: 12,
    color: "black",
  },
  profilePic: {
    borderRadius: 10,
    height: 40,
    width: 40,
    marginRight: 10,
  },
  header: {
    position: 'absolute',
    top: 20,
    left: 30,
    right: 30,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameInHeader: {
    fontSize: 14,
    fontWeight: 700,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    height: 40,
    textAlign: 'center',
    fontSize: 10,
    borderTopWidth: 1,
    borderColor: '#aaa',
    paddingTop: 5,
  },
});

const MyResumePDF = ({ profile, workExperience = [], education = [] }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>

        <View style={styles.header} fixed>
          {profile?.url ? (
            <Image style={styles.profilePic} src={profile.url} />
          ) : (
            <Text style={styles.text}>No image</Text>
          )}
          <Text style={styles.nameInHeader}>{profile?.name}</Text>
        </View>

        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.heading}>Work Experience</Text>
          {workExperience.map((job, index) => (
            <View key={index} style={{ marginBottom: 10 }}>
              <Text style={styles.text}>{job.title} @ {job.company}</Text>
              <Text style={styles.text}>{job.dates} – {job.location}</Text>
              {job.descriptionRaw?.split('\n').map((line, i) => (
                <Text key={i} style={styles.text}>{line}</Text>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Education</Text>
          {education.map((edu, index) => (
            <View key={index} style={{ marginBottom: 10 }}>
              <Text style={styles.text}>{edu.school}</Text>
              <Text style={styles.text}>{edu.degree}</Text>
              <Text style={styles.text}>{edu.dates}</Text>
              {edu.grade && <Text style={styles.text}>GPA: {edu.grade}</Text>}
              {edu.courses && <Text style={styles.text}>{edu.courses}</Text>}
              {edu.skills && <Text style={styles.text}>Skills: {edu.skills}</Text>}
            </View>
          ))}
        </View>

        {/* Footer with Page Numbers */}
        <View style={styles.footer} fixed>
          <Text
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>

      </Page>
    </Document>
  );
};

export default MyResumePDF;
