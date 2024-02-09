import React from "react";
import { Text, ScrollView, StyleSheet, View } from "react-native";

interface Issue {
  status: string;
  summary: string;
}

interface Props {
  issues: Issue[];
}

const JiraIssues: React.FC<Props> = ({ issues }) => {
  if (issues.length === 0) {
    return (
      <View style={styles.noIssuesFoundContainer}>
        <Text style={styles.noIssuesText}>No issues found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollContainer}>
      {issues.map((issue, index) => (
        <View key={index} style={styles.issueContainer}>
          <Text style={styles.issueSummary}>{issue.summary}</Text>
          <Text style={styles.issueStatus}>{issue.status}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    marginHorizontal: 20,
  },
  issueContainer: {
    borderBottomWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#0d0d0d",
    marginBottom: 20,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  issueStatus: {
    fontSize: 18,
    marginBottom: 5,
    color: "#D9D9D9",
  },
  issueSummary: {
    fontSize: 20,
    color: "#D9D9D9",
  },
  noIssuesFoundContainer: {
    paddingVertical: 10,
    backgroundColor: "#0d0d0d",
    borderRadius: 10,
    marginHorizontal: 20,
  },
  noIssuesText: {
    fontSize: 20,
    color: "#D9D9D9",
    alignSelf: "center",
  },
});

export default JiraIssues;
