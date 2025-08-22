const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { MongoClient} = require("mongodb");
const dotenv = require("dotenv");
const { ObjectId } = require('mongodb'); // Make sure to import ObjectId properly
dotenv.config();

const uri = process.env.MONGODB_URI;

let client;
async function connectClient(){
    if(!client){
        client = new MongoClient(uri , {
            useNewUrlParser: true,
            useUnifiedTopology:true,
        });
        await client.connect();
    }
}

async function signup(req,res){
    const {username , password , email} = req.body;
    try {
        await connectClient();
        const db = client.db("githubclone");
        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne({username});
        if(user){
            return res.status(400).json({message:"user already exixts"});
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password , salt);

        const newUser ={
            username,
            password:hashedPassword,
            email,
            repositories :[],
            followedUsers:[],
            starRepos:[]
        };

        const result = await usersCollection.insertOne(newUser);
        
        const token = jwt.sign({id:result.insertedId}, process.env.JWT_SECRET_KEY , {expiresIn:"1h"});
        res.json({token ,userId: result.insertedId});
    } catch (error) {
        console.log(error)
    }
}

async function login(req,res){
    const { email , password} = req.body;
    try {
        await connectClient();
        const db = client.db("githubclone");
        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne({ email});
        if(!user){
            return res.status(400).json({message:"invalid credentials"});
        }
        
        const isMatch = await bcrypt.compare(password , user.password);
        if(!isMatch){
            return res.status(400).json({message:"invalid credentials"});
        }
        
        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET_KEY , {expiresIn:"1h"});
        res.json({token , userId: user._id});
    } catch (error) {
        console.log(error)
    }
}
async function getAllUsers(req,res){
    try {
        await connectClient();
        const db = client.db("githubclone");
        const usersCollection = db.collection("users");

        const user = await usersCollection.find({}).toArray();
        res.json({user});
    } catch (error) {
        console.log(error)
    }
}

async function getUserProfile(req,res){
    const currentId = req.params.id;

    try {
        await connectClient();
        const db = client.db("githubclone");
        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne({_id: new ObjectId(currentId)});
         if(!user){
            return res.status(404).json({message:"user not found!"});
        }

        res.send(user);
        
    } catch (error) {
        console.log(error)
    }
}

async function updateUserProfile(req, res) {
  const currentID = req.params.id;
  const { email, password } = req.body;

  try {
    await connectClient();
    const db = client.db("githubclone");
    const usersCollection = db.collection("users");

    // First verify the user exists
    const existingUser = await usersCollection.findOne({ 
      _id: new ObjectId(currentID) 
    });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    let updateFields = { email };
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, salt);
    }

    // Perform the update
    const result = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(currentID) },
      { $set: updateFields },
      { 
        returnDocument: "after",
        projection: { password: 0 }, // Exclude password from the returned document
        includeResultMetadata: true // Important for some driver versions
      }
    );

     if (!result.value) return res.status(404).json({ message: "User not found" });

    res.json({ user: result.value, message: "Profile updated" });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}
async function deleteUserProfile(req,res){
    const currentId = req.params.id;
    try{
        await connectClient();
        const db = client.db("githubclone");
        const usersCollection = db.collection("users");
      
        const user = await usersCollection.deleteOne({_id: new ObjectId(currentId)});
         if(user.deleteCount == 0){
            return res.status(404).json({message:"user not found!"});
        }

        res.send({message:"User deleted"});
    }catch (error) {
        console.log(error)
    }
}

module.exports ={
    getAllUsers,
    signup,
    login,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile
}