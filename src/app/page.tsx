"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { TriangleAlert } from "lucide-react";

import { BrandingPanel } from "@/components/auth/BrandingPanel";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { AdminLoginForm } from "@/components/auth/AdminLoginForm";

import { authService } from "@/services/auth.service";

type AuthMode = "user-login" | "admin-login" | "register";

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>("user-login");
  const [error, setError] = useState("");
  const router = useRouter();

  // Unified Login Handler
  const performLogin = async (payload: any) => {
    try {
      const data = await authService.login(payload);

      // Check success flag as per API requirement
      if (!data.success) {
        throw new Error(data.message || "Login failed");
      }

      const user = data.data.user;
      const roles = user.roles || [];
      const isAdmin = roles.includes("Admin");
      const roleName = isAdmin ? "admin" : "user";

      // LocalStorage is handled here for role/user details, 
      // Token is not auto-saved by clientWrapper unless we explicitly do it here or in service.
      // It's safer to do it here where we parse the response structure.
      localStorage.setItem("userRole", roleName);
      localStorage.setItem("userName", user.username);
      localStorage.setItem("userEmail", user.username + "@arffy.tech");
      localStorage.setItem("authToken", data.data.token.accessToken);

      router.push("/dashboard");

    } catch (err: any) {
      console.error("Login Error:", err);
      setError(err.message || "Failed to connect to server");
    }
  };

  const handleUserLogin = (data: any) => {
    setError("");
    // Mapping email field to username as per UI design choice vs API need
    const payload = { username: data.email, password: data.password };
    performLogin(payload);
  };

  const handleAdminLogin = (data: any) => {
    setError("");
    const payload = { username: data.adminId, password: data.passkey };
    performLogin(payload);
  };

  const handleRegister = async (data: any) => {
    setError("");
    try {
      const res = await authService.register({
        username: data.username,
        password: data.password,
        email: data.email
      });

      // Assuming success if no error thrown by client wrapper
      alert("Registration Successful! Please sign in.");
      setMode("user-login");

    } catch (err: any) {
      console.error("Register Error:", err);
      setError(err.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#030712] text-white flex overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[120px] rounded-full" />
      </div>

      <BrandingPanel />

      {/* Right Panel - Auth Forms */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 w-full max-w-lg mx-auto lg:max-w-none">
        {/* Mobile Branding (Visible only on small screens) */}
        <div className="lg:hidden mb-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            Arffy Technologies
          </h2>
          <p className="text-indigo-400 font-medium">Cluster Monitor</p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="bg-slate-950/50 backdrop-blur-xl border border-slate-800/60 p-8 rounded-3xl shadow-2xl shadow-indigo-500/5">
            {/* Tabs */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-900/50 rounded-xl mb-8">
              <button
                onClick={() => { setMode("user-login"); setError(""); }}
                className={`text-sm font-medium py-2 rounded-lg transition-all ${mode === "user-login"
                  ? "bg-slate-800 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
                  }`}
              >
                User
              </button>
              <button
                onClick={() => { setMode("register"); setError(""); }}
                className={`text-sm font-medium py-2 rounded-lg transition-all ${mode === "register"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
                  }`}
              >
                Register
              </button>
              <button
                onClick={() => { setMode("admin-login"); setError(""); }}
                className={`text-sm font-medium py-2 rounded-lg transition-all ${mode === "admin-login"
                  ? "bg-red-500/10 text-red-500 border border-red-500/20"
                  : "text-slate-400 hover:text-slate-200"
                  }`}
              >
                Admin
              </button>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mb-4"
                >
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                    <TriangleAlert size={16} />
                    {error}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Forms Area */}
            <AnimatePresence mode="wait">
              {mode === "user-login" && (
                <LoginForm onSubmit={handleUserLogin} />
              )}

              {mode === "register" && (
                <RegisterForm onSubmit={handleRegister} />
              )}

              {mode === "admin-login" && (
                <AdminLoginForm onSubmit={handleAdminLogin} />
              )}
            </AnimatePresence>
          </div>

          <p className="text-center text-slate-500 text-xs mt-6">
            &copy; 2024 Arffy Technologies. Secure System.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
