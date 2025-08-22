const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require("http");
const {Server} = require("socket.io");
const mainRouter = require("./routes/main.router");

const yargs = require("yargs");
const {hideBin} = require("yargs/helpers");

const {initRepo} = require("./controllers/init")
const {addRepo} = require("./controllers/add")
const {commitRepo} = require("./controllers/commit")
const {pullRepo} = require("./controllers/pull")
const {pushRepo} = require("./controllers/push")
const {revertRepo} = require("./controllers/revert");

dotenv.config();

yargs(hideBin(process.argv))
.command("start" , "Start a new Server", {} , startServer)
.command("init" , "initialize a new repository", {} , initRepo)
.command("add <file>" , "Add a file to repository", (yargs)=>{ yargs.positional("file" ,{
    describe:"File to add in a staging area",
    type:"string"
});
} , 
 (argv)=>{
    addRepo(argv.file);
 }
)
.command("commit <message>" , "commit a file to repository", (yargs)=>{ yargs.positional("message" ,{
    describe:"commit a file in a staging area",
    type:"string"
});
} , (argv)=>{
    commitRepo(argv.message);
 })
.command("push" , "push a new repository", {} , pushRepo)
.command("pull" , "pull a new repository", {} , pullRepo)
.command("revert <commitID>" , "revert a file", (yargs)=>{ yargs.positional("commitID" ,{
    describe:"revert a file",
    type:"string"
});
} , (argv)=>{
    revertRepo(argv.commitID);
 })
.demandCommand(1 , "you need atleast one command")
.help().argv;


function startServer(){
    const app = express();
    const port = process.env.PORT || 3000;

    app.use(bodyParser.json());
    app.use(express.json());
    
    const mongoURI = process.env.MONGODB_URI;

    mongoose.connect(mongoURI)
    .then(()=>console.log("connected to mongoDB"))
    .catch((err)=>console.log(err));

    app.use(cors({origin:"*"}));
    app.use("/" , mainRouter);
    
    let user = "test";
    const httpServer = http.createServer(app);
    const io = new Server(httpServer , {
        cors:{
            origin:"*",
            methods:["GET" , "POST"],
        },
    });
    
    io.on("connection" ,(socket)=>{
        socket.on("joinRoom" , (userID)=>{
            user = userID;
            console.log("======");
            console.log(user);
            console.log("======");
            socket.join(userID);
        });
    });

    const db = mongoose.connection;

    db.once("open" , async()=>{
        console.log("CRUD operations called");
    })

    httpServer.listen(port , ()=>{
        console.log("server is running on PORT")
    })
}