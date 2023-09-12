import React, { useEffect, useState } from "react";
import useModalHook from "../components/modalHook";

export default function BlogsList() {
  const [list, setList] = useState(null);
  const { openModal, closeModal, Modal } = useModalHook();
  const [selectedBlog, setSelectedBlog] = useState(null);
  const fetchFirst = () => {
    fetch("http://localhost:8000/blog-list")
      .then((response) => response.json())
      .then((data) => {
        setList(data);
      })
      .catch((error) => {
        console.error("Error saving blog:", error);
      });
  };

  useEffect(() => {
    fetchFirst();
  }, []);

  return (
    <div>
      <Modal >
        <div style={{ backgroundColor: "#fff", padding: 20 }} className="modall">
          {selectedBlog && (
            <>
              <h1>{selectedBlog?.title}</h1>
              <div>
                <div
                  dangerouslySetInnerHTML={{ __html: selectedBlog?.content }}
                />
              </div>
            </>
          )}
          <div>
            <button onClick={closeModal} className="saveblog">Close</button>
          </div>
        </div>
      </Modal>
      {/* <h1 className="allblogs">All Blogs</h1> */}
      {list?.map((blog, idx) => {
        return (
          <div className="carddiv ">
          <div >
            <h4 className="blott">
              {idx + 1}.) {blog?.title}
              <button
              className="btnview"
                onClick={() => {
                  setSelectedBlog(blog);
                  openModal();
                }}
                style={{ marginLeft: 14 }}
              >
                View
              </button>
            </h4>
          </div>
          </div>
        );
      })}
    </div>
  );
}
