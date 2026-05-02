import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: [true, "Please provide a phone number"],
    },
    address: {
      type: String,
      required: [true, "Please provide your address"],
    },
    dateOfBirth: {
      type: Date,
      default: null,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: null,
    },
    city: {
      type: String,
      required: [true, "Please provide your city"],
    },
    education: {
      level: {
        type: String,
      },
      institution: String,
      degree: String,
      graduationYear: Number,
    },
    occupation: {
      type: String,
      default: "Student",
    },
    interests: [String],
  },
  { timestamps: true },
);

export default mongoose.models.Student ||
  mongoose.model("Student", StudentSchema);
