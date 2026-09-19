// Data Service: handles querying and saving data for all 14 pages.
// Seamlessly delegates to live Firestore if configured, or local demo storage.

import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "../firebase";
import { SAMPLE_STUDENTS } from "../data/sampleStudents";

// --- STUDENTS / USERS ---

export async function fetchAllStudents(currentUserId) {
  let list = [];
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, "users"));
      list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (err) {
      console.warn("Firestore fetch error, falling back to sample students:", err);
    }
  }

  // If Firestore has no students or error, include sample students
  if (list.length === 0) {
    const local = localStorage.getItem("campus_demo_students");
    list = local ? JSON.parse(local) : SAMPLE_STUDENTS;
  }

  return list.filter((s) => s.id !== currentUserId);
}

export async function fetchStudentById(id) {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDoc(doc(db, "users", id));
      if (snap.exists()) return { id: snap.id, ...snap.data() };
    } catch (err) {
      console.warn("Firestore fetch single student error:", err);
    }
  }
  const local = localStorage.getItem("campus_demo_students");
  const list = local ? JSON.parse(local) : SAMPLE_STUDENTS;
  return list.find((s) => s.id === id) || null;
}

// Seed sample students to Firestore
export async function seedFirestoreWithSamples() {
  if (!isFirebaseConfigured || !db) return false;
  try {
    for (const student of SAMPLE_STUDENTS) {
      await setDoc(doc(db, "users", student.id), student);
    }
    return true;
  } catch (err) {
    console.error("Error seeding samples:", err);
    return false;
  }
}

// --- REQUESTS ---

export async function fetchRequests(userId) {
  if (isFirebaseConfigured && db && userId) {
    try {
      const recSnap = await getDocs(
        query(collection(db, "requests"), where("toId", "==", userId))
      );
      const sentSnap = await getDocs(
        query(collection(db, "requests"), where("fromId", "==", userId))
      );
      return {
        received: recSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
        sent: sentSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
      };
    } catch (err) {
      console.warn("Firestore fetch requests error:", err);
    }
  }

  const stored = JSON.parse(localStorage.getItem("campus_demo_requests") || "[]");
  return {
    received: stored.filter((r) => r.toId === userId),
    sent: stored.filter((r) => r.fromId === userId),
  };
}

export async function createExchangeRequest(reqData) {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = await addDoc(collection(db, "requests"), reqData);
      return docRef.id;
    } catch (err) {
      console.warn("Firestore create request error:", err);
    }
  }

  const stored = JSON.parse(localStorage.getItem("campus_demo_requests") || "[]");
  const newReq = { ...reqData, id: "req_" + Date.now() };
  stored.unshift(newReq);
  localStorage.setItem("campus_demo_requests", JSON.stringify(stored));

  // Also create a notification for the recipient
  await createNotification({
    userId: reqData.toId,
    title: "New Skill Exchange Request",
    message: `${reqData.fromName} wants to learn ${reqData.skillWanted} and offered ${reqData.skillOffered}.`,
    type: "request",
    link: "/requests",
  });

  return newReq.id;
}

export async function updateExchangeRequestStatus(requestId, status, reqObj) {
  if (isFirebaseConfigured && db) {
    try {
      await updateDoc(doc(db, "requests", requestId), { status });
    } catch (err) {
      console.warn("Firestore update request error:", err);
    }
  }

  const stored = JSON.parse(localStorage.getItem("campus_demo_requests") || "[]");
  const updated = stored.map((r) => (r.id === requestId ? { ...r, status } : r));
  localStorage.setItem("campus_demo_requests", JSON.stringify(updated));

  if (reqObj) {
    await createNotification({
      userId: reqObj.fromId,
      title: status === "accepted" ? "Request Accepted! 🎉" : "Request Declined",
      message: `${reqObj.toName} has ${status} your skill exchange request.`,
      type: status,
      link: status === "accepted" ? "/chat" : "/requests",
    });
  }
}

// --- CHAT MESSAGES ---

export async function fetchMessages(chatId) {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, "messages"), where("chatId", "==", chatId));
      const snap = await getDocs(q);
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      return list.sort((a, b) => a.createdAt - b.createdAt);
    } catch (err) {
      console.warn("Firestore fetch messages error:", err);
    }
  }

  const stored = JSON.parse(localStorage.getItem("campus_demo_messages") || "[]");
  return stored
    .filter((m) => m.chatId === chatId)
    .sort((a, b) => a.createdAt - b.createdAt);
}

export async function sendChatMessage(msgData) {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = await addDoc(collection(db, "messages"), msgData);
      return docRef.id;
    } catch (err) {
      console.warn("Firestore send message error:", err);
    }
  }

  const stored = JSON.parse(localStorage.getItem("campus_demo_messages") || "[]");
  const newMsg = { ...msgData, id: "msg_" + Date.now() };
  stored.push(newMsg);
  localStorage.setItem("campus_demo_messages", JSON.stringify(stored));
  return newMsg.id;
}

// --- LEARNING SESSIONS ---

export async function fetchSessions(userId) {
  if (isFirebaseConfigured && db && userId) {
    try {
      const teacherSnap = await getDocs(
        query(collection(db, "sessions"), where("teacherId", "==", userId))
      );
      const learnerSnap = await getDocs(
        query(collection(db, "sessions"), where("learnerId", "==", userId))
      );
      const combined = [
        ...teacherSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
        ...learnerSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
      ];
      // Deduplicate by ID
      const unique = Array.from(new Map(combined.map((s) => [s.id, s])).values());
      return unique.sort((a, b) => new Date(a.date) - new Date(b.date));
    } catch (err) {
      console.warn("Firestore fetch sessions error:", err);
    }
  }

  const stored = JSON.parse(localStorage.getItem("campus_demo_sessions") || "[]");
  return stored.filter((s) => s.teacherId === userId || s.learnerId === userId);
}

