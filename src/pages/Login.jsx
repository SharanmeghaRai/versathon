import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, isFirebaseConfigured } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { loginDemoUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (isFirebaseConfigured && auth) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/dashboard");
      } catch (err) {
        if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
          setError("Incorrect email or password.");
        } else if (err.code === "auth/user-not-found") {
          setError("No registered student found with that email.");
        } else {
          setError("Could not log in. " + (err.message || "Please check your details."));
        }
      } finally {
        setLoading(false);
      }
    } else {
      // Local Demo Mode Login
      loginDemoUser();
      setLoading(false);
      navigate("/dashboard");
    }
  }

  function handleDemoLogin() {
    loginDemoUser();
    navigate("/dashboard");
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-8">
        <h1 className="font-display font-extrabold text-3xl text-ink">Welcome Back</h1>
        <p className="text-sm text-ink/65 mt-1">Log in to check your matches and session requests.</p>
      </div>

      <div className="bg-white rounded-3xl border border-mist p-6 sm:p-8 shadow-sm">
        {/* Demo Mode helper */}
        <div className="mb-6 p-4 rounded-2xl bg-sand/60 border border-mist text-xs">
          <p className="font-bold text-ink mb-1">Quick Preview / Testing:</p>
          <p className="text-ink/65 mb-3">
            Want to test all 14 pages right now without typing?
          </p>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2.5 rounded-full bg-ink text-white font-semibold text-xs hover:bg-ink/90 transition-colors"
          >
            ⚡ One-Click Demo Login (as Rahul)
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-left">
            <span className="text-xs font-bold uppercase text-ink/60 mb-1 block">Campus Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="rahul.sharma@campus.edu"
              className="w-full px-4 py-2.5 rounded-xl border border-mist bg-white text-sm focus:outline-none focus:ring-2 focus:ring-coral/40"
            />
          </label>

          <label className="block text-left">
            <span className="text-xs font-bold uppercase text-ink/60 mb-1 block">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-mist bg-white text-sm focus:outline-none focus:ring-2 focus:ring-coral/40"
            />
          </label>

          {error && (
            <p className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-coral text-white font-semibold text-sm hover:bg-coral/90 disabled:opacity-50 transition-colors shadow-sm"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="text-xs text-ink/60 mt-6 text-center">
          New to Campus Skill Exchange?{" "}
          <Link to="/signup" className="text-coral font-bold hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
