import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
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
import MainPage from "./pages/MainPage";
// import PromptsPage from "./pages/PromptsPage";
// import AiToolsPage from "./pages/AiToolsPage";
const PromptsPage = lazy(() => import("./pages/PromptsPage"));
const AiToolsPage = lazy(() => import("./pages/AiToolsPage"));
import PromptDetail from "./pages/PromptDetails";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
// import AddPromptPage from "./pages/AddPromptPage";

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
    const getPromptsList = async () => {
      try {
        const data = await getDocs(promptsCollectionRef);

        if (!data.docs) {
          return;
        }

        const filteredData = data.docs.map((doc) => {
          const docData = doc.data();

          return {
            ...docData,
            id: doc.id,
          };
        });

        setPromptList(filteredData);
      } catch (err) {
        console.error("Error in getPromptsList:", err);
        setError("Failed to fetch prompts");
      }
    };

    getPromptsList();

    return () => {};
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
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/main" element={<MainPage />}>
            {/* <Route path="prompts" element={<PromptsPage />} /> */}
            <Route
              path="prompts"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <PromptsPage />
                </Suspense>
              }
            />
            <Route path="prompts/:id" element={<PromptDetail />} />

            {/* <Route path="ai-tools" element={<AiToolsPage />} /> */}
            <Route
              path="ai-tools"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <AiToolsPage />
                </Suspense>
              }
            />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
