import React , {useState}from 'react';
import axios from 'axios';
import './createrepo.css';


function CreateRepo() {

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState(true); // true = public, false = private
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const ownerId = localStorage.getItem("userId"); // ✅ get from localStorage

    if (!ownerId) {
      setMessage("User not logged in!");
      return;
    }

    const response = await axios.post("http://localhost:3000/repo/create", {
      owner: ownerId,
      name,
      description,
      visibility,
    });

    setMessage(response.data.message);
    window.location.href ="/"
  } catch (error) {
    console.error("Error creating repo:", error);
    setMessage(error.response?.data?.message || "Something went wrong");
  }
};

    return (
    <div className="create-repo-wrapper">
      <h1 className="form-title">Create a new repository</h1>
      <p className="form-subtitle">
        A repository contains all project files, including revision history.
      </p>

      <form  onSubmit={handleSubmit} className="repo-form">
        {/* Name */}
        <div className="form-group">
          <label>Repository Name *</label>
          <input
            type="text"
            name="name"
            placeholder="my-awesome-project"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label>Description (optional)</label>
          <textarea
            name="description"
            placeholder="Write a short description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Visibility */}
        <div className="form-group">
          <label>Visibility</label>
          <div className="radio-group">
            <label>
              <select
                 value={visibility}
                 onChange={(e) => setVisibility(e.target.value === "true")}
               >
                 <option value="true">Public</option>
                 <option value="false">Private</option>
              </select>
            </label>
          </div>
        </div>

        <button className="create-btn" type="submit" >
          Create Repository
        </button>
      </form>
    </div>
  );
}

export default CreateRepo;