const fs = require("fs").promises;
const path = require("path");
const {
  ListObjectsV2Command,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");

const { s3, S3_BUCKET } = require("../config/aws-config");

async function pullRepo() {
  const repoPath = path.resolve(process.cwd(), ".apnaGit");
  const commitsPath = path.join(repoPath, "commits");

  try {
    // 1. List all objects under commits/
    const data = await s3.send(
      new ListObjectsV2Command({
        Bucket: S3_BUCKET,
        Prefix: "commits/",
      })
    );

    if (!data.Contents || data.Contents.length === 0) {
      console.log("⚠️ No commits found in S3.");
      return;
    }

    // 2. Loop over all objects
    const objects = data.Contents;
    for (const object of objects) {
      const key = object.Key; // e.g. commits/abc123/file.txt
      if (!key || key.endsWith("/")) continue; // skip empty folders

      const commitDir = path.join(
        commitsPath,
        path.dirname(key).split("/").pop() // extract commitId from path
      );

      // Ensure commit folder exists locally
      await fs.mkdir(commitDir, { recursive: true });

      // 3. Download file from S3
      const response = await s3.send(
        new GetObjectCommand({
          Bucket: S3_BUCKET,
          Key: key,
        })
      );

      // 4. Stream response.Body to Buffer
      const chunks = [];
      for await (const chunk of response.Body) {
        chunks.push(chunk);
      }
      //Combines all the small chunks into one single Buffer (the entire file content in memory).
      //Now fileContent contains the complete file exactly as it was in S3.
      const fileContent = Buffer.concat(chunks);

      // 5. Write file locally inside .apnaGit
      const localFilePath = path.join(repoPath, key);
      await fs.mkdir(path.dirname(localFilePath), { recursive: true });
      await fs.writeFile(localFilePath, fileContent);

      console.log(`⬇️ Pulled: ${key}`);
    }

    console.log("🚀 All commits pulled from S3.");
  } catch (err) {
    console.error("❌ Unable to pull:", err);
  }
}

module.exports = { pullRepo };
