const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");


async function createRepository(req,res){
    const { owner, name, issues, content, description, visibility } = req.body;
    try {
        if(!name){
            return res.status(400).json({message:"Repository name is required"});
        };

        if (!owner || owner === "null") {
             return res.status(400).json({ message: "Owner ID is required or invalid" });
         }
        if(!mongoose.Types.ObjectId.isValid(owner)){
            return res.status(400).json({ error: "Invalid User ID!" });
        }

        const newRepository =new Repository({
            owner, 
            name, 
            issues,
            content,
            description,
            visibility
        });

        const result = await newRepository.save();

        res.status(201).json({
              message: "Repository created successfully!",
              repositoryID: result._id,
              repository: result,
            });
    } catch (error) {
        if (error.code === 11000) {
      return res.status(400).json({
        message: "Repository name already exists. Please choose a different name.",
      });
    }

    console.error("Error creating repository:", err);
    res.status(500).json({ message: "Server error while creating repository" });
    }
}
async function getAllRepositories(req,res){
    try{
       const repositories = await Repository.find({})
       .populate("owner")
       .populate("issues");

       res.json(repositories);
    }catch (error) {
        console.log(error);
    }
}
async function fetchRepositoryById (req,res){
    const repoID = req.params.id;

    try{
       const repositories = await Repository.find({_id: repoID})
       .populate("owner")
       .populate("issues");

       res.json(repositories);
    }catch (error) {
        console.log(error);
    }
}
async function fetchRepositoryByName (req,res){
    const repoName = req.params.name;

    try{
       const repositories = await Repository.find({ name: repoName})
       .populate("owner")
       .populate("issues");

       res.json(repositories);
    }catch (error) {
        console.log(error);
    }
}
async function fetchRepositoriesForCurrentUser (req,res){
   const userId = req.params.userId;

    try{
       const repositories = await Repository.find({ owner : userId});

       if(!repositories || repositories.length==0){
        return res.status(404).json({message:"repository not found"});
       }

       res.json({message:"Repository found" , repositories});
    }catch (error) {
        console.log(error);
    }
}
async function updateRepositoryById (req,res){
    const {id} = req.params;
    const {content , description} = req.body;
    try{
        const repository = await Repository.findById({id});

        if(!repository){
            return res.status(404).json({message:"Repository not found"});
        }

        repository.content.push(content);
        repository.description = description;

        const updatedRepository = await repository.save();

        res.json({
            message:"Repository Updated",
            repository:updatedRepository
        })
    }catch (error) {
        console.log(error);
    };
}
async function toggleVisibilityById(req,res){
    const {id} = req.params;
    try{
        const repository = await Repository.findById({id});

        if(!repository){
            return res.status(404).json({message:"Repository not found"});
        }

        repository.visibility = !repository.visibility;

        const updatedRepository = await repository.save();

        res.json({
            message:"Repository toggled",
            repository:updatedRepository
        })
    }catch (error) {
        console.log(error);
    };
}
async function deleteRepositoryById (req,res){
    const {id} = req.params;
    try{
        const repository = await Repository.findByIdAndDelete(id);

        if(!repository){
            return res.status(404).json({message:"Repository not found"});
        }

        res.json({
            message:"Repository deleted"
        })
    }catch (error) {
        console.log(error);
    };
}

module.exports = {
  createRepository,
  getAllRepositories,
  fetchRepositoryById,
  fetchRepositoryByName,
  fetchRepositoriesForCurrentUser,
  updateRepositoryById,
  toggleVisibilityById,
  deleteRepositoryById,
};
