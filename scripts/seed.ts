import mongoose from "mongoose";
import Course from "@/models/Course";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

const DATABASE_URI = process.env.DATABASE_URI;

const seedCourses = [
  {
    title: "Python Programming: Basic to Advanced",
    slug: "python-programming-basic-to-advanced",
    category: "Software Engineering",
    description:
      "Master Python from scratch. This comprehensive course covers everything from basic syntax to advanced concepts like decorators, generators, and file handling. Perfect for beginners and those looking to switch careers.",
    price: 0,
    enrollmentFee: 0,
    level: "Beginner",
    duration: "8 Weeks",
    thumbnail: "/images/courses/python.png",
    features: [
      "Real-world Projects",
      "Interactive Coding",
      "Certificate of Completion",
    ],
    curriculum: [
      {
        title: "Introduction to Python",
        topics: ["Installation", "Variables & Data Types", "Control Flow"],
      },
      {
        title: "Data Structures",
        topics: ["Lists", "Tuples", "Dictionaries", "Sets"],
      },
      {
        title: "Functions & Modules",
        topics: [
          "Defining Functions",
          "Lambda Functions",
          "Modules & Packages",
        ],
      },
      {
        title: "OOP in Python",
        topics: ["Classes & Objects", "Inheritance", "Polymorphism"],
      },
    ],
    instructor: {
      name: "Dr. Ali Raza",
      bio: "Senior Python Developer with 10+ years of experience.",
      avatar: "/avatars/ali-raza.jpg",
    },
    isPublished: true,
  },
  {
    title: "AI: DSML & Deep Learning Engineer",
    slug: "ai-dsml-deep-learning-engineer",
    category: "AI & Data Science",
    description:
      "Become an AI expert. Dive deep into Data Science, Machine Learning, and Deep Learning. Learn to build neural networks, work with TensorFlow and PyTorch, and solve complex data problems.",
    price: 0,
    enrollmentFee: 0,
    level: "Advanced",
    duration: "24 Weeks",
    thumbnail: "/images/courses/ai-ml.png",
    features: [
      "Industry Mentorship",
      "Capstone Project",
      "Job Placement Support",
    ],
    curriculum: [
      {
        title: "Data Science Foundations",
        topics: ["NumPy", "Pandas", "Matplotlib", "Exploratory Data Analysis"],
      },
      {
        title: "Machine Learning",
        topics: ["Regression", "Classification", "Clustering", "Scikit-learn"],
      },
      {
        title: "Deep Learning",
        topics: ["Neural Networks", "CNNs", "RNNs", "TensorFlow"],
      },
      {
        title: "NLP & Computer Vision",
        topics: ["Text Processing", "Image Recognition", "Transformers"],
      },
    ],
    instructor: {
      name: "Sarah Khan",
      bio: "AI Researcher and Lead Data Scientist.",
      avatar: "/avatars/sarah.jpg",
    },
    isPublished: true,
  },
  {
    title: "Generative & Agentic AI Engineer",
    slug: "generative-agentic-ai-engineer",
    category: "AI & Data Science",
    description:
      "Step into the future with Generative AI. Learn to build LLM-powered applications, work with LangChain, and design autonomous AI agents. The most cutting-edge course in our catalog.",
    price: 0,
    enrollmentFee: 0,
    level: "Advanced",
    duration: "16 Weeks",
    thumbnail: "/images/courses/genai.png",
    features: ["Latest Tech Stack", "Build Custom GPS", "Agentic Workflows"],
    curriculum: [
      {
        title: "Generative AI Basics",
        topics: ["LLMs", "Prompt Engineering", "Diffusion Models"],
      },
      {
        title: "Building with LLMs",
        topics: ["OpenAI API", "Hugging Face", "Fine-tuning"],
      },
      {
        title: "LangChain & Agents",
        topics: ["Chains", "Tools", "Memory", "Autonomous Agents"],
      },
      {
        title: "Deployment",
        topics: ["Deploying LLM Apps", "Optimization", "Ethics"],
      },
    ],
    instructor: {
      name: "TechZoq AI Team",
      bio: "Experts in GenAI and LLM development.",
      avatar: "/avatars/team.jpg",
    },
    isPublished: true,
  },
  {
    title: "MERN Stack: Full-Stack Web Development",
    slug: "mern-stack-full-stack-web-development",
    category: "Software Engineering",
    description:
      "Build modern web applications with MongoDB, Express, React, and Node.js. This course takes you from a blank screen to a deployed full-stack application.",
    price: 0,
    enrollmentFee: 0,
    level: "Intermediate",
    duration: "16 Weeks",
    thumbnail: "/images/courses/mern.png",
    features: ["Full-Stack Projects", "Modern React", "Backend mastery"],
    curriculum: [
      {
        title: "Frontend with React",
        topics: ["Components", "Hooks", "State Management", "Routing"],
      },
      {
        title: "Backend with Node/Express",
        topics: ["REST APIs", "Middleware", "Authentication"],
      },
      {
        title: "Database with MongoDB",
        topics: ["Schema Design", "Aggregation", "Mongoose"],
      },
      {
        title: "Integration & Deployment",
        topics: ["Connecting MERN", "Vercel/Heroku", "CI/CD"],
      },
    ],
    instructor: {
      name: "Usman Ahmed",
      bio: "Full Stack Tech Lead.",
      avatar: "/avatars/usman.jpg",
    },
    isPublished: true,
  },
  {
    title: "Digital Marketing Mastery",
    slug: "digital-marketing-mastery",
    category: "Digital Marketing",
    description:
      "Dominate the digital landscape. Learn SEO, Social Media Marketing, PPC, and Content Strategy to grow any business online.",
    price: 0,
    enrollmentFee: 0,
    level: "Beginner",
    duration: "10 Weeks",
    thumbnail: "/images/courses/marketing.png",
    features: ["Live Campaigns", "SEO Tools", "Certification"],
    curriculum: [
      {
        title: "SEO Fundamentals",
        topics: ["On-page SEO", "Off-page SEO", "Keyword Research"],
      },
      {
        title: "Social Media Marketing",
        topics: ["Facebook Ads", "Instagram Growth", "LinkedIn Strategy"],
      },
      {
        title: "PPC & Analytics",
        topics: ["Google Ads", "Google Analytics 4", "ROI Tracking"],
      },
      {
        title: "Content & Email",
        topics: ["Copywriting", "Email Automation", "Strategy"],
      },
    ],
    instructor: {
      name: "Maria Davis",
      bio: "Digital Marketing Strategist.",
      avatar: "/avatars/maria.jpg",
    },
    isPublished: true,
  },
  {
    title: "UI/UX Designing",
    slug: "ui-ux-designing",
    category: "Creative Design",
    description:
      "Design beautiful and functional user interfaces. Learn Figma, design principles, prototyping, and user research techniques.",
    price: 0,
    enrollmentFee: 0,
    level: "Beginner",
    duration: "12 Weeks",
    thumbnail: "/images/courses/uiux.png",
    features: ["Portfolio Building", "Figma Mastery", "Design Thinking"],
    curriculum: [
      {
        title: "Design Principles",
        topics: ["Typography", "Color Theory", "Layout"],
      },
      {
        title: "UX Research",
        topics: ["User Personas", "User Journey Maps", "Wireframing"],
      },
      {
        title: "UI Design with Figma",
        topics: ["Components", "Auto Layout", "Prototyping"],
      },
      {
        title: "Design Systems",
        topics: ["Building Libraries", "Collaboration", "Handoff"],
      },
    ],
    instructor: {
      name: "Bilal Khan",
      bio: "Senior Product Designer.",
      avatar: "/avatars/bilal.jpg",
    },
    isPublished: true,
  },
];

