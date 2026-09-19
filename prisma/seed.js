import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SAMPLE_STUDENTS = [
  {
    id: "sample_aarav",
    name: "Aarav Sharma",
    email: "aarav.sharma@campus.edu",
    college: "Tech Institute of Engineering",
    department: "Computer Science",
    year: "3rd Year",
    bio: "Working on Django backends and competitive programming. Happy to help with Python scripting and DSA prep; trying to learn React for semester project.",
    skillLevel: "ADVANCED",
    availability: "Weekday evenings & Saturday afternoons",
    learningMode: "BOTH",
    points: 125,
    badges: ["First Exchange", "Skill Mentor", "Top Contributor"],
    rating: 4.9,
    reviewCount: 8,
  },
  {
    id: "sample_riya",
    name: "Riya Patel",
    email: "riya.patel@campus.edu",
    college: "Tech Institute of Engineering",
    department: "Information Technology",
    year: "2nd Year",
    bio: "Frontend focused. I spend most of my time building React interfaces and designing in Figma. Looking to get comfortable with Python backend and APIs.",
    skillLevel: "INTERMEDIATE",
    availability: "Weekends & Tuesday/Thursday afternoons",
    learningMode: "BOTH",
    points: 140,
    badges: ["First Exchange", "Community Builder", "Skill Mentor"],
    rating: 5.0,
    reviewCount: 11,
  },
  {
    id: "sample_rohan",
    name: "Rohan Verma",
    email: "rohan.verma@campus.edu",
    college: "Tech Institute of Engineering",
    department: "AI & Data Science",
    year: "4th Year",
    bio: "Senior year working on CV projects and PyTorch. Can walk anyone through Python fundamentals, NumPy, and SQL. Want practice with presentation skills.",
    skillLevel: "ADVANCED",
    availability: "Flexible on weekdays after 5 PM",
    learningMode: "ONLINE",
    points: 210,
    badges: ["10 Sessions", "Skill Mentor", "Top Contributor"],
    rating: 4.8,
    reviewCount: 15,
  },
  {
    id: "sample_ananya",
    name: "Ananya Iyer",
    email: "ananya.iyer@campus.edu",
    college: "Tech Institute of Engineering",
    department: "Design & Media Arts",
    year: "2nd Year",
    bio: "Campus club media lead. I do video edits in Premiere Pro, poster designs, and event photography. Looking to learn modern web design and marketing.",
    skillLevel: "INTERMEDIATE",
    availability: "Fridays and Sunday mornings",
    learningMode: "OFFLINE",
    points: 80,
    badges: ["First Exchange", "Community Builder"],
    rating: 4.7,
    reviewCount: 5,
  },
  {
    id: "sample_vikram",
    name: "Vikram Malhotra",
    email: "vikram.m@campus.edu",
    college: "Tech Institute of Engineering",
    department: "Mechanical Engineering",
    year: "3rd Year",
    bio: "Robotics lab enthusiast. Comfortable with SolidWorks/Fusion 360, 3D printing, and basic C++. Looking for help with Python scripting for ROS.",
    skillLevel: "ADVANCED",
    availability: "Weekdays 4 PM - 7 PM",
    learningMode: "BOTH",
    points: 95,
    badges: ["First Exchange", "Skill Mentor"],
    rating: 4.9,
    reviewCount: 6,
  },
  {
    id: "sample_priya",
    name: "Priya Das",
    email: "priya.das@campus.edu",
    college: "Tech Institute of Engineering",
    department: "Business & Management",
    year: "1st Year",
    bio: "Fresher exploring digital branding and events. Can teach basic acoustic guitar chords and public speaking. Looking to learn Figma basics.",
    skillLevel: "BEGINNER",
    availability: "Saturday whole day",
    learningMode: "OFFLINE",
    points: 45,
    badges: ["First Exchange"],
    rating: 5.0,
    reviewCount: 3,
  },
  {
    id: "demo_rahul",
    name: "Rahul Sharma",
    email: "rahul.sharma@campus.edu",
    college: "Tech Institute of Engineering",
    department: "Computer Science",
    year: "3rd Year",
    bio: "Curious student passionate about Python scripting and Data Analysis. Looking to learn modern UI/UX design and React web development!",
    skillLevel: "INTERMEDIATE",
    availability: "Evenings after 6 PM & Weekends",
    learningMode: "BOTH",
    points: 65,
    badges: ["First Exchange", "Skill Mentor"],
    rating: 4.8,
    reviewCount: 4,
  }
];

const CATEGORIES = [
  "Programming",
  "AI & Machine Learning",
  "UI/UX",
  "Photography",
  "Video Editing",
  "Music",
  "Communication",
  "Marketing",
  "Engineering",
  "Academics",
  "Sports",
  "Other"
];

async function main() {
  console.log("🌱 Seeding Supabase database with Prisma...");

  // 1. Seed Categories
  for (const catName of CATEGORIES) {
    await prisma.category.upsert({
      where: { name: catName },
      update: {},
      create: { name: catName },
    });
  }
  console.log("✅ Seeded categories.");

  // 2. Seed Students
  for (const student of SAMPLE_STUDENTS) {
    await prisma.user.upsert({
      where: { email: student.email },
      update: student,
      create: student,
    });
  }
  console.log("✅ Seeded campus students.");

  console.log("🎉 Database seeding complete!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
