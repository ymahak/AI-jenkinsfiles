const readline = require("readline");
const fs = require("fs");
const axios = require("axios");
require("dotenv").config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(question) {
  return new Promise(resolve => rl.question(question, answer => resolve(answer)));
}

async function generateJenkinsfile() {
  console.log("=== 🧠 AI-Assisted Jenkinsfile Generator ===\n");

  const projectType = await askQuestion("Enter your project type (e.g., Node.js, Java, Python): ");
  const buildTool = await askQuestion("Enter your build tool (e.g., npm, Maven, Gradle): ");
  const testCommand = await askQuestion("Enter your test command (e.g., npm test, mvn test): ");

  const prompt = `
Generate a Jenkinsfile for a ${projectType} project using ${buildTool}.
Do not include any checkout or SCM stage.

Requirements:
- Use Jenkins Declarative Pipeline Syntax
- Use agent any
- Include only the following stages: build, test
- Use the build tool for installation or compilation
- Use this test command in the test stage: ${testCommand}
- Keep the pipeline simple and suitable for automation
`;

  const url = "https://api.groq.com/openai/v1/chat/completions";

  try {
    const response = await axios.post(
      url,
      {
        model: "llama3-70b-8192",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1000,
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const generated = response.data.choices[0].message.content;

    fs.writeFileSync("Jenkinsfile", generated);
    console.log("\n Jenkinsfile generated and saved as 'Jenkinsfile'.");
  } catch (error) {
    console.error("\n Error generating Jenkinsfile:", error.response?.data || error.message);
  }

  rl.close();
}

generateJenkinsfile();
