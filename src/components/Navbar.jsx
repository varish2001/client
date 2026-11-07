import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/workout", label: "Workout" },
  { to: "/diet", label: "Diet" },
  { to: "/posture", label: "Posture" },
  { to: "/hydration", label: "Hydration" },
  { to: "/analytics", label: "Analytics" },
  { to: "/chatbot", label: "Chatbot" }
];

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b border-white/60 bg-fog/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg font-bold text-ink">
          AI Virtual Gym Trainer
        </Link>

        {user && (
          <div className="hidden gap-3 md:flex">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm ${isActive ? "bg-coral text-white" : "text-slate hover:bg-white"}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden text-sm font-medium text-slate sm:inline">
                {user.name || user.email || "Athlete"}
              </span>
              <button
                onClick={logout}
                className="rounded-lg border border-slate px-3 py-2 text-sm text-slate hover:bg-slate hover:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate hover:bg-white"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-coral px-4 py-2 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.02]"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
