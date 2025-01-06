import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";

function Post() {
  const { id } = useParams();
  const [postObject, setPostObject] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const postResponse = await axios.get(`http://localhost:3001/posts/byId/${id}`);
        setPostObject(postResponse.data);

        const commentsResponse = await axios.get(`http://localhost:3001/comments/${id}`);
        setComments(commentsResponse.data);
      } catch (error) {
        console.error("Error fetching post data:", error);
      }
    };

    fetchPostData();
  }, [id]);

  const addComment = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/comments",
        {
          commentBody: newComment,
          PostId: id,
        },
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      );

      if (response.data.error) {
        console.log(response.data.error);
      } else {
        const commentToAdd = {
          commentBody: newComment,
          username: response.data.username,
        };
        setComments((prevComments) => [...prevComments, commentToAdd]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:3001/comments/${commentId}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      });
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== commentId)
      );
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div className="postPage">
      <div className="leftSide">
        <div className="post" id="individual">
          <div className="title">{postObject.title}</div>
          <div className="body">{postObject.postText}</div>
          <div className="footer">{postObject.username}</div>
        </div>
      </div>
      <div className="rightSide">
        <div className="addCommentContainer">
          <input
            type="text"
            placeholder="Comment..."
            autoComplete="off"
            value={newComment}
            onChange={(event) => setNewComment(event.target.value)}
          />
          <button onClick={addComment}>Add Comment</button>
        </div>
        <div className="listOfComments">
          {comments.map((comment) => (
            <div key={comment.id} className="comment">
              {comment.commentBody}
              <label> Username: {comment.username}</label>
              {authState.username === comment.username && (
                <button onClick={() => deleteComment(comment.id)}>X</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Post;
