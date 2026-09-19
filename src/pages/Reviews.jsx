import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  fetchAllStudents,
  submitReview,
  fetchReviewsForTeacher,
} from "../utils/dataService";
import { StarIcon } from "../components/Icons";

export default function Reviews() {
  const { currentUser, profile } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const teacherIdParam = searchParams.get("teacherId") || "";
  const teacherNameParam = searchParams.get("teacherName") || "";
  const skillParam = searchParams.get("skill") || "";

  const [students, setStudents] = useState([]);
  const [teacherId, setTeacherId] = useState(teacherIdParam);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [skill, setSkill] = useState(skillParam);
  const [comment, setComment] = useState("");
  const [myReviewsReceived, setMyReviewsReceived] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ text: "", type: "" });

  useEffect(() => {
    async function load() {
      if (!currentUser) return;
      setLoading(true);
      const [allStudents, reviews] = await Promise.all([
        fetchAllStudents(currentUser.uid),
        fetchReviewsForTeacher(currentUser.uid),
      ]);
      setStudents(allStudents);
      setMyReviewsReceived(reviews);
      setLoading(false);
    }
    load();
  }, [currentUser]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!teacherId) {
      setStatus({ text: "Please select which student taught you.", type: "error" });
      return;
    }

    const teacherObj = students.find((s) => s.id === teacherId);
    const teacherName = teacherObj ? teacherObj.name : teacherNameParam || "Peer Teacher";

    await submitReview({
      teacherId,
      teacherName,
      skill: skill.trim() || "Skill Exchange",
      reviewerId: currentUser.uid,
      reviewerName: profile?.name || "Student Learner",
      rating,
      comment: comment.trim(),
    });

    setStatus({ text: "Thank you! Your review was published and points awarded. ⭐", type: "success" });
    setComment("");
    setTimeout(() => {
      navigate(`/student/${teacherId}`);
    }, 1200);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-ink">Peer Reviews & Ratings</h1>
        <p className="text-sm text-ink/60 mt-1">
          Give helpful feedback to fellow campus teachers and celebrate great learning exchanges.
        </p>
      </div>

      {status.text && (
        <div
          className={`mb-6 p-4 rounded-xl text-sm font-medium border ${
            status.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {status.text}
        </div>
      )}

      <div className="grid md:grid-cols-12 gap-8">
        {/* Review Form */}
        <div className="md:col-span-7 bg-white rounded-2xl border border-mist p-6 shadow-sm">
          <h2 className="font-display font-bold text-xl text-ink mb-4">Write a Review</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-ink/60 mb-1">
                Teacher you learned from
              </label>
              {students.length > 0 ? (
                <select
                  value={teacherId}
                  onChange={(e) => setTeacherId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-mist text-sm bg-white"
                  required
                >
                  <option value="">Select a student...</option>
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} — {st.department}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={teacherNameParam}
                  disabled
                  className="w-full px-4 py-2.5 rounded-xl border border-mist text-sm bg-sand"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-ink/60 mb-1">
                Skill Taught
              </label>
              <input
                type="text"
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                placeholder="e.g. Python, Figma, React"
                className="w-full px-4 py-2.5 rounded-xl border border-mist text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-ink/60 mb-2">
                Star Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = (hoverRating || rating) >= star;
                  return (
                    <button
                      type="button"
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="text-amber-400 hover:scale-110 transition-transform p-1"
                    >
                      <StarIcon className="w-8 h-8" filled={isFilled} />
                    </button>
                  );
                })}
                <span className="text-sm font-bold text-ink ml-2">{rating} of 5 Stars</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-ink/60 mb-1">
                Written Feedback
              </label>
              <textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How was their teaching style? What did you learn?"
                className="w-full px-4 py-2.5 rounded-xl border border-mist text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-coral text-white font-medium text-sm hover:bg-coral/90 transition-colors shadow-sm"
            >
              Submit Review (+5 pts to teacher)
            </button>
          </form>
        </div>

        {/* Reviews You've Received */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-mist p-6 shadow-sm">
            <h3 className="font-display font-bold text-lg text-ink mb-1">Reviews on Your Teaching</h3>
            <p className="text-xs text-ink/60 mb-4">Feedback left by students who learned from you.</p>

            {loading ? (
              <div className="text-center py-6 text-sm text-ink/50">Loading...</div>
            ) : myReviewsReceived.length === 0 ? (
              <div className="text-center py-8 text-sm text-ink/50 bg-sand/30 rounded-xl p-4">
                No reviews yet. Complete a learning session to receive your first campus review!
              </div>
            ) : (
              <div className="space-y-3">
                {myReviewsReceived.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-xl border border-mist/70 bg-sand/20">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-semibold text-xs text-ink">{rev.reviewerName}</span>
                      <div className="flex text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <StarIcon key={i} className="w-3.5 h-3.5" filled />
                        ))}
                      </div>
                    </div>
                    {rev.skill && (
                      <span className="text-[11px] font-medium text-coral block mb-1">
                        Skill: {rev.skill}
                      </span>
                    )}
                    <p className="text-xs text-ink/80 italic leading-relaxed">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
