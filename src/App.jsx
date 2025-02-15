// import { useState, useEffect } from "react";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import { lazy, Suspense } from "react";
// import "./App.css";
// import { db, auth } from "../config/firebase";
// import {
//   getDocs,
//   collection,
//   doc,
//   getDoc,
//   updateDoc,
// } from "firebase/firestore";
// import LandingPage from "./pages/LandingPage";
// import LoginPage from "./pages/LoginPage";
// import SignUpPage from "./pages/SignUpPage";
// import MainPage from "./pages/MainPage";
// const PromptsPage = lazy(() => import("./pages/PromptsPage"));
// const AiToolsPage = lazy(() => import("./pages/AiToolsPage"));
// import PromptDetail from "./pages/PromptDetails";
// import ProfilePage from "./pages/ProfilePage";
// import SettingsPage from "./pages/SettingsPage";

// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
//       cacheTime: 1000 * 60 * 30, // Keep unused data in cache for 30 minutes
//     },
//   },
// });

// function App() {
//   const [promptList, setPromptList] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [deleteLoading, setDeleteLoading] = useState({});
//   const [deleteError, setDeleteError] = useState(null);

//   // Edit states
//   const [editingId, setEditingId] = useState(null);
//   const [editLoading, setEditLoading] = useState(false);
//   const [editError, setEditError] = useState(null);
//   const [editForm, setEditForm] = useState({
//     title: "",
//     description: "",
//     category: "",
//     isVisible: false,
//   });

//   // Create a reference to the prompts collection at component level
//   const promptsCollectionRef = collection(db, "prompts");

//   useEffect(() => {
//     const getPromptsList = async () => {
//       try {
//         const data = await getDocs(promptsCollectionRef);

//         if (!data.docs) {
//           return;
//         }

//         const filteredData = data.docs.map((doc) => {
//           const docData = doc.data();

//           return {
//             ...docData,
//             id: doc.id,
//           };
//         });

//         setPromptList(filteredData);
//       } catch (err) {
//         console.error("Error in getPromptsList:", err);
//         setError("Failed to fetch prompts");
//       }
//     };

//     getPromptsList();

//     return () => {};
//   }, []);

//   const cancelEditing = () => {
//     setEditingId(null);
//     setEditForm({
//       title: "",
//       description: "",
//       category: "",
//       isVisible: false,
//     });
//     setEditError(null);
//   };

//   const handleEditSubmit = async (id) => {
//     if (!editForm.title || !editForm.description) {
//       setEditError("Title and description are required");
//       return;
//     }

//     try {
//       setEditLoading(true);
//       setEditError(null);

//       const currentUser = auth.currentUser;
//       if (!currentUser) {
//         throw new Error("Must be logged in to edit prompts");
//       }

//       const promptDoc = doc(db, "prompts", id);
//       const promptSnapshot = await getDoc(promptDoc);

//       if (!promptSnapshot.exists()) {
//         throw new Error("Prompt not found");
//       }

//       if (promptSnapshot.data().authorId !== currentUser.uid) {
//         throw new Error("You can only edit your own prompts");
//       }

//       await updateDoc(promptDoc, {
//         title: editForm.title,
//         description: editForm.description,
//         category: editForm.category,
//         isVisible: editForm.isVisible,
//         updatedAt: new Date().toISOString(),
//       });

//       // Update local state
//       setPromptList((prevList) =>
//         prevList.map((prompt) =>
//           prompt.id === id
//             ? {
//                 ...prompt,
//                 ...editForm,
//                 updatedAt: new Date().toISOString(),
//               }
//             : prompt
//         )
//       );

//       // Clear edit mode
//       cancelEditing();
//     } catch (err) {
//       console.error("Error editing prompt:", err);
//       setEditError(err.message || "Failed to edit prompt");
//     } finally {
//       setEditLoading(false);
//     }
//   };

//   return (
//     <QueryClientProvider client={queryClient}>
//       <Router>
//         <Routes>
//           {/* <Route path="/" element={<LandingPage />} /> */}
//           <Route path="/" element={<Navigate to="/main/prompts" replace />} />
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/signup" element={<SignUpPage />} />
//           <Route path="/main" element={<MainPage />}>
//             <Route
//               path="prompts"
//               element={
//                 <Suspense fallback={<div>Loading...</div>}>
//                   <PromptsPage />
//                 </Suspense>
//               }
//             />
//             <Route path="prompts/:id" element={<PromptDetail />} />
//             <Route
//               path="ai-tools"
//               element={
//                 <Suspense fallback={<div>Loading...</div>}>
//                   <AiToolsPage />
//                 </Suspense>
//               }
//             />
//             <Route path="profile" element={<ProfilePage />} />
//             <Route path="settings" element={<SettingsPage />} />
//           </Route>
//         </Routes>
//       </Router>
//     </QueryClientProvider>
//   );
// }

// export default App;

import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";

// Import pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import MainPage from "./pages/MainPage";
import PromptDetail from "./pages/PromptDetails";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import CollectionDetailsPage from "./pages/CollectionDetailsPage";

// Lazy-loaded components
const PromptsPage = lazy(() => import("./pages/PromptsPage"));
const AiToolsPage = lazy(() => import("./pages/AiToolsPage"));

// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data considered fresh for 5 minutes
      cacheTime: 1000 * 60 * 30, // Keep unused data in cache for 30 minutes
      retry: 2, // Retry failed requests 2 times
      refetchOnWindowFocus: true, // Refetch when window regains focus
      refetchOnReconnect: true, // Refetch when reconnecting
    },
    mutations: {
      retry: 2, // Retry failed mutations 2 times
    },
  },
});

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-full">
    <div>Loading...</div>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* <Route path="/" element={<LandingPage />} /> */}
          <Route path="/" element={<Navigate to="/main/prompts" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/main" element={<MainPage />}>
            <Route
              path="prompts"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <PromptsPage />
                </Suspense>
              }
            />
            <Route path="prompts/:id" element={<PromptDetail />} />
            <Route
              path="ai-tools"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <AiToolsPage />
                </Suspense>
              }
            />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="collections/:id" element={<CollectionDetailsPage />} />

            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
