import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import "./Article.css";
import "./ArticleCard.css"; // Assuming you have a CSS file for styling
import { Link } from "react-router-dom";
import {
  articles,
  gamesForMentalHealth,
  healingMentalHealthArticles,
  novelsForMentalWellness,
} from "../Article/ArticleData";
const Article = (index) => {
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch("./articles/article1.md")
      .then((res) => res.text())
      .then((text) => setContent(text));
  }, []);

  return (
    <div className="post">
      <ReactMarkdown children={content} />
    </div>
  );
};
function Test(index) {
  console.log("key pressed: " + index);
}

const ArticleCard = ({ index, title, description, link }) => {
  return (
    <Link style={{ textDecoration: "none" }} to={link} target="_blank">
      <div className="article-card">
        <h2 className="article-title">{title}</h2>
        <p className="article-description">{description}</p>
      </div>
    </Link>
  );
};

const HomePage = () => {
  // Example data - replace with your actual article data

  return (
    <div>
      <div className="home-page">
        <h1
          style={{
            marginTop: "60px",
            fontSize: "2.5rem", // Larger font size
            fontWeight: "600", // Semi-bold font weight
            textAlign: "center", // Center align text
            lineHeight: "1.4", // Improved line height for readability
            padding: "20px", // Add padding
            // maxWidth: "800px", // Max width to control line length
            marginLeft: "auto", // Centering the text block
            marginRight: "auto",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)", // Subtle text shadow
            fontFamily: '"Arial", sans-serif', // Font family (can be customized)
            letterSpacing: "1px", // Spacing between letters
          }}
        >
          Exploring the Causes of Depression and Anxiety: Insights and
          Perspectives
        </h1>

        {articles.map((article, index) => (
          <ArticleCard
            key={index}
            index={index}
            title={article.title}
            description={article.description}
            link={article.link}
          />
        ))}
        <h1
          style={{
            marginTop: "60px",
            fontSize: "2.5rem", // Larger font size
            fontWeight: "600", // Semi-bold font weight
            textAlign: "center", // Center align text
            lineHeight: "1.4", // Improved line height for readability
            padding: "20px", // Add padding
            // maxWidth: "800px", // Max width to control line length
            marginLeft: "auto", // Centering the text block
            marginRight: "auto",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)", // Subtle text shadow
            fontFamily: '"Arial", sans-serif', // Font family (can be customized)
            letterSpacing: "1px", // Spacing between letters
          }}
        >
          Valuable insights and advice for individuals looking to heal and
          manage their mental health issues
        </h1>

        {healingMentalHealthArticles.map((article, index) => {
          return (
            <ArticleCard
              key={index}
              index={index}
              title={article.title}
              description={article.description}
              link={article.link}
            />
          );
        })}

        <h1 style={{
            marginTop: "60px",
            fontSize: "2.5rem", // Larger font size
            fontWeight: "600", // Semi-bold font weight
            textAlign: "center", // Center align text
            lineHeight: "1.4", // Improved line height for readability
            padding: "20px", // Add padding
            // maxWidth: "800px", // Max width to control line length
            marginLeft: "auto", // Centering the text block
            marginRight: "auto",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)", // Subtle text shadow
            fontFamily: '"Arial", sans-serif', // Font family (can be customized)
            letterSpacing: "1px", // Spacing between letters
          }}>Self Help Book</h1>
        {novelsForMentalWellness.map((article, index) => {
          return (
            <ArticleCard
              key={index}
              index={index}
              title={article.title}
              description={article.description}
              link={article.link}
            />
          );
        })}
      </div>
    </div>
  );
};

export default HomePage;
