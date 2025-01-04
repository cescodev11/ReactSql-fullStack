import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const navigate = useNavigate();

  // Fetching posts on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:3001/posts");
        setListOfPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);

  // Handling the like/unlike functionality
  const likeAPost = async (postId) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/likes",
        { PostId: postId },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      );

      // Updating the state based on the like status
      setListOfPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                Likes: response.data.liked
                  ? [...post.Likes, 0]
                  : post.Likes.slice(0, post.Likes.length - 1),
              }
            : post
        )
      );
    } catch (error) {
      console.error("Error liking the post:", error);
    }
  };

  return (
    <div>
      {listOfPosts.map((post) => (
        <div key={post.id} className="post">
          <div className="title">{post.title}</div>
          <div
            className="body"
            onClick={() => {
              navigate(`/post/${post.id}`);
            }}
          >
            {post.postText}
          </div>
          <div className="footer">
            {post.username}{" "}
            <button onClick={() => likeAPost(post.id)}>Like</button>
            <label>{post.Likes.length}</label>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Home;
