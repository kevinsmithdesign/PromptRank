import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Typography } from "@mui/material";

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
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import CreateBlogPostPage from "./pages/CreateBlogPostPage";
import EditBlogPostPage from "./pages/EditBlogPostPage";

// Lazy-loaded components
const PromptsPage = lazy(() => import("./pages/PromptsPage"));
const AiToolsPage = lazy(() => import("./pages/AiToolsPage"));
const TutorialsPage = lazy(() => import("./pages/TutorialsPage"));
const CompareToolsPage = lazy(() => import("./pages/CompareToolsPage"));

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
            <Route
              path="compare-tools"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <CompareToolsPage />
                </Suspense>
              }
            />
            <Route
              path="tutorials"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <TutorialsPage />
                </Suspense>
              }
            />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="collections/:id" element={<CollectionDetailsPage />} />
            <Route path="blog" element={<BlogPage />} />
            <Route path="blog/create" element={<CreateBlogPostPage />} />
            <Route path="blog/edit/:id" element={<EditBlogPostPage />} />
            <Route path="blog/:id" element={<BlogPostPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </Router>
      <footer>
        <Typography
          variant="body2"
          color="white"
          align="center"
          sx={{ mt: 4, py: 2 }}
        >
          © {new Date().getFullYear()} Prompt Rank. All rights reserved.
        </Typography>
      </footer>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
