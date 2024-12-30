import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { Button } from "@mui/material";
import { Auth } from "./components/Auth";
import { db, auth } from "../config/firebase";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";

function App() {
  const [promptList, setPromptList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState({});
  const [deleteError, setDeleteError] = useState(null);

  // Edit states
  const [editingId, setEditingId] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    category: "",
    isVisible: false,
  });

  // New Prompts State
  const [newPromptTitle, setNewPromptTitle] = useState("");
  const [newPromptDescription, setNewPromptDescription] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newVisibilityModel, setNewVisibilityModel] = useState(false);

  // Create a reference to the prompts collection at component level
  const promptsCollectionRef = collection(db, "prompts");

  useEffect(() => {
    console.log("Effect running");

    const getPromptsList = async () => {
      try {
        console.log("Fetching prompts...");
        const data = await getDocs(promptsCollectionRef);
        console.log("Raw data:", data);

        if (!data.docs) {
          console.log("No docs found in data");
          return;
        }

        const filteredData = data.docs.map((doc) => {
          const docData = doc.data();
          console.log("Document data:", docData);
          return {
            ...docData,
            id: doc.id,
          };
        });

        console.log("Setting promptList with:", filteredData);
        setPromptList(filteredData);
      } catch (err) {
        console.error("Error in getPromptsList:", err);
        setError("Failed to fetch prompts");
      }
    };

    getPromptsList();

    return () => {
      console.log("Effect cleanup");
    };
  }, []);

  const onSubmitAddPrompt = async () => {
    if (!newPromptTitle || !newPromptDescription) {
      alert("Please fill in title and description");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error("Must be logged in to create prompts");
      }

      await addDoc(promptsCollectionRef, {
        title: newPromptTitle,
        description: newPromptDescription,
        category: newCategory,
        isVisible: newVisibilityModel,
        authorId: currentUser.uid,
        createdAt: new Date().toISOString(),
      });

      // Clear form
      setNewPromptTitle("");
      setNewPromptDescription("");
      setNewCategory("");
      setNewVisibilityModel(false);

      // Refresh the list
      const newData = await getDocs(promptsCollectionRef);
      const newFilteredData = newData.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setPromptList(newFilteredData);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to add prompt");
    } finally {
      setLoading(false);
    }
  };

  const deletePrompt = async (id) => {
    try {
      setDeleteLoading((prev) => ({ ...prev, [id]: true }));
      setDeleteError(null);

      // Check if user is authenticated
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("You must be logged in to delete prompts");
      }

      // Get the prompt document to check ownership
      const promptDoc = doc(db, "prompts", id);
      const promptSnapshot = await getDoc(promptDoc);

      // Verify the user owns this prompt
      if (
        promptSnapshot.exists() &&
        promptSnapshot.data().authorId !== currentUser.uid
      ) {
        throw new Error("You can only delete your own prompts");
      }

      // Delete the document
      await deleteDoc(promptDoc);

      // Update local state to remove the deleted prompt
      setPromptList((prevList) =>
        prevList.filter((prompt) => prompt.id !== id)
      );
    } catch (err) {
      console.error("Error deleting prompt:", err);
      setDeleteError(err.message || "Failed to delete prompt");
    } finally {
      setDeleteLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const startEditing = (prompt) => {
    setEditingId(prompt.id);
    setEditForm({
      title: prompt.title,
      description: prompt.description,
      category: prompt.category || "",
      isVisible: prompt.isVisible || false,
    });
    setEditError(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({
      title: "",
      description: "",
      category: "",
      isVisible: false,
    });
    setEditError(null);
  };

  const handleEditSubmit = async (id) => {
    if (!editForm.title || !editForm.description) {
      setEditError("Title and description are required");
      return;
    }

    try {
      setEditLoading(true);
      setEditError(null);

      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("Must be logged in to edit prompts");
      }

      const promptDoc = doc(db, "prompts", id);
      const promptSnapshot = await getDoc(promptDoc);

      if (!promptSnapshot.exists()) {
        throw new Error("Prompt not found");
      }

      if (promptSnapshot.data().authorId !== currentUser.uid) {
        throw new Error("You can only edit your own prompts");
      }

      await updateDoc(promptDoc, {
        title: editForm.title,
        description: editForm.description,
        category: editForm.category,
        isVisible: editForm.isVisible,
        updatedAt: new Date().toISOString(),
      });

      // Update local state
      setPromptList((prevList) =>
        prevList.map((prompt) =>
          prompt.id === id
            ? {
                ...prompt,
                ...editForm,
                updatedAt: new Date().toISOString(),
              }
            : prompt
        )
      );

      // Clear edit mode
      cancelEditing();
    } catch (err) {
      console.error("Error editing prompt:", err);
      setEditError(err.message || "Failed to edit prompt");
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <>
      {/* <Auth />
      <br />
      <br />
      <div>
        <input
          placeholder="Category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <input
          placeholder="Prompt Title"
          value={newPromptTitle}
          onChange={(e) => setNewPromptTitle(e.target.value)}
        />
        <input
          placeholder="Prompt Description"
          value={newPromptDescription}
          onChange={(e) => setNewPromptDescription(e.target.value)}
        />
        <input
          type="checkbox"
          checked={newVisibilityModel}
          onChange={(e) => setNewVisibilityModel(e.target.checked)}
        />
        <label>Public</label>
        <button onClick={onSubmitAddPrompt} disabled={loading}>
          {loading ? "Adding..." : "Add Prompt"}
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {deleteError && <p style={{ color: "red" }}>{deleteError}</p>}
      {editError && <p style={{ color: "red" }}>{editError}</p>}

      <div>
        {promptList?.map((prompt) => (
          <div key={prompt?.id || "fallback-key"}>
            {editingId === prompt.id ? (
              // Edit form
              <div>
                <input
                  placeholder="Title"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                />
                <input
                  placeholder="Description"
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
                <input
                  placeholder="Category"
                  value={editForm.category}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                />
                <input
                  type="checkbox"
                  checked={editForm.isVisible}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      isVisible: e.target.checked,
                    }))
                  }
                />
                <label>Public</label>
                <button
                  onClick={() => handleEditSubmit(prompt.id)}
                  disabled={editLoading}
                >
                  {editLoading ? "Saving..." : "Save"}
                </button>
                <button onClick={cancelEditing} disabled={editLoading}>
                  Cancel
                </button>
              </div>
            ) : (
              // Display mode
              <>
                <h3>{prompt?.title}</h3>
                <p>{prompt?.description}</p>
                {prompt.category && <p>Category: {prompt.category}</p>}
                <button onClick={() => startEditing(prompt)}>Edit</button>
                <button
                  onClick={() => deletePrompt(prompt.id)}
                  disabled={deleteLoading[prompt.id]}
                >
                  {deleteLoading[prompt.id] ? "Deleting..." : "Delete Prompt"}
                </button>
              </>
            )}
          </div>
        ))}
      </div> */}
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
