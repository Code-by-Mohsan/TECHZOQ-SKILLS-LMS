"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import toast from "react-hot-toast";
import { trackEvent } from "@/lib/analytics";
import {
  ChevronRight,
  ChevronLeft,
  Loader2,
  CheckCircle2,
  User,
  MapPin,
  Phone,
  GraduationCap,
  BookOpen,
  Sparkles,
  Award,
  Users,
  Calendar,
  Lock,
} from "lucide-react";

interface CourseOption {
  _id: string;
  title: string;
  slug: string;
  category: string;
  duration: string;
}

export default function ApplyPageWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ApplyPage />
    </Suspense>
  );
}

function ApplyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedCourse = searchParams.get("course");
  const couponParam = searchParams.get("coupon") || "";
  const referralParam =
    searchParams.get("ref") || searchParams.get("referral") || "";
  const utmSource = searchParams.get("utm_source") || "";
  const utmCampaign = searchParams.get("utm_campaign") || "";

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    gender: "" as "" | "male" | "female" | "other",
    educationLevel: "" as string,
    courseIds: [] as string[],
    couponCode: couponParam,
    referralCode: referralParam,
    leadSource: utmSource,
    campaignSource: utmCampaign,
  });

  useEffect(() => {
    fetch("/api/courses")
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((json) => {
        const list = json.data || [];
        setCourses(list);
        if (preselectedCourse) {
          const found = list.find(
            (c: CourseOption) => c.slug === preselectedCourse,
          );
          if (found) {
            setFormData((prev) => ({
              ...prev,
              courseIds: [found._id],
            }));
          }
        }
      })
      .catch(() => {})
      .finally(() => setCoursesLoading(false));
  }, [preselectedCourse]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleCourse = (courseId: string) => {
    setFormData((prev) => ({
      ...prev,
      courseIds: prev.courseIds.includes(courseId)
        ? prev.courseIds.filter((id) => id !== courseId)
        : [...prev.courseIds, courseId],
    }));
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        toast.error("Please fill in all required fields");
        return false;
      }
      if (formData.password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return false;
      }
    }
    if (step === 2) {
      if (!formData.phone || !formData.address) {
        toast.error("Please fill in phone and address");
        return false;
      }
    }
    if (step === 3) {
      if (formData.courseIds.length === 0) {
        toast.error("Please select at least one course");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    if (step < 3) {
      setStep((prev) => prev + 1);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          gender: formData.gender || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Application failed");
      }
      trackEvent("application_submit", {
        course_count: formData.courseIds.length,
        lead_source: formData.leadSource || "direct",
        campaign_source: formData.campaignSource || "",
      });
      toast.success("Application submitted successfully!");
      setTimeout(() => {
        router.push("/dashboard/student");
        router.refresh();
      }, 1500);
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Application failed",
      );
    } finally {
      setLoading(false);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-4 pt-24">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-tr from-pink-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="w-full max-w-6xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left Side - Branding */}
            <div className="hidden lg:block">
              <Link href="/" className="mb-8 inline-block">
                <Image
                  src="/logo.svg"
                  alt="TechZoq Logo"
                  width={200}
                  height={60}
                  className="h-12 w-auto"
                  priority
                />
              </Link>

              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium text-sm shadow-lg">
                  <Sparkles className="w-4 h-4" />
                  <span>Apply for Our Tech Courses</span>
                </div>

                <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                  Launch Your{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                    Tech Career
                  </span>
                </h1>

                <p className="text-xl text-gray-700 leading-relaxed">
                  Apply for hands-on, in-person tech courses taught by industry
                  experts. Build real skills and transform your future.
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-6">
                  <div className="bg-white rounded-2xl p-4 shadow-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        2,000+
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">Active Students</div>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <Award className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">6</div>
                    </div>
                    <div className="text-sm text-gray-600">Expert Courses</div>
                  </div>
                </div>

                {/* Testimonial */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                      A
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">Ahmed Khan</div>
                      <div className="text-sm text-gray-600">
                        Full Stack Developer
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 italic">
                    &quot;TechZoq transformed my career. The courses are practical
                    and the instructors are amazing!&quot;
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10 border border-gray-100">
              {/* Mobile Logo */}
              <div className="lg:hidden mb-6 text-center">
                <Link href="/" className="inline-block">
                  <Image
                    src="/logo.svg"
                    alt="TechZoq Logo"
                    width={150}
                    height={45}
                    className="h-10 w-auto"
                    priority
                  />
                </Link>
              </div>

              {/* Progress Steps */}
              <div className="flex justify-between mb-8 relative">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 rounded-full" />
                <div
                  className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 -z-10 rounded-full transition-all duration-500"
                  style={{ width: `${((step - 1) / 2) * 100}%` }}
                />
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`relative flex flex-col items-center gap-2 transition-all duration-300 ${
                      step >= i ? "scale-100" : "scale-90 opacity-50"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all shadow-lg ${
                        step > i
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                          : step === i
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white ring-4 ring-blue-200"
                            : "bg-white text-gray-400 border-2 border-gray-200"
                      }`}
                    >
                      {step > i ? <CheckCircle2 className="w-6 h-6" /> : i}
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        step >= i ? "text-gray-900" : "text-gray-400"
                      }`}
                    >
                      {i === 1 ? "Account" : i === 2 ? "Details" : "Courses"}
                    </span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="relative">
                <AnimatePresence mode="wait" custom={step}>
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      custom={1}
                      variants={variants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.3 }}
                      className="space-y-5"
                    >
                      <div className="text-center mb-6">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
                          <User className="w-8 h-8 text-blue-600" />
                          Create Your Account
                        </h2>
                        <p className="text-gray-600">
                          Let&apos;s get started with the basics
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                          placeholder="john@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <Lock className="w-4 h-4 inline mr-1" />
                          Password *
                        </label>
                        <input
                          name="password"
                          type="password"
                          required
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                          placeholder="••••••••"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Minimum 6 characters
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Confirm Password *
                        </label>
                        <input
                          name="confirmPassword"
                          type="password"
                          required
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                          placeholder="••••••••"
                        />
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      custom={1}
                      variants={variants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.3 }}
                      className="space-y-5"
                    >
                      <div className="text-center mb-6">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
                          <MapPin className="w-8 h-8 text-purple-600" />
                          Your Details
                        </h2>
                        <p className="text-gray-600">
                          Help us know you better
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          Phone Number *
                        </label>
                        <input
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                          placeholder="+92 300 1234567"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Address *
                        </label>
                        <input
                          name="address"
                          required
                          value={formData.address}
                          onChange={handleChange}
                          className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                          placeholder="123 Main Street, Lahore"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Date of Birth
                          </label>
                          <input
                            name="dateOfBirth"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Gender
                          </label>
                          <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                          >
                            <option value="">Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <GraduationCap className="w-4 h-4" />
                          Education Level
                        </label>
                        <input
                          type="text"
                          name="educationLevel"
                          value={formData.educationLevel}
                          onChange={handleChange}
                          placeholder="e.g. Matric, Intermediate, Graduate"
                          className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                        />
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      key="step3"
                      custom={1}
                      variants={variants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.3 }}
                      className="space-y-5"
                    >
                      <div className="text-center mb-6">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
                          <BookOpen className="w-8 h-8 text-pink-600" />
                          Select Courses
                        </h2>
                        <p className="text-gray-600">
                          Choose the courses you want to apply for
                        </p>
                      </div>

                      {coursesLoading ? (
                        <div className="flex items-center justify-center py-12">
                          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600" />
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto pr-2">
                          {courses.map((course) => (
                            <button
                              key={course._id}
                              type="button"
                              onClick={() => toggleCourse(course._id)}
                              className={`text-left p-4 rounded-xl border-2 transition-all ${
                                formData.courseIds.includes(course._id)
                                  ? "border-blue-500 bg-blue-50 shadow-lg"
                                  : "border-gray-200 bg-white hover:border-gray-300"
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div
                                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                    formData.courseIds.includes(course._id)
                                      ? "border-blue-500 bg-blue-500"
                                      : "border-gray-300"
                                  }`}
                                >
                                  {formData.courseIds.includes(course._id) && (
                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-bold text-gray-900 text-sm mb-1">
                                    {course.title}
                                  </h4>
                                  <div className="flex items-center gap-3 text-xs text-gray-500">
                                    <span>{course.category}</span>
                                    <span>·</span>
                                    <span>{course.duration}</span>
                                  </div>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                      <p className="text-sm text-gray-500 text-center">
                        Selected {formData.courseIds.length} course
                        {formData.courseIds.length !== 1 ? "s" : ""}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex gap-4 mt-8">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={() => setStep((prev) => prev - 1)}
                      className="flex-1 px-6 py-4 bg-white hover:bg-gray-50 text-gray-900 font-bold rounded-xl transition-all border-2 border-gray-200 flex items-center justify-center gap-2"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      Back
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : step === 3 ? (
                      <>
                        Submit Application{" "}
                        <CheckCircle2 className="w-5 h-5" />
                      </>
                    ) : (
                      <>
                        Continue <ChevronRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              <p className="text-center text-gray-600 mt-8 text-sm">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                >
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