export async function createLearningSession(sessionData) {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = await addDoc(collection(db, "sessions"), sessionData);
      return docRef.id;
    } catch (err) {
      console.warn("Firestore create session error:", err);
    }
  }

  const stored = JSON.parse(localStorage.getItem("campus_demo_sessions") || "[]");
  const newSession = { ...sessionData, id: "sess_" + Date.now() };
  stored.push(newSession);
  localStorage.setItem("campus_demo_sessions", JSON.stringify(stored));

  // Notify the other party
  const recipientId =
    sessionData.currentUserId === sessionData.teacherId
      ? sessionData.learnerId
      : sessionData.teacherId;
  await createNotification({
    userId: recipientId,
    title: "New Learning Session Scheduled",
    message: `A session for "${sessionData.skill}" was arranged on ${sessionData.date} at ${sessionData.time}.`,
    type: "session",
    link: "/sessions",
  });

  return newSession.id;
}

export async function updateSessionStatus(sessionId, status) {
  if (isFirebaseConfigured && db) {
    try {
      await updateDoc(doc(db, "sessions", sessionId), { status });
    } catch (err) {
      console.warn("Firestore update session error:", err);
    }
  }

  const stored = JSON.parse(localStorage.getItem("campus_demo_sessions") || "[]");
  const updated = stored.map((s) => (s.id === sessionId ? { ...s, status } : s));
  localStorage.setItem("campus_demo_sessions", JSON.stringify(updated));
}

// --- NOTIFICATIONS ---

export async function fetchNotifications(userId) {
  if (isFirebaseConfigured && db && userId) {
    try {
      const q = query(
        collection(db, "notifications"),
        where("userId", "==", userId)
      );
      const snap = await getDocs(q);
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      return list.sort((a, b) => b.createdAt - a.createdAt);
    } catch (err) {
      console.warn("Firestore fetch notifications error:", err);
    }
  }

  const stored = JSON.parse(localStorage.getItem("campus_demo_notifications") || "[]");
  return stored
    .filter((n) => n.userId === userId)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function createNotification(notifData) {
  const payload = {
    ...notifData,
    read: false,
    createdAt: Date.now(),
  };

  if (isFirebaseConfigured && db) {
    try {
      const docRef = await addDoc(collection(db, "notifications"), payload);
      return docRef.id;
    } catch (err) {
      console.warn("Firestore create notification error:", err);
    }
  }

  const stored = JSON.parse(localStorage.getItem("campus_demo_notifications") || "[]");
  const newNotif = { ...payload, id: "notif_" + Date.now() };
  stored.unshift(newNotif);
  localStorage.setItem("campus_demo_notifications", JSON.stringify(stored));
  return newNotif.id;
}

export async function markNotificationAsRead(notifId) {
  if (isFirebaseConfigured && db) {
    try {
      await updateDoc(doc(db, "notifications", notifId), { read: true });
    } catch (err) {
      console.warn("Firestore mark notif error:", err);
    }
  }

  const stored = JSON.parse(localStorage.getItem("campus_demo_notifications") || "[]");
  const updated = stored.map((n) => (n.id === notifId ? { ...n, read: true } : n));
  localStorage.setItem("campus_demo_notifications", JSON.stringify(updated));
}

// --- REVIEWS ---

export async function fetchReviewsForTeacher(teacherId) {
  if (isFirebaseConfigured && db && teacherId) {
    try {
      const q = query(collection(db, "reviews"), where("teacherId", "==", teacherId));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (err) {
      console.warn("Firestore fetch reviews error:", err);
    }
  }

  const stored = JSON.parse(localStorage.getItem("campus_demo_reviews") || "[]");
  return stored.filter((r) => r.teacherId === teacherId);
}

export async function submitReview(reviewData) {
  const payload = {
    ...reviewData,
    createdAt: Date.now(),
  };

  if (isFirebaseConfigured && db) {
    try {
      await addDoc(collection(db, "reviews"), payload);
    } catch (err) {
      console.warn("Firestore submit review error:", err);
    }
  }

  const stored = JSON.parse(localStorage.getItem("campus_demo_reviews") || "[]");
  stored.push({ ...payload, id: "rev_" + Date.now() });
  localStorage.setItem("campus_demo_reviews", JSON.stringify(stored));

  // Award +5 points to the teacher for receiving a review
  return true;
}

// --- REPORTS / SAFETY ---

export async function reportUser(reportData) {
  const payload = {
    ...reportData,
    createdAt: Date.now(),
    status: "pending",
  };

  if (isFirebaseConfigured && db) {
    try {
      await addDoc(collection(db, "reports"), payload);
      return true;
    } catch (err) {
      console.warn("Firestore submit report error:", err);
    }
  }

  const stored = JSON.parse(localStorage.getItem("campus_demo_reports") || "[]");
  stored.push({ ...payload, id: "rep_" + Date.now() });
  localStorage.setItem("campus_demo_reports", JSON.stringify(stored));
  return true;
}

export async function fetchAllReports() {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, "reports"));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (err) {
      console.warn("Firestore fetch reports error:", err);
    }
  }
  return JSON.parse(localStorage.getItem("campus_demo_reports") || "[]");
}
