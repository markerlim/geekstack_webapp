import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import BottomNav from "../components/BottomNav";
import { Box, TextField } from "@mui/material";
import NavbarPrompt from "../components/NavbarPromptLogin";
import Sidebar from "../components/Sidebar";
import { db } from "../Firebase";
import { useAuth } from "../context/AuthContext";

const NotificationsPage = () => {
  const { currentUser } = useAuth(); // Access current user
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    try {
      // Query the collection for documents where uid matches currentUser.uid
      const q = query(
        collection(db, "uniondecklist"),
        where("uid", "==", currentUser.uid) // Filter by matching uid
      );
      const querySnapshot = await getDocs(q);

      // Extract the comments field from each document
      const commentsList = querySnapshot.docs.flatMap((doc) => {
        const data = doc.data();
        // Check if the document has a "comments" field and that it is an array
        return Array.isArray(data.comments) ? data.comments : [];
      });

      setComments(commentsList);
    } catch (error) {
      console.error("Error fetching comments: ", error);
    }
  };



  useEffect(() => {
    if (currentUser) {
      fetchComments();
    }
  }, [currentUser]); // Fetch comments when currentUser changes

  return (
    <div>
      <Box color={"#f2f3f8"}>
        <NavbarPrompt />
        <Box>
          <Box sx={{ display: { xs: "none", sm: "none", md: "block" } }}>
            <Sidebar />
          </Box>
          <Box
            sx={{
              marginLeft: { xs: "0px", sm: "0px", md: "100px" },
              position: "relative",
              paddingLeft: "15px",
              paddingRight: "15px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              height: "calc(100vh - 74px)",
            }}
            overflowY={"auto"}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "0px",
                justifyContent: "center",
                alignItems: 'center'
              }}
            >
              <Box
                sx={{
                  fontSize: "20px",
                  paddingTop: "20px",
                  paddingBottom: "20px",
                  textAlign: "center",
                }}
              >
                Notifications
              </Box>
              {comments.length > 0 ? (
                comments.map((comment, index) => (
                  <div key={index}>
                    <p><strong>User:</strong> {comment.uid || "Unknown User"}</p> 
                    <p><strong>Comment:</strong> {comment.text || "No comment text available"}</p> 
                    {comment.timestamp && (
                      <p><strong>Date:</strong> {new Date(comment.timestamp.seconds * 1000).toLocaleString()}</p>
                    )}
                  </div>
                ))
              ) : (
                <p>No comments found.</p>
              )}
            </Box>
            <div style={{ height: "1px", padding: "20px" }}>
              <br />
            </div>
          </Box>
          <Box sx={{ display: { sm: "block", md: "none" } }}>
            <BottomNav />
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default NotificationsPage;
