import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

import styles from "./styles/CreatePostForm.module.css";
import { supabase } from "@/pages/index";

const CreatePostForm = ({ user, submit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Submitted:", { title, description, tags });

    try {
      const { data, error } = await supabase
        .from("posts")
        .insert([{ title, description, tag: tags, user_id: user.sub }]);

      if (error) {
        throw error;
      }

      console.log("Post created successfully:", data);
    } catch (error) {
      console.error("Error creating post:", error.message);
    }
    submit();
  };

  return (
    <div className={styles.createPostContainer}>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="description">Description (Markdown supported):</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          {// eslint-disable-next-line 
          }<ReactMarkdown className={styles.markdownPreview} children={description} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="tags">Tags:</label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreatePostForm;
