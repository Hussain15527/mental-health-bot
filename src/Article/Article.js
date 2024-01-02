import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import "./Article.css";
import "./ArticleCard.css"; // Assuming you have a CSS file for styling
import { Link } from "react-router-dom";
import { articles, healingMentalHealthArticles } from "../Article/ArticleData";
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
        <h1>how to help depression</h1>

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
            marginTop: 60,
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
      </div>
    </div>
  );
};

export default HomePage;
