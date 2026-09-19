import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db, isFirebaseConfigured } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const navigate = useNavigate();
  const { loginDemoUser } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    college: "Tech Institute of Engineering",
    department: "Computer Science",
    year: "2nd Year",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password) {
      setError("Please fill in your name, email, and password.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    if (isFirebaseConfigured && auth && db) {
      try {
        const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
        await updateProfile(cred.user, { displayName: form.name });

        await setDoc(doc(db, "users", cred.user.uid), {
          name: form.name,
          email: form.email,
          college: form.college,
          department: form.department,
          year: form.year,
          bio: "",
          teachingSkills: [],
          learningSkills: [],
          skillLevel: "Beginner",
          availability: "Flexible",
          learningMode: "Both",
          points: 10,
          badges: ["First Exchange"],
          rating: 5.0,
          reviewCount: 0,
          createdAt: Date.now(),
        });

        navigate("/profile-setup");
      } catch (err) {
        if (err.code === "auth/email-already-in-use") {
          setError("An account with this email already exists. Try logging in instead.");
        } else if (err.code === "auth/invalid-email") {
          setError("That email address doesn't look valid.");
        } else {
          setError("Error creating account: " + (err.message || "Please try again."));
        }
      } finally {
        setLoading(false);
      }
    } else {
      // Local Demo Mode Registration
      const newUid = "user_" + Date.now();
      const mockUser = {
        uid: newUid,
        email: form.email,
        displayName: form.name,
      };
      const mockProfile = {
        id: newUid,
        name: form.name,
        email: form.email,
        college: form.college,
        department: form.department,
        year: form.year,
        bio: "Campus learner eager to exchange skills.",
        teachingSkills: ["Python"],
        learningSkills: ["React"],
        skillLevel: "Beginner",
        availability: "Weekends",
        learningMode: "Both",
        points: 20,
        badges: ["First Exchange"],
        rating: 5.0,
        reviewCount: 0,
        createdAt: Date.now(),
      };

      loginDemoUser(mockUser, mockProfile);
      setLoading(false);
      navigate("/profile-setup");
    }
  }

  function handleQuickDemo() {
    loginDemoUser();
    navigate("/dashboard");
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-14">
      <div className="text-center mb-8">
        <h1 className="font-display font-extrabold text-3xl text-ink">Join Campus Exchange</h1>
        <p className="text-sm text-ink/65 mt-1">
          Share your expertise, learn something new, and connect with fellow students.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-mist p-6 sm:p-8 shadow-sm">
        {!isFirebaseConfigured && (
          <div className="mb-6 p-3.5 rounded-2xl bg-sun/20 border border-sun/50 text-xs text-ink/80 flex items-center justify-between">
            <span>💡 Running in Local Demo Mode</span>
            <button
              type="button"
              onClick={handleQuickDemo}
              className="text-xs font-bold text-coral underline hover:text-ink"
            >
              1-Click Demo Login →
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Full Name" value={form.name} onChange={update("name")} placeholder="e.g. Rahul Sharma" />
          <Input label="Campus Email" type="email" value={form.email} onChange={update("email")} placeholder="name@campus.edu" />
          <Input label="Password" type="password" value={form.password} onChange={update("password")} placeholder="At least 6 characters" />
          <Input label="College / University" value={form.college} onChange={update("college")} />

          <div className="grid grid-cols-2 gap-3">
            <Input label="Department" value={form.department} onChange={update("department")} />
            <Input label="Year" value={form.year} onChange={update("year")} />
          </div>

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
            {loading ? "Setting up account..." : "Sign Up & Get Started"}
          </button>
        </form>

        <p className="text-xs text-ink/60 mt-6 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-coral font-bold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <label className="block text-left">
      <span className="text-xs font-bold uppercase text-ink/60 mb-1 block">{label}</span>
      <input
        {...props}
        required
        className="w-full px-4 py-2.5 rounded-xl border border-mist bg-white text-sm focus:outline-none focus:ring-2 focus:ring-coral/40"
      />
    </label>
  );
}
