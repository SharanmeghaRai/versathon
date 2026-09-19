import { Link } from "react-router-dom";
import { SKILL_CATEGORIES } from "../data/sampleStudents";
import { SparklesIcon } from "../components/Icons";

const steps = [
  { num: "01", title: "Create your profile", desc: "List your department, year, and campus background." },
  { num: "02", title: "Add your skills", desc: "Specify skills you can teach and what you want to learn." },
  { num: "03", title: "Discover students", desc: "Filter peers by skill, department, or learning mode." },
  { num: "04", title: "Exchange knowledge", desc: "Send exchange requests and start 1-on-1 sessions." },
  { num: "05", title: "Grow together", desc: "Earn badges, collect ratings, and build your campus network." },
];

export default function Landing() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sun/30 border border-sun/60 text-ink text-xs font-bold mb-6">
          <SparklesIcon className="w-4 h-4 text-coral" />
          <span>Peer-to-Peer Learning for College Students</span>
        </div>

        <h1 className="font-display font-black text-4xl sm:text-6xl text-ink leading-tight tracking-tight max-w-4xl mx-auto">
          Learn a Skill. <span className="text-coral underline decoration-sun/80">Share a Skill.</span>
        </h1>

        <p className="mt-5 text-base sm:text-xl text-ink/75 max-w-2xl mx-auto leading-relaxed">
          Connect with students on your campus, exchange knowledge, and grow together without expensive tutors or courses.
        </p>

        <div className="mt-8 flex flex-wrap justify-center items-center gap-4">
          <Link
            to="/signup"
            className="px-8 py-3.5 rounded-full bg-coral text-white font-bold text-sm sm:text-base hover:bg-coral/90 shadow-md shadow-coral/20"
          >
            Get Started Free →
          </Link>
          <Link
            to="/discover"
            className="px-7 py-3.5 rounded-full bg-white border border-mist text-ink font-bold text-sm sm:text-base hover:border-ink/40 shadow-sm"
          >
            Explore Skills
          </Link>
        </div>

        {/* Visual Matching Flow */}
        <div className="mt-16 max-w-2xl mx-auto bg-white rounded-3xl border border-mist p-6 sm:p-8 shadow-sm">
          <p className="text-xs uppercase font-bold tracking-widest text-ink/40 mb-6">
            The Skill Match Flow
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex-1 w-full p-4 rounded-2xl bg-sand/60 border border-mist text-center">
              <span className="text-2xl block mb-1">🎓</span>
              <p className="font-bold text-xs uppercase text-ink/60">I CAN TEACH</p>
              <p className="font-display font-bold text-base text-ink mt-0.5">Python & Figma</p>
            </div>

            <div className="flex flex-col items-center">
              <span className="px-3 py-1 rounded-full bg-coral text-white text-[11px] font-extrabold uppercase tracking-wider">
                ⚡ MATCH
              </span>
            </div>

            <div className="flex-1 w-full p-4 rounded-2xl bg-sand/60 border border-mist text-center">
              <span className="text-2xl block mb-1">🎒</span>
              <p className="font-bold text-xs uppercase text-ink/60">I WANT TO LEARN</p>
              <p className="font-display font-bold text-base text-ink mt-0.5">UI/UX & React</p>
            </div>
          </div>

          <div className="mt-5 p-3 rounded-xl bg-sun/20 border border-sun/40 text-xs text-ink/80 text-center font-medium">
            🤝 Student A teaches Python to Student B · Student B teaches UI/UX to Student A
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white border-y border-mist py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs uppercase font-extrabold tracking-widest text-coral">
              Simple 5-Step Process
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-ink mt-1">
              How Campus Skill Exchange Works
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {steps.map((step) => (
              <div
                key={step.num}
                className="p-6 rounded-2xl bg-sand/40 border border-mist/80 flex flex-col justify-between"
              >
                <div>
                  <span className="font-display font-black text-2xl text-coral block mb-3">
                    {step.num}
                  </span>
                  <h3 className="font-display font-bold text-base text-ink mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-ink/65 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="font-display font-black text-3xl text-ink">
            Popular Skill Categories
          </h2>
          <p className="text-sm text-ink/65 mt-2">
            Hundreds of skills taught and learned by fellow peers across every campus department.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2.5 max-w-3xl mx-auto">
          {SKILL_CATEGORIES.filter((c) => c !== "All").map((cat) => (
            <Link
              key={cat}
              to={`/discover?search=${encodeURIComponent(cat)}`}
              className="px-5 py-2.5 rounded-full bg-white border border-mist text-ink font-semibold text-xs sm:text-sm hover:border-coral hover:text-coral shadow-sm"
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom Call to Action */}
      <section className="bg-ink text-white py-16 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-display font-black text-3xl sm:text-4xl">
            Ready to exchange skills on campus?
          </h2>
          <p className="mt-3 text-white/75 text-sm sm:text-base">
            Join your peers today and start your first 1-on-1 learning session.
          </p>
          <Link
            to="/signup"
            className="mt-8 inline-block px-8 py-3.5 rounded-full bg-coral text-white font-bold text-sm sm:text-base hover:bg-coral/90 shadow-lg"
          >
            Create Your Profile Now →
          </Link>
        </div>
      </section>
    </div>
  );
}
