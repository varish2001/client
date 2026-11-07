import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getApiErrorMessage } from "../lib/api";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await register(name, email, password);
      // New user goes to get-started to set up their fitness profile
      navigate("/get-started");
    } catch (err) {
      setError(getApiErrorMessage(err, "Registration failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-md pt-8">
      <div className="glass p-6 md:p-8">
        <h1 className="text-3xl font-bold text-ink">Create Account</h1>
        <p className="mt-2 text-sm text-slate">Join AI Virtual Gym Trainer for personalized fitness coaching.</p>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm font-medium text-slate">
            Full Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="rounded-xl border border-slate/20 bg-white px-3 py-2.5 outline-none ring-coral focus:ring-2"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium text-slate">
            Email Address
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="rounded-xl border border-slate/20 bg-white px-3 py-2.5 outline-none ring-coral focus:ring-2"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium text-slate">
            Password (min 6 characters)
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="rounded-xl border border-slate/20 bg-white px-3 py-2.5 outline-none ring-coral focus:ring-2"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-xl bg-coral py-3 font-semibold text-white shadow-glow transition hover:scale-[1.01] disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-coral hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </section>
  );
}
