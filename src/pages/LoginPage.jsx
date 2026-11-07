import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getApiErrorMessage } from "../lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const data = await login(email, password);
      if (data?.user?.hasProfile) {
        navigate("/dashboard");
      } else {
        navigate("/get-started");
      }
    } catch (err) {
      setError(getApiErrorMessage(err, "Login failed. Please check your credentials."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-md pt-8">
      <div className="glass p-6 md:p-8">
        <h1 className="text-3xl font-bold text-ink">Welcome Back</h1>
        <p className="mt-2 text-sm text-slate">Log in to view your workouts, diet, and fitness progress.</p>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
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
            Password
            <input
              type="password"
              required
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
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate">
          Don&apos;t have an account yet?{" "}
          <Link to="/register" className="font-semibold text-coral hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </section>
  );
}
