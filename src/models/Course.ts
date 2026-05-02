import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a course title"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Please provide a slug"],
      unique: true,
    },
    category: {
      type: String,
      required: [true, "Please provide a category"],
      enum: [
        "AI & Data Science",
        "Software Engineering",
        "Creative Design",
        "Digital Marketing",
        "Business Intelligence",
      ],
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
    },
    price: {
      type: Number,
      default: 0,
    },
    enrollmentFee: {
      type: Number,
      default: 0,
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    duration: {
      type: String,
      required: false,
    },
    thumbnail: {
      type: String,
      required: false,
    },
    curriculum: [
      {
        title: String,
        topics: [String],
      },
    ],
    features: [String],
    instructor: {
      name: String,
      bio: String,
      avatar: String,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Course || mongoose.model("Course", CourseSchema);
