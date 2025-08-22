const fs = require("fs").promises;
const path = require("path");


async function addRepo(filePath){
    const repoPath= path.resolve(process.cwd(), ".apnaGit");
    const stagingPath = path.join(repoPath , "staging");
    
        try {
            await fs.mkdir(stagingPath , {recursive: true});
            //recursive: true means: if parent folders don’t exist, create them too.
            const fileName = path.basename(filePath);
            await fs.copyFile(filePath , path.join(stagingPath , fileName));
            console.log(`file ${fileName} added to a staging area`);
        } catch (err) {
            console.log(err);
        }
}

module.exports ={addRepo};