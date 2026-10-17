import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import EditPostPage from "./pages/EditPostPage";
import PostPage from "./pages/PostPage";
import CategoriesPage from "./pages/CategoriesPage";
import TagsPage from "./pages/TagsPage";
import DraftsPage from "./pages/DraftsPage";
import LoginPage from "./pages/LoginPage";
import { AuthProvider, useAuth } from "./components/AuthContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isAuthLoading } = useAuth();
  if (isAuthLoading) return <div className="p-8 text-center text-default-500">Checking your session…</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

function AppContent() {
  const { isAuthenticated, isAuthLoading, logout, user } = useAuth();
  return <BrowserRouter>
    <NavBar isAuthenticated={isAuthenticated} userProfile={user ? { name: user.name } : undefined} onLogout={logout} />
    <main className="container mx-auto py-6">
      {isAuthLoading ? <div className="px-4 py-2 text-sm text-default-500">Restoring session…</div> : null}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} />
        <Route path="/posts/new" element={<ProtectedRoute><EditPostPage /></ProtectedRoute>} />
        <Route path="/posts/:id" element={<PostPage isAuthenticated={isAuthenticated} currentUserId={user?.id} />} />
        <Route path="/posts/:id/edit" element={<ProtectedRoute><EditPostPage /></ProtectedRoute>} />
        <Route path="/categories" element={<CategoriesPage isAuthenticated={isAuthenticated} />} />
        <Route path="/tags" element={<TagsPage isAuthenticated={isAuthenticated} />} />
        <Route path="/posts/drafts" element={<ProtectedRoute><DraftsPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  </BrowserRouter>;
}

function App() { return <AuthProvider><AppContent /></AuthProvider>; }
export default App;
