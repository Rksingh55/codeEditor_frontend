import React, { useState } from "react";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { serverURI } from "./const";
import { toast } from "react-toastify";
import "./style.css";
import FileInputWithPreview from "./image-picker-views";
export const EditorCode = ({ changeScreen }) => {
  const [title, setTitle] = useState("");
  const [bannerFile, setBannerFile] = useState(null);
  const [tags, setTags] = useState({ list: [], text: "" });
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [responseMessage, setResponseMessage] = useState("");

  const saveBlog = async () => {
    try {
      const blog = draftToHtml(convertToRaw(editorState.getCurrentContent()));
      if (title.length <= 0 || tags.list?.length <= 0 || !blog) {
        return window.alert("Enter Valid Fields!");
      }
      const {
        data: { link: bannerLink },
      } = await uploadImageCallback(bannerFile);
      const toSave = {
        title,
        tagList: tags.list,
        blog: blog,
        bannerLink,
      };

      fetch(`${serverURI}/blogs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(toSave),
      })
        .then((response) => response.json())
        .then((data) => {
          window.alert("Blog Saved Successfully!");
          setTitle("");
          setTags({ list: [], text: "" });
          setEditorState(EditorState.createEmpty());
        })
        .catch((error) => {
          window.alert("Error: Check Your Internet Connection!");
          setResponseMessage("Error saving the blog");
        });
    } catch (error) {
      toast("Error Check Internet Connection!");
    }
  };

  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
  };
  const uploadImageCallback = (selectedImage) => {
    return new Promise(async (resolve, reject) => {
      if (!selectedImage) {
        toast("No image selected!");
        reject("No image selected");
        return;
      }

      if (selectedImage.size > 150 * 1024) {
        toast("Image size exceeds 150 KB");
        reject("Image size exceeds 150 KB");
        return;
      }

      if (selectedImage.type !== "image/webp") {
        toast("Invalid image format. Only webP files are allowed.");
        reject("Invalid image format. Only webP files are allowed.");
        return;
      }

      try {
        const formData = new FormData();
        formData.append("image", selectedImage);
        const response = await fetch(`${serverURI}/upload-image`, {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          resolve({
            data: {
              link: data.data.link,
            },
          });
        } else {
          reject("error");
        }
      } catch (error) {
        reject("error");
      }
    });
  };
  return (
    <>
      <br />
      <Editor
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        wrapperStyle={{}}
        onEditorStateChange={onEditorStateChange}
        toolbar={{
          image: {
            // className: undefined,
            // component: undefined,
            // popupClassName: undefined,
            urlEnabled: true,
            uploadEnabled: true,
            alignmentEnabled: true,
            uploadCallback: uploadImageCallback,
            previewImage: true,
            inputAccept: "image/webp",
            alt: { present: true, mandatory: true },
            defaultSize: {
              height: "auto",
              width: "auto",
            },
          },
        }}
      />
      <input
        className="inputdata"
        style={{ width: "80%" }}
        value={title}
        placeholder="Title"
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />

      <FileInputWithPreview
        getFile={(file) => {
          setBannerFile(file);
        }}
      />
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        {tags.list?.map((tag, index) => (
          <div style={{ margin: "5px" }} key={index}>
            <p>{tag}</p>
            <button
              className="saveblog"
              onClick={() => {
                setTags((prevTags) => ({
                  ...prevTags,
                  list: prevTags.list.filter((_, i) => i !== index),
                }));
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      <div>
        <input
          className="inputdata"
          style={{ width: "30%" }}
          value={tags.text}
          placeholder="Tags"
          onChange={(e) => {
            setTags((prevTags) => ({ ...prevTags, text: e.target.value }));
          }}
        />
        <button
          style={{ margin: "5px" }}
          className="saveblog"
          onClick={() => {
            setTags((prevTags) => ({
              ...prevTags,
              list: [...prevTags.list, prevTags.text],
              text: "",
            }));
          }}
        >
          Save
        </button>
      </div>

      <button style={{ margin: "5px" }} onClick={saveBlog} className="saveblog">
        Save Blog
      </button>
      <h1>{responseMessage}</h1>
    </>
  );
};
