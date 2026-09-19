import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut as fbSignOut } from "firebase/auth";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { auth, db, isFirebaseConfigured } from "../firebase";
import { SAMPLE_STUDENTS } from "../data/sampleStudents";

const AuthContext = createContext(null);

const DEFAULT_DEMO_USER = {
  uid: "demo_rahul",
  email: "rahul.sharma@campus.edu",
  displayName: "Rahul Sharma",
};

const DEFAULT_DEMO_PROFILE = {
  id: "demo_rahul",
  name: "Rahul Sharma",
  email: "rahul.sharma@campus.edu",
  college: "Tech Institute of Engineering",
  department: "Computer Science",
  year: "3rd Year",
  bio: "CS undergrad exploring Python tooling and algorithm practice. Looking to get hands-on with Figma prototyping and frontend components.",
  teachingSkills: ["Python", "C++", "Data Structures"],
  learningSkills: ["UI/UX", "React", "Figma"],
  skillLevel: "Intermediate",
  availability: "Evenings after 6 PM & Weekends",
  learningMode: "Both",
  points: 65,
  badges: ["First Exchange", "Skill Mentor"],
  rating: 4.8,
  reviewCount: 4,
  createdAt: Date.now(),
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(!isFirebaseConfigured);

  useEffect(() => {
    if (!localStorage.getItem("campus_demo_students")) {
      localStorage.setItem("campus_demo_students", JSON.stringify(SAMPLE_STUDENTS));
    }
    if (!localStorage.getItem("campus_demo_requests")) {
      localStorage.setItem(
        "campus_demo_requests",
        JSON.stringify([
          {
            id: "req_1",
            fromId: "sample_riya",
            fromName: "Riya Patel",
            toId: "demo_rahul",
            toName: "Rahul Sharma",
            skillWanted: "Python",
            skillOffered: "UI/UX",
            message: "Hey Rahul! Saw you can teach Python. I can help you with Figma and UI/UX design in return!",
            status: "pending",
            createdAt: Date.now() - 3600000 * 4,
          },
          {
            id: "req_2",
            fromId: "demo_rahul",
            fromName: "Rahul Sharma",
            toId: "sample_aarav",
            toName: "Aarav Sharma",
            skillWanted: "React",
            skillOffered: "Data Structures",
            message: "Hi Aarav, would love to collaborate and learn React fundamentals.",
            status: "accepted",
            createdAt: Date.now() - 86400000 * 2,
          }
        ])
      );
    }
    if (!localStorage.getItem("campus_demo_sessions")) {
      localStorage.setItem(
        "campus_demo_sessions",
        JSON.stringify([
          {
            id: "sess_1",
            skill: "React Basics & Components",
            teacherId: "sample_aarav",
            teacherName: "Aarav Sharma",
            learnerId: "demo_rahul",
            learnerName: "Rahul Sharma",
            date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
            time: "17:00",
            mode: "Online",
            location: "Google Meet: meet.google.com/cse-demo-room",
            notes: "Bring a code editor with Node.js installed.",
            status: "Scheduled",
            createdAt: Date.now() - 86400000,
          }
        ])
      );
    }
    if (!localStorage.getItem("campus_demo_messages")) {
      localStorage.setItem(
        "campus_demo_messages",
        JSON.stringify([
          {
            id: "msg_1",
            chatId: "req_2",
            senderId: "sample_aarav",
            senderName: "Aarav Sharma",
            text: "Hey Rahul! Accepted your request. Excited to teach React!",
            createdAt: Date.now() - 7200000,
          },
          {
            id: "msg_2",
            chatId: "req_2",
            senderId: "demo_rahul",
            senderName: "Rahul Sharma",
            text: "Awesome Aarav, thanks! Looking forward to our session tomorrow.",
            createdAt: Date.now() - 3600000,
          }
        ])
      );
    }
    if (!localStorage.getItem("campus_demo_notifications")) {
      localStorage.setItem(
        "campus_demo_notifications",
        JSON.stringify([
          {
            id: "notif_1",
            userId: "demo_rahul",
            title: "New Skill Exchange Request",
            message: "Riya Patel sent you an exchange request for Python ↔ UI/UX.",
            type: "request",
            read: false,
            createdAt: Date.now() - 3600000 * 4,
            link: "/requests",
          },
          {
            id: "notif_2",
            userId: "demo_rahul",
            title: "Request Accepted!",
            message: "Aarav Sharma accepted your request to learn React.",
            type: "accepted",
            read: true,
            createdAt: Date.now() - 86400000 * 2,
            link: "/requests",
          }
        ])
      );
    }
    if (!localStorage.getItem("campus_demo_reviews")) {
      localStorage.setItem(
        "campus_demo_reviews",
        JSON.stringify([
          {
            id: "rev_1",
            teacherId: "demo_rahul",
            teacherName: "Rahul Sharma",
            reviewerId: "sample_vikram",
            reviewerName: "Vikram Malhotra",
            rating: 5,
            comment: "Rahul explained Python loops and data structures with super clear examples. Highly recommend learning from him!",
            createdAt: Date.now() - 86400000 * 5,
          }
        ])
      );
    }
  }, []);

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
        if (!user) {
          setProfile(null);
          setLoading(false);
        }
      });
      return unsubscribeAuth;
    } else {
      const savedUser = localStorage.getItem("campus_current_user");
      const savedProfile = localStorage.getItem("campus_current_profile");
      if (savedUser && savedProfile) {
        try {
          setCurrentUser(JSON.parse(savedUser));
          setProfile(JSON.parse(savedProfile));
        } catch {
          setCurrentUser(DEFAULT_DEMO_USER);
          setProfile(DEFAULT_DEMO_PROFILE);
        }
      } else {
        setCurrentUser(DEFAULT_DEMO_USER);
        setProfile(DEFAULT_DEMO_PROFILE);
      }
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured || !db || !currentUser) return;
    const unsubscribeProfile = onSnapshot(
      doc(db, "users", currentUser.uid),
      (docSnap) => {
        setProfile(docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null);
        setLoading(false);
      },
      (err) => {
        console.warn("Firestore snapshot notice:", err);
        setLoading(false);
      }
    );
    return unsubscribeProfile;
  }, [currentUser]);

  async function logout() {
    if (isFirebaseConfigured && auth) {
      await fbSignOut(auth);
    } else {
      localStorage.removeItem("campus_current_user");
      localStorage.removeItem("campus_current_profile");
      setCurrentUser(null);
      setProfile(null);
    }
  }

  function loginDemoUser(user = DEFAULT_DEMO_USER, userProfile = DEFAULT_DEMO_PROFILE) {
    localStorage.setItem("campus_current_user", JSON.stringify(user));
    localStorage.setItem("campus_current_profile", JSON.stringify(userProfile));
    setCurrentUser(user);
    setProfile(userProfile);
    setDemoMode(true);
  }

  async function updateCurrentUserProfile(updatedData) {
    if (isFirebaseConfigured && db && currentUser) {
      await setDoc(doc(db, "users", currentUser.uid), updatedData, { merge: true });
      setProfile((prev) => ({ ...prev, ...updatedData }));
    } else {
      const merged = { ...profile, ...updatedData };
      setProfile(merged);
      localStorage.setItem("campus_current_profile", JSON.stringify(merged));
    }
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        profile,
        loading,
        isFirebaseConfigured,
        demoMode,
        logout,
        loginDemoUser,
        updateCurrentUserProfile,
        setProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
