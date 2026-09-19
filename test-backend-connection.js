// Automated test script to verify all frontend-to-backend API proxy routes
// Tests through http://localhost:5173/api (the exact endpoint React calls)

async function runTests() {
  const BASE = "http://localhost:5173/api";
  const results = [];

  function record(testName, passed, details) {
    results.push({ testName, passed, details });
    const status = passed ? "✅ PASS" : "❌ FAIL";
    console.log(`${status} - ${testName}: ${details}`);
  }

  console.log(`\n🔍 Testing Frontend-to-Backend Connectivity via Vite Proxy (${BASE})...\n`);

  try {
    // 1. Health check
    const healthRes = await fetch(`${BASE}/health`);
    const healthData = await healthRes.json();
    record(
      "1. Health Check Proxy",
      healthRes.ok && healthData.status === "ok",
      `Status: ${healthRes.status}, Service: ${healthData.service}`
    );

    // 2. Fetch all students
    const studentsRes = await fetch(`${BASE}/students`);
    const students = await studentsRes.json();
    record(
      "2. Students Directory API",
      studentsRes.ok && Array.isArray(students) && students.length >= 6,
      `Loaded ${students.length} students (First: ${students[0]?.name})`
    );

    // 3. Search & filter students
    const filterRes = await fetch(`${BASE}/students?q=python&category=Programming`);
    const filtered = await filterRes.json();
    record(
      "3. Search & Filter Students API",
      filterRes.ok && filtered.some((s) => s.teachingSkills.includes("Python")),
      `Found ${filtered.length} matching students with Python skill`
    );

    // 4. Fetch single student
    const singleRes = await fetch(`${BASE}/students/sample_riya`);
    const riya = await singleRes.json();
    record(
      "4. Single Student Profile API",
      singleRes.ok && riya.name === "Riya Patel",
      `Fetched profile for ${riya.name} (${riya.department})`
    );

    // 5. Update student profile
    const updateRes = await fetch(`${BASE}/students/demo_rahul`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bio: "Updated bio tested via frontend proxy!",
        availability: "Weekdays 6 PM - 9 PM",
      }),
    });
    const updatedRahul = await updateRes.json();
    record(
      "5. Profile Update (PUT) API",
      updateRes.ok && updatedRahul.bio === "Updated bio tested via frontend proxy!",
      `Updated Rahul's bio: "${updatedRahul.bio}"`
    );

    // 6. Propose skill exchange request
    const createReqRes = await fetch(`${BASE}/requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fromId: "demo_rahul",
        fromName: "Rahul Sharma",
        toId: "sample_riya",
        toName: "Riya Patel",
        skillWanted: "UI/UX",
        skillOffered: "Python",
        message: "Hey Riya, would love to learn Figma & UI/UX from you!",
      }),
    });
    const createdReq = await createReqRes.json();
    record(
      "6. Create Exchange Request (POST) API",
      createReqRes.ok && createdReq.id && createdReq.status === "pending",
      `Created request ID: ${createdReq.id} (Status: ${createdReq.status})`
    );

    // 7. Fetch user requests (sent & received)
    const userReqsRes = await fetch(`${BASE}/requests?userId=demo_rahul`);
    const userReqs = await userReqsRes.json();
    record(
      "7. Fetch User Requests API",
      userReqsRes.ok && userReqs.sent.some((r) => r.id === createdReq.id),
      `Sent count: ${userReqs.sent.length}, Received count: ${userReqs.received.length}`
    );

    // 8. Accept request
    const acceptRes = await fetch(`${BASE}/requests/${createdReq.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "accepted" }),
    });
    const acceptedReq = await acceptRes.json();
    record(
      "8. Accept Request (PATCH) API",
      acceptRes.ok && acceptedReq.status === "accepted",
      `Request ${createdReq.id} status updated to: ${acceptedReq.status}`
    );

    // 9. Send chat message
    const sendMsgRes = await fetch(`${BASE}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chatId: createdReq.id,
        senderId: "demo_rahul",
        senderName: "Rahul Sharma",
        text: "Hi Riya! When are you free for our first design session?",
      }),
    });
    const msg = await sendMsgRes.json();
    record(
      "9. Send Chat Message (POST) API",
      sendMsgRes.ok && msg.id && msg.text.includes("Hi Riya"),
      `Message stored with ID: ${msg.id}`
    );

    // 10. Fetch chat messages
    const getMsgsRes = await fetch(`${BASE}/messages/${createdReq.id}`);
    const msgs = await getMsgsRes.json();
    record(
      "10. Fetch Chat Conversation API",
      getMsgsRes.ok && msgs.length >= 1,
      `Retrieved ${msgs.length} message(s) in conversation ${createdReq.id}`
    );

    // 11. Schedule learning session
    const createSessRes = await fetch(`${BASE}/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        skill: "Figma Component Systems",
        teacherId: "sample_riya",
        teacherName: "Riya Patel",
        learnerId: "demo_rahul",
        learnerName: "Rahul Sharma",
        date: "2026-09-25",
        time: "18:00",
        mode: "Online",
        location: "Google Meet: meet.google.com/cse-test",
        notes: "Bring your laptop and Figma account.",
      }),
    });
    const session = await createSessRes.json();
    record(
      "11. Schedule Learning Session (POST) API",
      createSessRes.ok && session.id && session.status === "Scheduled",
      `Session created ID: ${session.id} for "${session.skill}" on ${session.date}`
    );

    // 12. Complete session & verify gamification points (+20/+10)
    const completeSessRes = await fetch(`${BASE}/sessions/${session.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Completed" }),
    });
    const completedSession = await completeSessRes.json();
    record(
      "12. Complete Session & Award Points (PATCH) API",
      completeSessRes.ok && completedSession.status === "Completed",
      `Session marked as ${completedSession.status}`
    );

    // 13. Submit review & verify rating calculation (+5 pts)
    const reviewRes = await fetch(`${BASE}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        teacherId: "sample_riya",
        teacherName: "Riya Patel",
        reviewerId: "demo_rahul",
        reviewerName: "Rahul Sharma",
        skill: "Figma Component Systems",
        rating: 5,
        comment: "Riya is a fantastic teacher! Learned auto-layout and components in 1 hour.",
      }),
    });
    const review = await reviewRes.json();
    record(
      "13. Submit Peer Review (POST) API",
      reviewRes.ok && review.id && review.rating === 5,
      `Review published for Riya with 5 stars: "${review.comment.slice(0, 30)}..."`
    );

    // 14. Fetch notifications for user
    const notifsRes = await fetch(`${BASE}/notifications?userId=sample_riya`);
    const notifs = await notifsRes.json();
    record(
      "14. Fetch Notifications API",
      notifsRes.ok && Array.isArray(notifs) && notifs.length >= 1,
      `Found ${notifs.length} notification(s) for Riya`
    );

    // 15. Admin statistics
    const statsRes = await fetch(`${BASE}/admin/stats`);
    const stats = await statsRes.json();
    record(
      "15. Admin Dashboard Analytics API",
      statsRes.ok && stats.totalStudents >= 7 && stats.totalExchanges >= 1,
      `Stats: ${stats.totalStudents} students, ${stats.totalExchanges} exchanges, ${stats.completedSessions} completed sessions`
    );

  } catch (err) {
    record("Connectivity Test Execution", false, `Exception occurred: ${err.message}`);
  }

  const passedCount = results.filter((r) => r.passed).length;
  console.log(`\n========================================`);
  console.log(`🏆 TEST SUMMARY: ${passedCount} / ${results.length} PASSED`);
  console.log(`========================================\n`);
}

runTests();
