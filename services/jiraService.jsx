const createJiraIssue = async (formData) => {
  try {
    const data = {
      description: {
        content: [
          {
            content: [
              {
                text: formData.description,
                type: "text",
              },
            ],
            type: "paragraph",
          },
        ],
        type: "doc",
        version: 1,
      },
      issuetype: {
        id: "10090",
      },
      project: {
        id: "10054",
      },
      summary: formData.issue,
    };

    if (formData.robotID) {
      data.customfield_10142 = formData.robotID;
    }

    if (formData.fieldID) {
      data.customfield_10141 = formData.fieldID;
    }

    if (formData.issueType) {
      if (formData.issueType === "Suspect SW") {
        data.customfield_10145 = {
          id: "10304",
        };
      } else if (formData.issueType === "HW Issue") {
        data.customfield_10145 = {
          id: "10302",
        };
      } else if (formData.issueType === "Stuck/Obstacle") {
        data.customfield_10145 = {
          id: "10303",
        };
      }
    }

    if (formData.recovered) {
      if (formData.recovered === "Yes") {
        data.customfield_10147 = {
          id: "10307",
        };
      } else if (formData.recovered === "No") {
        data.customfield_10147 = {
          id: "10308",
        };
      }
    }

    if (formData.hwReplaced === "Yes") {
      if (formData.fru === "Arm assembly") {
        data.customfield_10140 = {
          id: "10273",
        };
      }

      if (formData.fru === "Arm tip") {
        data.customfield_10140 = {
          id: "10274",
        };
      }

      if (formData.fru === "Battery") {
        data.customfield_10140 = {
          id: "10275",
        };
      }

      if (formData.fru === "Central Enclosure") {
        data.customfield_10140 = {
          id: "10276",
        };
      }

      if (formData.fru === "Harness") {
        data.customfield_10140 = {
          id: "10277",
        };
      }

      if (formData.fru === "Payload") {
        data.customfield_10140 = {
          id: "10278",
        };
      }

      if (formData.fru === "Side assembly") {
        data.customfield_10140 = {
          id: "10279",
        };
      }

      if (formData.fru === "Solar Assembly") {
        data.customfield_10140 = {
          id: "10309",
        };
      }

      if (formData.fru === "Wheels with motors") {
        data.customfield_10140 = {
          id: "10280",
        };
      }

      if (formData.fru === "Other") {
        data.customfield_10140 = {
          id: "10310",
        };
      }
    }

    const result = await fetch(`https://api.aigen.io/jira/createJiraIssue`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseBody = await result.text();

    const responseParts = responseBody.split(" ");
    const issueKey = responseParts[responseParts.length - 1];

    return { success: true, data: responseBody, issueKey: issueKey };
  } catch (error) {
    console.error("Jira API Request Failed:", error);
    return { success: false, error: error.message };
  }
};

export default { createJiraIssue };
