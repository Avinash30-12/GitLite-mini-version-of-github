import React,{useState , useEffect} from 'react';
import axios from "axios";

import "./dashboard.css";
import Navbar from "../Navbar";
import Feed from './Feed';


const Dashboard=()=> {
    
    const[repositories , setRepositories] = useState([]);
    const[searchQuery , setSearchQuery] = useState("");
    const[suggestedRepositories , setSuggestedRepositories] = useState([]);
    const[searchResults , setSearchResults] = useState([]);

    useEffect(()=>{
        const userId = localStorage.getItem("userId");

        const fetchRepositories = async ()=>{
            try{
                 const response = await fetch(`https://gitlite.onrender.com/repo/user/${userId}`);
                 const data = await response.json();
                 setRepositories(data.repositories || []); // fallback to []
            }catch (err) {
                    console.error("Error while fecthing repositories: ", err);
                    setRepositories([]); // ensure it's never undefined
                }
        }

        const fetchSuggestedRepositories = async ()=>{
            try{
                 const response = await fetch(`https://gitlite.onrender.com/repo/all`);
                 const data = await response.json();
                 setSuggestedRepositories(data);
            }catch (err) {
                    console.error("Error while fecthing repositories: ", err);
                }
        }

       fetchRepositories();
       fetchSuggestedRepositories();
    }, []);

    useEffect(()=>{
       if (searchQuery == "") {
      setSearchResults(repositories);
    } else {
      const filteredRepo = repositories.filter((repo) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase())
       // In JavaScript, the includes() method checks if a string contains another string.
      );
      setSearchResults(filteredRepo);
    }
    }, [searchQuery , repositories]);

  const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this repository?")) return;

  try {
    const response = await axios.delete(`https://gitlite.onrender.com/repo/delete/${id}`);

    alert(response.data.message);

    // Remove from UI without refreshing
    setRepositories((prev) => prev.filter((repo) => repo._id !== id));
    setSearchResults((prev) => prev.filter((repo) => repo._id !== id));
  } catch (err) {
    console.error("Error deleting repo:", err);
    alert("Failed to delete repository");
  }
};



    return ( 
    <>
      <Navbar />
      <section id="dashboard">
        <aside>
          <h3>Suggested Repositories</h3>
          {suggestedRepositories.map((repo) => {
            return (
              <div key={repo._id}>
                <h4>{repo.name}</h4>
                <h4>{repo.description}</h4>
              </div>
            );
          })}
        </aside>
        <main>
          <h2>Your Repositories</h2>
          <div id="search">
            <input
              type="text"
              value={searchQuery}
              placeholder="Search..."
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {Array.isArray(searchResults) && searchResults.length > 0 ? (
                    searchResults.map((repo) => (
                      <div key={repo._id}>
                        <div>
                          <h4>{repo.name}</h4>
                          <h4>{repo.description}</h4>
                        </div>
                        <button className="delete-btn" onClick={() => handleDelete(repo._id)}>
                          Delete
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="no-repos-msg">🚀 You don't have any repositories yet.</p>
                  )}
               <div className="main-feed">
                 <Feed />
               </div>
        </main>
        <aside>
          <h3>Upcoming Events</h3>
          <ul className="events-list">
                <li>
                  <h4>Tech Conference 2025</h4>
                  <p>📍 San Francisco, CA</p>
                  <p>📅 Dec 15, 2025</p>
                </li>
                <li>
                  <h4>Developer Meetup</h4>
                  <p>📍 New Delhi, India</p>
                  <p>📅 Dec 25, 2025</p>
                </li>
                <li>
                  <h4>React Summit</h4>
                  <p>📍 Amsterdam, NL</p>
                  <p>📅 Jan 5, 2026</p>
                </li>
                <li>
                  <h4>AI & ML Workshop</h4>
                  <p>📍 Online (Zoom)</p>
                  <p>📅 Jan 20, 2026</p>
                </li>
                <li>
                  <h4>Open Source Hackathon</h4>
                  <p>📍 Bengaluru, India</p>
                  <p>📅 Feb 10, 2026</p>
                </li>
                <li>
                   <h4>Cloud Computing Expo</h4>
                   <p>📍 London, UK</p>
                   <p>📅 Mar 3, 2026</p>
                </li>
              </ul>
        </aside>
      </section>
      </>
  );
};
export default Dashboard;
