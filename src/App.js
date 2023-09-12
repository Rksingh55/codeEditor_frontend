import React, { useState } from "react";
import { EditorCode } from "./Editor";
import BlogsList from "./screens/blog-list";
import { ToastContainer } from "react-toastify";
import "./style.css";
function App() {
  const [currentScreen, setCurrentScreen] = useState("all-blog");
  return (
    <div className="App">
      <div
        style={{
          backgroundColor: "rgb(255,193,0)",
          display: "flex",
          gap: 12,
          alignItems: "center",
          justifyContent: "center",
          borderBottom: "3px dotted red",
        }}
      >
        <p
          className="headerbtn"
          onClick={() => {
            setCurrentScreen("all-blog");
          }}
          style={{
            ...(currentScreen === "all-blog"
              ? { border: "1px solid #000" }
              : {}),
            padding: "6px 20px",
          }}
        >
          All Blogs
        </p>
        <p
          className="headerbtn"
          style={{
            ...(currentScreen === "create-blog"
              ? { border: "1px solid #000" }
              : {}),
            padding: "6px 20px",
          }}
          onClick={() => {
            setCurrentScreen("create-blog");
          }}
        >
          Create Blog
        </p>
      </div>

      {currentScreen === "all-blog" && (
        <div>
          <BlogsList />
        </div>
      )}
      {currentScreen === "create-blog" && (
        <div>
          <EditorCode />
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default App;
