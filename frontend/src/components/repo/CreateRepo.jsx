import React, { useState, useEffect } from "react";
import axios from "axios";
import './createrepo.css';
import { useAuth } from "../../authContext";


function CreateRepo() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState(true); // true = public, false = private
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { currentUser } = useAuth();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      // Not logged in → redirect to login page
      setMessage("You must log in first!");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const ownerId = localStorage.getItem("userId");

      if (!ownerId || !token) {
        setMessage("User not logged in!");
        setLoading(false);
        return;
      }

      console.log({ owner: ownerId, name, description, visibility }); // 🔍 Debug

      const response = await axios.post(
        "https://gitlite.onrender.com/repo/create",
        {
          owner: ownerId,
          name,
          description,
          visibility,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // send token for auth
          },
        }
      );

      setMessage(response.data.message || "Repository created successfully!");
      setLoading(false);

      // Redirect to home after creation
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch (error) {
      console.error("Error creating repo:", error);
      // Show backend error message if available
      setMessage(error.response?.data?.message || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="create-repo-wrapper">
      <h1 className="form-title">Create a new repository</h1>
      <p className="form-subtitle">
        A repository contains all project files, including revision history.
      </p>

      {message && <div className="flash-msg">{message}</div>}

      <form onSubmit={handleSubmit} className="repo-form">
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

        <div className="form-group">
          <label>Description (optional)</label>
          <textarea
            name="description"
            placeholder="Write a short description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Visibility</label>
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value === "true")}
          >
            <option value="true">Public</option>
            <option value="false">Private</option>
          </select>
        </div>

        <button className="create-btn" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Repository"}
        </button>
      </form>
    </div>
  );
}

export default CreateRepo;
