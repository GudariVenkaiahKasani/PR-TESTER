const express = require("express");
const { fetchGithubPRChangedFunctions } = require("./fetchChangedFunctions");

const app = express();
app.use(express.json());

app.post("/api/test-pr", async (req, res) => {
  const { owner, repo, pr, token } = req.body;
  if (!owner || !repo || !pr || !token) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const map = await fetchGithubPRChangedFunctions(owner, repo, pr, token);
    const result = {};
    for (const [file, funcs] of map.entries()) {
      result[file] = funcs;
    }
    res.json(result);
  } catch (err) {
    console.error("❌ Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(4000, () =>
  console.log("🚀 Server running at http://localhost:4000")
);
