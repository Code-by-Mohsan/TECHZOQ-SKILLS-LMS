import mongoose from "mongoose";

const DemoRegistrationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
  },
  phone: {
    type: String,
    required: [true, "Please provide a phone number"],
  },
  interestedCourses: {
    type: [String],
    required: [true, "Please select at least one course"],
    validate: {
      validator: (v: string[]) => Array.isArray(v) && v.length > 0,
      message: "Please select at least one course",
    },
  },
  city: {
    type: String,
  },
  message: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.DemoRegistration ||
  mongoose.model("DemoRegistration", DemoRegistrationSchema);
