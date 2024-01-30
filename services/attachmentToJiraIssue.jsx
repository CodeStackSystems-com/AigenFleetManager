const attachImageToJiraIssue = async (image, issueKey) => {
  try {
    const imageResult = await fetch(
      `https://api.aigen.io/jira/attachImageToJiraIssue`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ issueKey, base64file: image }),
      }
    );

    if (!imageResult.ok) {
      const errorResponse = await imageResult.text();
      throw new Error(`Jira Attachment API Error: ${errorResponse}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Jira Attachment API Request Failed:", error);
    return { success: false, error: error.message };
  }
};

export default { attachImageToJiraIssue };
