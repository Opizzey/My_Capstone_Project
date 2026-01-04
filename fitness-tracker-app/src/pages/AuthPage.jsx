import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from '../components/Card';
import { registerUser, loginUser, signOutUser } from "../lib/localAuth";

export default function AuthPage({ onAuth }) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: "", password: "", displayName: "" });
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const { email, password, displayName } = form;
    if (!email || !password) {
      setError("Email and password required");
      return;
    }
    try {
      const user = isLogin
        ? await loginUser(email, password)
        : await registerUser({ email, password, displayName });
      onAuth && onAuth(user);
      if (user) navigate('/');
    } catch (err) {
      setError(err?.message || "Something went wrong");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-900 px-4">
      <Card className="p-8 max-w-sm w-full">
        <h2 className="text-3xl font-black mb-6 text-center">{isLogin ? "Welcome Back" : "Join FitVerse"}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <input
              type="text"
              name="displayName"
              placeholder="Display name (optional)"
              className="border border-gray-300 bg-white text-gray-900 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              value={form.displayName}
              onChange={handleChange}
            />
          )}
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
            onClick={() => { try { signOutUser(); onAuth && onAuth(null); } catch {} }}
            className="w-full border border-gray-300 text-gray-700 rounded-lg py-2 hover:bg-gray-50"
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
