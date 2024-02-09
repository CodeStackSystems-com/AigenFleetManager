const getJiraIssues = async () => {
  try {
    const response = await fetch("https://api.aigen.io/jira/getJiraIssues", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log("after back end call");
    return data;
  } catch (error) {}
};

export default { getJiraIssues };
