import React from "react";
import "./feed.css";

const dummyFeed = [
  {
    id: 1,
    repoName: "moeru-ai/airi",
    description:
      "💞 Self hosted, your own AI companion, a container of souls of waifu...",
    tech: "Vue",
    stars: "4.8k",
  },
  {
    id: 2,
    repoName: "simstudioai/sim",
    description:
      "An open-source AI agent workflow builder. Intuitive way to deploy LLMs...",
    tech: "TypeScript",
    stars: "9.5k",
  },
  {
    id: 3,
    repoName: "alexkowsik/react-weather-app",
    description:
      "React.js weather app (5-day forecast) using OpenWeatherMap API.",
    tech: "JavaScript",
    stars: "131",
  },
];

function Feed() {
  return (
    <div className="feed-container">
      <h3 className="feed-heading">Trending repositories</h3>

      {dummyFeed.map((item) => (
        <div key={item.id} className="feed-card">
          <div className="feed-card-header">
            <span className="repo-name">{item.repoName}</span>
            <button className="star-btn">⭐ Star</button>
          </div>
          <p className="repo-description">{item.description}</p>
          <div className="feed-meta">
            <span>{item.tech}</span>
            <span>★ {item.stars}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Feed;
