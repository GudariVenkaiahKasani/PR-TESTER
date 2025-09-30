const axios = require("axios");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

/**
 * Parse diff to extract changed line numbers
 */
function parseDiff(patch) {
  const lines = patch.split("\n");
 

  for (const line of lines) {
    if (line.startsWith("@@")) {
      // Example: @@ -10,6 +12,7 @@
      const match = line.match(/\+(\d+)/);
      if (match) currentLine = parseInt(match[1]);
    } else if (line.startsWith("+") && !line.startsWith("+++")) {
      changed.push(currentLine++);
    } else if (!line.startsWith("-")) {
      currentLine++;
    }
  }
  return changed;
}

/**
 * Fetch changed functions from PR
 */
async function fetchGithubPRChangedFunctions(owner, repo, pull_number, token) {
  const changedFunctionsMap = new Map();

  // 1️⃣ Get PR file diffs
  const filesRes = await axios.get(
    `https://api.github.com/repos/${owner}/${repo}/pulls/${pull_number}/files`,
    {
      headers: { Authorization: `token ${token}` },
    }
  );

  const files = filesRes.data;

  // 2️⃣ Loop through each changed file
  for (const file of files) {
    const { filename, patch, contents_url } = file;
    if (!patch || !filename.endsWith(".js")) continue;

    const changedLines = parseDiff(patch);

    console.log(`📄 ${filename} → Changed lines: ${changedLines.join(", ")}`);

    // 3️⃣ Fetch latest file content
    const contentRes = await axios.get(contents_url, {
      headers: { Authorization: `token ${token}` },
    });
    const content = Buffer.from(contentRes.data.content, "base64").toString("utf-8");

    // 4️⃣ Parse with Babel
    const ast = parser.parse(content, {
      sourceType: "module",
      plugins: ["jsx", "typescript"],
    });

    const functions = [];

    // 5️⃣ Traverse AST to find functions
    traverse(ast, {
      enter(path) {
        const node = path.node;
        if (
          node.type === "FunctionDeclaration" ||
          node.type === "FunctionExpression" ||
          node.type === "ArrowFunctionExpression"
        ) {
          const startLine = node.loc?.start.line;
          const endLine = node.loc?.end.line;
          if (!startLine || !endLine) return;

          const overlaps = changedLines.some(
            (line) => line >= startLine && line <= endLine
          );
          if (overlaps) {
            const name = node.id?.name || "anonymous";
            const code = content
              .split("\n")
              .slice(startLine - 1, endLine)
              .join("\n");
            functions.push({ name, startLine, endLine, code });
          }
        }
      },
    });

    if (functions.length > 0) {
      changedFunctionsMap.set(filename, functions);
    }
  }

  return changedFunctionsMap;
}

module.exports = { fetchGithubPRChangedFunctions };

