import { useEffect, useState } from "react";

import "./App.css";

import "./premium-ui.css";

// =========================================================
// AUTH / PAGES
// =========================================================

import Login from "./pages/Login";
import MfaVerification from "./pages/MfaVerification";
import ForgotPassword from "./pages/ForgotPassword";

// =========================================================
// MAIN PAGES
// =========================================================

import Vault from "./pages/Vault";
import AdminDashboard from "./pages/AdminDashboard";

// =========================================================
// COMPONENTS
// =========================================================

import AppSidebar from "./components/AppSidebar";
import Dashboard from "./components/Dashboard";
import SecurityOverview from "./components/SecurityOverview";

import PasswordHealth from "./components/PasswordHealth";
import Trash from "./components/Trash";
import SharedCredentials from "./components/SharedCredentials";
import SecurityAlerts from "./components/SecurityAlerts";

import PasswordGenerator from "./components/PasswordGenerator";
import LoginActivity from "./components/LoginActivity";

import AdminUsers from "./components/AdminUsers";
import AuditLogs from "./components/AuditLogs";

import Profile from "./components/Profile";
import ChangePassword from "./components/ChangePassword";
import Notifications from "./components/Notifications";
import Devices from "./components/Devices";
import ResetPassword from "./pages/ResetPassword";

// =========================================================
// AUTH CONTEXT
// =========================================================

import { useAuth } from "./context/AuthContext";
import Register from "./pages/Register";


