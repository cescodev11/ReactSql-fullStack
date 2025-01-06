import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Replacing useHistory
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { AuthContext } from "../helpers/AuthContext";

function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate(); // Use navigate instead of history

  useEffect(() => {
    if (!authState.status) {
      navigate("/login"); // Replacing history.push with navigate
    } else {
      axios
        .get("http://localhost:3001/posts", {
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then((response) => {
          setListOfPosts(response.data.listOfPosts || []);
          setLikedPosts(
            response.data.likedPosts?.map((like) => like.PostId) || []
          );
        });
    }
  }, [authState.status, navigate]);

  const likeAPost = (postId) => {
    axios
      .post(
        "http://localhost:3001/likes",
        { PostId: postId },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      )
      .then((response) => {
        setListOfPosts(
          listOfPosts.map((post) => {
            if (post.id === postId) {
              if (response.data.liked) {
                return { ...post, Likes: [...post.Likes, 0] };
              } else {
                const likesArray = post.Likes;
                likesArray.pop();
                return { ...post, Likes: likesArray };
              }
            }
            return post;
          })
        );

        if (likedPosts.includes(postId)) {
          setLikedPosts(likedPosts.filter((id) => id !== postId));
        } else {
          setLikedPosts([...likedPosts, postId]);
        }
      });
  };

  return (
    <div>
      {listOfPosts.map((value, key) => (
        <div key={key} className="post">
          <div className="title">{value.title}</div>
          <div
            className="body"
            onClick={() => navigate(`/post/${value.id}`)} // Replacing history.push
          >
            {value.postText}
          </div>
          <div className="footer">
            <div className="username">{value.username}</div>
            <div className="buttons">
              <ThumbUpIcon
                onClick={() => likeAPost(value.id)}
                className={
                  likedPosts.includes(value.id) ? "unlikeBttn" : "likeBttn"
                }
              />
              <label>{value.Likes?.length || 0}</label>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Home;
