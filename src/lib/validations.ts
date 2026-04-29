import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const signupSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["student", "instructor"]).optional(),
  phone: z.string().min(1, "Phone is required").max(20),
  address: z.string().min(1, "Address is required").max(200),
  city: z.string().min(1, "City is required").max(100),
  educationLevel: z.string().optional(),
  institution: z.string().optional(),
  degree: z.string().optional(),
  graduationYear: z.union([z.string(), z.number()]).optional(),
  interests: z.array(z.string()).optional(),
});

export const applySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Confirm password is required"),
  phone: z.string().min(1, "Phone is required").max(20),
  address: z.string().min(1, "Address is required").max(500),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  educationLevel: z.string().optional(),
  courseIds: z.array(z.string().min(1)).min(1, "Select at least one course"),
  couponCode: z.string().max(30).optional(),
  referralCode: z.string().max(30).optional(),
  leadSource: z.string().max(50).optional(),
  campaignSource: z.string().max(120).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required").max(200),
  message: z.string().min(1, "Message is required").max(5000),
});

export const enrollSchema = z.object({
  courseId: z.string().min(1, "Course ID is required"),
});

export const quizSubmitSchema = z.object({
  quizId: z.string().min(1, "Quiz ID is required"),
  selectedAnswer: z.number().int().min(0).max(3),
});