function App() {

  const {
    isAuthenticated,
    login,
    logout,
    isAdmin,
    user,
    loading: authLoading,
  } = useAuth();


  // =========================================================
  // AUTH STATE
  // =========================================================

  const [authStep, setAuthStep] =
    useState("login");

  const [mfaEmail, setMfaEmail] =
    useState("");
  const [oauthMfaEmail, setOauthMfaEmail] =
    useState("");

  const [showForgotPassword, setShowForgotPassword] =
    useState(false);
  const [showRegister, setShowRegister] =
    useState(false);
  const [resetToken, setResetToken] =
    useState("");


  // =========================================================
  // APPLICATION NAVIGATION
  // =========================================================

  const [activeSection, setActiveSection] =
    useState("dashboard");


  // =========================================================
  // AUTH STATE SYNCHRONIZATION
  // =========================================================

  useEffect(() => {

    if (isAuthenticated) {

      setAuthStep("authenticated");
      setShowForgotPassword(false);

    } else {

      setAuthStep("login");
    }

  }, [isAuthenticated]);

  // =========================================================
  // RESET PASSWORD
  // =========================================================

  useEffect(() => {

    const params =
      new URLSearchParams(
        window.location.search
      );

    const token =
      params.get("token");

    if (
      window.location.pathname ===
      "/reset-password"
    ) {

      setResetToken(token || "");

    }

  }, []);

  // =========================================================
  // OAUTH2 MFA
  // =========================================================

  useEffect(() => {

    if (
      window.location.pathname ===
      "/oauth2/mfa"
    ) {

      const params =
        new URLSearchParams(
          window.location.search
        );

      const email =
        params.get("email");

      setOauthMfaEmail(
        email || ""
      );
    }

  }, []);


  // =========================================================
  // MFA
  // =========================================================

  const handleMfaRequired = (email) => {

    setMfaEmail(email);

    setAuthStep("mfa");
  };


  const handleMfaVerified = (token) => {

    login(token);

    setAuthStep("authenticated");
  };

  // =========================================================
  // OAUTH2 MFA
  // =========================================================

  if (
    window.location.pathname ===
    "/oauth2/mfa"
  ) {

    return (
      <MfaVerification
        email={oauthMfaEmail}
        onVerified={(token) => {

          login(token);

          window.history.replaceState(
            {},
            "",
            "/"
          );

          setOauthMfaEmail("");
          setAuthStep("authenticated");
        }}
      />
    );
  }


  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {

    logout();

    setMfaEmail("");

    setAuthStep("login");

    setShowForgotPassword(false);

    setActiveSection("dashboard");
  };


  // =========================================================
  // LOADING
  // =========================================================

  if (authLoading) {

    return (
      <div className="app-loading">

        <div className="loading-brand">
          SecureVault
        </div>

        <span>
          Loading your secure vault...
        </span>

      </div>
    );
  }


  // =========================================================
  // MFA
  // =========================================================

  if (authStep === "mfa") {

    return (
      <MfaVerification
        email={mfaEmail}
        onVerified={handleMfaVerified}
      />
    );
  }


  // =========================================================
  // FORGOT PASSWORD
  // =========================================================

  if (showForgotPassword) {

    return (
      <ForgotPassword
        onBackToLogin={() =>
          setShowForgotPassword(false)
        }
      />
    );
  }

  // =========================================================
  // RESET PASSWORD PAGE
  // =========================================================

  if (
    window.location.pathname ===
    "/reset-password"
  ) {

    return (
      <ResetPassword
        token={resetToken}
        onBackToLogin={() => {

          window.history.replaceState(
            {},
            "",
            "/"
          );

          setResetToken("");

          setAuthStep("login");
        }}
      />
    );
  }


  // =========================================================
  // LOGIN
  // =========================================================
  if (showRegister) {

    return (
      <Register
        onBackToLogin={() =>
          setShowRegister(false)
        }
      />
    );
  }
  if (
    authStep === "login" ||
    !isAuthenticated
  ) {

    return (
      <Login
        onMfaRequired={
          handleMfaRequired
        }
        onForgotPassword={() => {
          setShowForgotPassword(true);
          setShowRegister(false);
        }}
        onRegister={() => {
          setShowRegister(true);
          setShowForgotPassword(false);
        }}
      />
    );
  }


  // =========================================================
  // AUTHENTICATED APPLICATION
  // =========================================================

  return (

    <div className="securevault-app">

      {/* =================================================
                SIDEBAR
            ================================================= */}

      <AppSidebar
        user={user}
        isAdmin={isAdmin}
        activeSection={activeSection}
        onNavigate={setActiveSection}
        onLogout={handleLogout}
      />


      {/* =================================================
                MAIN CONTENT
            ================================================= */}

      <main className="app-main">


        {/* =================================================
                    DASHBOARD
                ================================================= */}

        {activeSection === "dashboard" && (

          <Dashboard
            user={user}
            onNavigate={setActiveSection}
          />

        )}


        {/* =================================================
                    VAULT
                ================================================= */}

        {activeSection === "vault" && (

          <Vault
            isAdmin={isAdmin}

            onGoToAdmin={() =>
              setActiveSection("admin")
            }

            onLogout={handleLogout}
          />

        )}


        {/* =================================================
                    SHARED WITH ME
                ================================================= */}

        {activeSection === "shared" && (

          <div className="section-wrapper">

            <SharedCredentials
              userId={user?.id}
            />

          </div>

        )}


        {/* =================================================
                    PASSWORD GENERATOR
                ================================================= */}

        {activeSection === "generator" && (

          <PasswordGenerator />

        )}


        {/* =================================================
                    PASSWORD HEALTH
                ================================================= */}

        {activeSection === "health" && (

          <div className="section-wrapper">

            <PasswordHealth
              userId={user?.id}
            />

          </div>

        )}


        {/* =================================================
                    TRASH
                ================================================= */}

        {activeSection === "trash" && (

          <div className="section-wrapper">

            <Trash
              userId={user?.id}
            />

          </div>

        )}


        {/* =================================================
                    SECURITY OVERVIEW
                ================================================= */}

        {activeSection === "security" && (

          <SecurityOverview
            isAdmin={isAdmin}
          />

        )}


        {/* =================================================
                    LOGIN ACTIVITY
                ================================================= */}

        {activeSection === "activity" && (

          <LoginActivity />

        )}


        {/* =================================================
                    SECURITY ALERTS
                ================================================= */}

        {activeSection === "alerts" && (

          <div className="section-wrapper">

            <SecurityAlerts />

          </div>

        )}


        {/* =================================================
                    PROFILE
                ================================================= */}

        {activeSection === "profile" && (

          <div className="section-wrapper">

            <Profile />

          </div>

        )}


        {/* =================================================
                    CHANGE PASSWORD
                ================================================= */}

        {activeSection === "change-password" && (

          <div className="section-wrapper">

            <ChangePassword />

          </div>

        )}


        {/* =================================================
                    NOTIFICATIONS
                ================================================= */}

        {activeSection === "notifications" && (

          <div className="section-wrapper">

            <Notifications />

          </div>

        )}


        {/* =================================================
                    DEVICES
                ================================================= */}

        {activeSection === "devices" && (

          <div className="section-wrapper">

            <Devices />

          </div>

        )}


        {/* =================================================
                    ADMIN DASHBOARD
                ================================================= */}

        {isAdmin &&
          activeSection === "admin" && (

            <AdminDashboard
              onNavigate={
                setActiveSection
              }
            />

          )}


        {/* =================================================
                    USER MANAGEMENT
                ================================================= */}

        {isAdmin &&
          activeSection === "users" && (

            <AdminUsers />

          )}


        {/* =================================================
                    AUDIT LOGS
                ================================================= */}

        {isAdmin &&
          activeSection === "audit" && (

            <AuditLogs />

          )}

      </main>

    </div>
  );
}

export default App;