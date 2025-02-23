import React, { useContext, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Updated for React Router v6
import { AuthContext } from "../helpers/AuthContext";

function CreatePost() {
  const { authState } = useContext(AuthContext);

  const navigate = useNavigate(); // Using useNavigate for navigation in React Router v6

  const initialValues = {
    title: "",
    postText: "",
  };

  useEffect(() => {
    if (!authState.status) {
      navigate("/login");
    }
  }, []);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("You must input a Title!"),
    postText: Yup.string().required("You must input some text for your post!"),
  });

  const onSubmit = (data) => {
    axios
      .post("http://localhost:3001/posts", data, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        navigate("/"); // Using navigate to route to home page after post creation
      });
  };

  return (
    <div className="createPostPage">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="formContainer">
          <div>
            <label>Title: </label>
            <ErrorMessage name="title" component="span" />
            <Field
              autoComplete="off"
              id="inputCreatePost"
              name="title"
              placeholder="(Ex. Title...)"
            />
          </div>

          <div>
            <label>Post: </label>
            <ErrorMessage name="postText" component="span" />
            <Field
              autoComplete="off"
              id="inputCreatePost"
              name="postText"
              placeholder="(Ex. Post...)"
            />
          </div>

          <button type="submit">Create Post</button>
        </Form>
      </Formik>
    </div>
  );
}

export default CreatePost;
