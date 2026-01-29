import React, { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import pageRoutes from "./routes/pageRoutes";
import Login from "./pages/Login/Login";
import "./App.scss";

const AUTH_STORAGE_KEY = "ai_image_projectWebToken";

// Your ASU SSO URL (keep it exactly as provided)
const ASU_SSO_URL =
  "https://weblogin.asu.edu/cas/login?service=https://auth-main-poc.aiml.asu.edu/app/?aid=g1WGR674bvIeL7bVgfXIAU%26eid=4dbd87b1e0c1eab3434ffee05474e9f5%26redirect=https://ai-image-gen-compare.vercel.app/";

const App = () => {
  const [token, setToken] = useState(null); // projectWebToken
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // On first load, check URL for projectWebToken, then localStorage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get("projectWebToken");

    if (urlToken) {
      // Store it and clean up URL
      localStorage.setItem(AUTH_STORAGE_KEY, urlToken);
      setToken(urlToken);
      // Remove query params from URL (nice UX)
      window.history.replaceState({}, document.title, window.location.pathname);
      toast.success("Login successful");
      setIsCheckingToken(false);
      return;
    }

    // If not in URL, check localStorage
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      setToken(stored);
    }

    setIsCheckingToken(false);
  }, []);

  // Function to start SSO login
  const handleSSOLogin = () => {
    setIsRedirecting(true);
    // Optional toast
    toast.info("Redirecting to ASU Login…");
    // Hard redirect to SSO URL
    window.location.href = ASU_SSO_URL;
  };

  const handleLogout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setToken(null);
    toast.info("Logged out");
  };

  if (isCheckingToken) {
    // Optional: small splash while we check URL/localStorage
    return (
      <>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <p>Loading…</p>
        </div>
        <ToastContainer style={{ zIndex: 99999 }} />
      </>
    );
  }

  const isAuthenticated = !!token;

  return (
    <>
      {!isAuthenticated ? (
        <Login onSSOLogin={handleSSOLogin} isLoggingIn={isRedirecting} />
      ) : (
        <>
          {/* You can pass handleLogout to Header if you want a logout button */}
          <RouterProvider router={pageRoutes} />
        </>
      )}
      <ToastContainer style={{ zIndex: 99999 }} />
    </>
  );
};

export default App;