async function seed() {
  try {
    if (!DATABASE_URI) {
      throw new Error("DATABASE_URI is not defined in .env file");
    }

    console.log("\n" + "=".repeat(70));
    console.log("🌱 Database Seed Script");
    console.log("=".repeat(70));

    console.log("\n📍 Attempting to connect to MongoDB...");
    console.log(
      `   URI: ${DATABASE_URI.substring(0, 60)}...`
    );

    const startTime = Date.now();

    try {
      await mongoose.connect(DATABASE_URI, {
        serverSelectionTimeoutMS: 15000,
        socketTimeoutMS: 15000,
        connectTimeoutMS: 15000,
        maxPoolSize: 10,
        minPoolSize: 2,
      });
    } catch (connectionError: any) {
      console.error("\n❌ MongoDB Connection Failed");
      console.error(`   Error Code: ${connectionError.code}`);
      console.error(`   Error: ${connectionError.message}`);

      if (
        connectionError.code === "ETIMEOUT" ||
        connectionError.code === "ENOTFOUND"
      ) {
        console.error("\n⚠️  DNS/Network Timeout Issues:");
        console.error(
          "   1. Your IP may not be whitelisted in MongoDB Atlas"
        );
        console.error(
          "   2. Your network may be blocking the connection"
        );
        console.error("   3. The MongoDB Atlas cluster may be paused/stopped");
        console.error("\n✅ To fix:");
        console.error("   1. Go to MongoDB Atlas → Network Access");
        console.error("   2. Click 'Add IP Address'");
        console.error("   3. Select 'My Current IP' or 'Access Anywhere' (testing)");
        console.error("   4. Wait 1-2 minutes for changes to apply");
        console.error("   5. Run 'npm run test:db' to verify connection");
      } else if (connectionError.message.includes("authentication")) {
        console.error(
          "\n🔐 Authentication Failed:"
        );
        console.error("   Username or password is incorrect");
        console.error("   Verify in MongoDB Atlas → Database Access");
      }

      throw connectionError;
    }

    const connectionTime = Date.now() - startTime;
    console.log(`\n✅ Connected to MongoDB in ${connectionTime}ms`);

    // Get database info
    const dbName = mongoose.connection.db?.getName();
    console.log(`📊 Database: ${dbName || "default"}`);

    // Clear existing courses
    console.log("\n🗑️  Clearing existing courses...");
    const deleteResult = await Course.deleteMany({});
    console.log(`✅ Deleted ${deleteResult.deletedCount} existing courses`);

    // Insert seed courses
    console.log("\n📝 Inserting seed courses...");
    const createdCourses = await Course.insertMany(seedCourses);
    console.log(`\n✅ Successfully seeded ${createdCourses.length} courses:\n`);

    // Display created courses with details
    createdCourses.forEach((course: any, index: number) => {
      console.log(`   ${index + 1}. ${course.title}`);
      console.log(`      Slug: ${course.slug}`);
      console.log(`      Category: ${course.category}`);
      console.log(`      Level: ${course.level}`);
      console.log(`      Duration: ${course.duration}`);
      console.log();
    });

    // Get count of all courses
    const totalCourses = await Course.countDocuments();
    console.log(`📊 Total Courses in Database: ${totalCourses}`);

    await mongoose.disconnect();
    console.log("\n✅ Disconnected from MongoDB");
    console.log("=".repeat(70));
    console.log(
      "🎉 Seed completed successfully! Your courses are ready to use.\n"
    );
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Seed process failed");
    console.error((error as any).message);

    if ((error as any).code === "ETIMEOUT") {
      console.error(
        "\n💡 Need help? Run: npm run test:db"
      );
      console.error("   This will run a diagnostic to identify the issue.");
    }

    console.error("\n📖 Documentation: See MONGODB_SETUP.md for detailed help\n");
    process.exit(1);
  }
}

seed();
