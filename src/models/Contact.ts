import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema({
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
  },
  company: {
    type: String,
  },
  subject: {
    type: String,
    required: [true, "Please provide a subject"],
  },
  message: {
    type: String,
    required: [true, "Please provide a message"],
  },
  inquiryType: {
    type: String,
    default: "general",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Contact ||
  mongoose.model("Contact", ContactSchema);
