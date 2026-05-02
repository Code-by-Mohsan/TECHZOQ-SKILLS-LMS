import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { requirePermissions } from "@/lib/rbac";
import Course from "@/models/Course";

const seedData = [
  {
    title: "AI For Beginners",
    slug: "ai-for-beginners",
    category: "AI & Data Science",
    description:
      "Start your AI journey from scratch. Learn machine learning fundamentals, neural networks, and practical AI applications. No prior experience needed.",
    level: "Beginner",
    duration: "10 Weeks",
    features: [
      "Hands-on Projects",
      "Certificate of Completion",
      "Community Access",
    ],
    curriculum: [
      {
        title: "Introduction to AI",
        topics: ["What is AI?", "History of AI", "AI Applications"],
      },
      {
        title: "Machine Learning Basics",
        topics: ["Supervised Learning", "Unsupervised Learning", "Model Training"],
      },
    ],
    instructor: {
      name: "Dr. Ali Raza",
      bio: "AI Researcher with 10+ years experience",
      avatar: "/avatars/ali-raza.jpg",
    },
    lessons: [
      {
        title: "What is Artificial Intelligence?",
        description: "Introduction to AI concepts and real-world applications",
        videoUrl: "https://www.youtube.com/watch?v=ad79nYk2keg",
        order: 1,
        duration: "15 min",
      },
      {
        title: "History and Evolution of AI",
        description: "From Turing to modern deep learning",
        videoUrl: "https://www.youtube.com/watch?v=056v4OxKwlI",
        order: 2,
        duration: "12 min",
      },
      {
        title: "Machine Learning Fundamentals",
        description: "Core concepts of supervised and unsupervised learning",
        videoUrl: "https://www.youtube.com/watch?v=ukzFI9rgwfU",
        order: 3,
        duration: "20 min",
      },
      {
        title: "Neural Networks Explained",
        description: "How neural networks learn and make decisions",
        videoUrl: "https://www.youtube.com/watch?v=aircAruvnKk",
        order: 4,
        duration: "18 min",
      },
      {
        title: "Building Your First AI Model",
        description: "Hands-on project building a simple classifier",
        videoUrl: "https://www.youtube.com/watch?v=tPYj3fFJGjk",
        order: 5,
        duration: "25 min",
      },
    ],
    quizzes: [
      {
        lessonOrder: 1,
        question: "What does AI stand for?",
        options: [
          "Automated Intelligence",
          "Artificial Intelligence",
          "Applied Informatics",
          "Advanced Integration",
        ],
        correctAnswer: 1,
      },
      {
        lessonOrder: 3,
        question:
          "Which type of machine learning uses labeled data for training?",
        options: [
          "Unsupervised Learning",
          "Reinforcement Learning",
          "Supervised Learning",
          "Transfer Learning",
        ],
        correctAnswer: 2,
      },
    ],
  },
  {
    title: "Web Development Bootcamp",
    slug: "web-development-bootcamp",
    category: "Software Engineering",
    description:
      "Complete full-stack web development course. Master HTML, CSS, JavaScript, React, Node.js, and MongoDB to build modern web applications from scratch.",
    level: "Intermediate",
    duration: "16 Weeks",
    features: [
      "Full-Stack Projects",
      "Live Mentorship",
      "Job-Ready Portfolio",
    ],
    curriculum: [
      {
        title: "Frontend Foundations",
        topics: ["HTML5", "CSS3", "JavaScript ES6+"],
      },
      {
        title: "React & Modern UI",
        topics: ["Components", "Hooks", "State Management"],
      },
    ],
    instructor: {
      name: "Usman Ahmed",
      bio: "Full Stack Tech Lead with 8+ years experience",
      avatar: "/avatars/usman.jpg",
    },
    lessons: [
      {
        title: "HTML Fundamentals",
        description: "Learn the building blocks of web pages",
        videoUrl: "https://www.youtube.com/watch?v=UB1O30fR-EE",
        order: 1,
        duration: "20 min",
      },
      {
        title: "CSS Styling & Layout",
        description: "Master CSS flexbox, grid, and responsive design",
        videoUrl: "https://www.youtube.com/watch?v=1Rs2ND1ryYc",
        order: 2,
        duration: "25 min",
      },
      {
        title: "JavaScript Essentials",
        description: "Variables, functions, DOM manipulation",
        videoUrl: "https://www.youtube.com/watch?v=W6NZfCJ1q3c",
        order: 3,
        duration: "30 min",
      },
      {
        title: "React Components & Hooks",
        description: "Building interactive UIs with React",
        videoUrl: "https://www.youtube.com/watch?v=w7ejDZ8SWv8",
        order: 4,
        duration: "28 min",
      },
      {
        title: "Node.js & Express Backend",
        description: "Building REST APIs with Node.js",
        videoUrl: "https://www.youtube.com/watch?v=Oe421EPjeBE",
        order: 5,
        duration: "22 min",
      },
    ],
    quizzes: [
      {
        lessonOrder: 1,
        question: "What does HTML stand for?",
        options: [
          "Hyper Text Markup Language",
          "High Tech Modern Language",
          "Hyper Transfer Markup Language",
          "Home Tool Markup Language",
        ],
        correctAnswer: 0,
      },
      {
        lessonOrder: 3,
        question: "Which keyword is used to declare a variable in modern JavaScript?",
        options: ["var", "let", "dim", "define"],
        correctAnswer: 1,
      },
    ],
  },
  {
    title: "Freelancing Mastery",
    slug: "freelancing-mastery",
    category: "Business Intelligence",
    description:
      "Learn how to build a successful freelancing career. Master client communication, project management, pricing strategies, and building your personal brand online.",
    level: "Beginner",
    duration: "6 Weeks",
    features: [
      "Real Client Projects",
      "Portfolio Templates",
      "Pricing Calculator",
    ],
    curriculum: [
      {
        title: "Getting Started",
        topics: ["Choosing Your Niche", "Setting Up Profiles", "First Client"],
      },
      {
        title: "Growing Your Business",
        topics: ["Pricing Strategy", "Client Management", "Scaling"],
      },
    ],
    instructor: {
      name: "Maria Davis",
      bio: "6-Figure Freelancer & Business Coach",
      avatar: "/avatars/maria.jpg",
    },
    lessons: [
      {
        title: "Introduction to Freelancing",
        description: "Why freelancing and how to get started",
        videoUrl: "https://www.youtube.com/watch?v=bMknfKXIFA8",
        order: 1,
        duration: "15 min",
      },
      {
        title: "Finding Your Niche",
        description: "Identify your skills and target market",
        videoUrl: "https://www.youtube.com/watch?v=GKJMCh0DN-s",
        order: 2,
        duration: "12 min",
      },
      {
        title: "Building Your Portfolio",
        description: "Create a portfolio that wins clients",
        videoUrl: "https://www.youtube.com/watch?v=_yTOPJIxnl0",
        order: 3,
        duration: "18 min",
      },
      {
        title: "Pricing & Proposals",
        description: "How to price your services and write winning proposals",
        videoUrl: "https://www.youtube.com/watch?v=jE53O1PzmNU",
        order: 4,
        duration: "20 min",
      },
      {
        title: "Client Management & Scaling",
        description: "Managing clients and growing your freelance business",
        videoUrl: "https://www.youtube.com/watch?v=H6UajGpW-20",
        order: 5,
        duration: "22 min",
      },
    ],
    quizzes: [
      {
        lessonOrder: 1,
        question: "What is the first step to start freelancing?",
        options: [
          "Create a website",
          "Identify your skills and niche",
          "Set high prices",
          "Quit your job immediately",
        ],
        correctAnswer: 1,
      },
      {
        lessonOrder: 4,
        question: "Which pricing model charges based on the value delivered?",
        options: [
          "Hourly pricing",
          "Fixed pricing",
          "Value-based pricing",
          "Cost-plus pricing",
        ],
        correctAnswer: 2,
      },
    ],
  },
];

export async function POST(req: Request) {
  try {
    const permissionCheck = await requirePermissions(req, ["course.create"]);
    if (permissionCheck.error) return permissionCheck.error;

    await dbConnect();

    const results = [];

    for (const courseData of seedData) {
      const { lessons: _lessons, quizzes: _quizzes, ...courseFields } = courseData;

      // Check if course already exists
      const existing = await Course.findOne({ slug: courseFields.slug });
      if (existing) {
        results.push({ slug: courseFields.slug, status: "skipped" });
        continue;
      }

      await Course.create(courseFields);

      results.push({
        slug: courseFields.slug,
        status: "created",
        lessons: 0,
        quizzes: 0,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Seed data created successfully",
      data: results,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json(
      { success: false, message },
      { status: 500 },
    );
  }
}
