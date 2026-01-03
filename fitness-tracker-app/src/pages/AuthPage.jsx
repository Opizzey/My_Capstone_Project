import React, { useState } from "react";
import { auth, googleProvider, isFirebaseConfigured, missingFirebaseKeys } from "../firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { Card } from '../components/Card';

export default function AuthPage({ onAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Email and password required");
      return;
    }

    if (isLogin) {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || user.email !== form.email || user.password !== form.password) {
        setError("Invalid credentials");
        return;
      }
      onAuth && onAuth(user);
    } else {
      localStorage.setItem("user", JSON.stringify(form));
      onAuth && onAuth(form);
    }
  }

  async function handleGoogleSignIn() {
    setError("");
    if (!isFirebaseConfigured || !auth || !googleProvider) {
      // Demo fallback when Firebase isn't configured
      const demoUser = { email: "demo.user@local", displayName: "Demo User", uid: "demo-uid" };
      onAuth && onAuth(demoUser);
      setError("Using demo sign-in (Firebase not configured). Add keys to enable real Google auth.");
      return;
    }
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      onAuth && onAuth({ email: user.email, displayName: user.displayName, uid: user.uid });
    } catch (err) {
      const msg = err?.code ? `${err.code}: ${err.message || "Google sign-in failed"}` : (err?.message || "Google sign-in failed");
      setError(msg);
    }
  }

  async function handleGoogleSignOut() {
    setError("");
    try {
      await signOut(auth);
    } catch (err) {
      setError("Sign out failed");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-900 px-4">
      <Card className="p-8 max-w-sm w-full">
        <h2 className="text-3xl font-black mb-6 text-center">{isLogin ? "Welcome Back" : "Join FitVerse"}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="border border-gray-300 bg-white text-gray-900 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            value={form.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="border border-gray-300 bg-white text-gray-900 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            value={form.password}
            onChange={handleChange}
          />
          {error && <div className="text-red-600 text-sm text-center bg-red-50 rounded-lg py-2 px-3 font-medium">{error}</div>}
          <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition text-lg mt-2">
            {isLogin ? "Login" : "Create Account"}
          </button>
        </form>
        <div className="mt-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full bg-gray-900 hover:bg-gray-800 text-green-100 font-bold py-3 px-6 rounded-lg shadow-lg transition text-lg"
            aria-label="Continue with Google"
          >
            Continue with Google
          </button>
          {!isFirebaseConfigured && (
            <div className="mt-2 text-xs text-gray-600">
              <p>Google Auth is disabled until Firebase is configured.</p>
              {missingFirebaseKeys?.length > 0 && (
                <p className="mt-1">Missing: {missingFirebaseKeys.join(", ")}</p>
              )}
              <p className="mt-1">Add values in <span className="font-semibold">.env.local</span> using <span className="font-semibold">.env.example</span>.</p>
              <p className="mt-1">Demo mode is active: clicking the button will sign you in with a local demo account.</p>
            </div>
          )}
          <button
            type="button"
            onClick={handleGoogleSignOut}
            className="mt-2 w-full border border-gray-300 text-gray-700 rounded-lg py-2 hover:bg-gray-50"
          >
            Sign out
          </button>
        </div>
        <div className="mt-6 text-center border-t border-gray-200 pt-6">
          <p className="text-gray-600 mb-3">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </p>
          <button className="text-green-600 hover:underline font-semibold transition" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Sign Up Now" : "Login Here"}
          </button>
        </div>
      </Card>
    </div>
  );
}
