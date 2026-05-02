"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

const CATEGORIES = [
  "AI & Data Science",
  "Software Engineering",
  "Creative Design",
  "Digital Marketing",
  "Business Intelligence",
];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];

interface CurriculumModule {
  title: string;
  topics: string[];
}

interface CourseDetail {
  _id: string;
  title: string;
  slug: string;
  category: string;
  level: string;
  duration: string;
  description: string;
  price: number;
  enrollmentFee: number;
  features: string[];
  curriculum: CurriculumModule[];
  instructor: { name: string; bio: string; avatar?: string } | null;
  isPublished: boolean;
  thumbnail: string;
}

export default function AdminCourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Edit form state — auto-open if ?edit=true in URL
  const [editing, setEditing] = useState(searchParams.get("edit") === "true");
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    category: "",
    level: "",
    duration: "",
    price: 0,
    enrollmentFee: 0,
    features: "",
    instructorName: "",
    instructorBio: "",
  });

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  async function fetchCourse() {
    try {
      const res = await fetch(`/api/admin/courses/${courseId}`);
      const json = await res.json();
      if (res.ok) {
        setCourse(json.data);
        // Populate edit form
        const d = json.data;
        setEditForm({
          title: d.title || "",
          description: d.description || "",
          category: d.category || "",
          level: d.level || "Beginner",
          duration: d.duration || "",
          price: d.price || 0,
          enrollmentFee: d.enrollmentFee || 0,
          features: (d.features || []).join(", "),
          instructorName: d.instructor?.name || "",
          instructorBio: d.instructor?.bio || "",
        });
      } else {
        toast.error(json.message || "Course not found");
      }
    } catch {
      toast.error("Failed to load course");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const slug = editForm.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      const features = editForm.features
        ? editForm.features.split(",").map((f) => f.trim()).filter(Boolean)
        : [];

      const instructor = editForm.instructorName
        ? { name: editForm.instructorName, bio: editForm.instructorBio }
        : undefined;

      const res = await fetch(`/api/admin/courses/${courseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editForm.title,
          slug,
          description: editForm.description,
          category: editForm.category,
          level: editForm.level,
          duration: editForm.duration,
          price: editForm.price,
          enrollmentFee: editForm.enrollmentFee,
          features,
          instructor,
        }),
      });
      const json = await res.json();
      if (res.ok) {
        toast.success("Course updated!");
        setEditing(false);
        fetchCourse();
      } else {
        toast.error(json.message || "Failed to update");
      }
    } catch {
      toast.error("Failed to update course");
    } finally {
      setSaving(false);
    }
  }

  async function togglePublish() {
    if (!course) return;
    try {
      const res = await fetch(`/api/admin/courses/${courseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !course.isPublished }),
      });
      const json = await res.json();
      if (res.ok) {
        toast.success(course.isPublished ? "Course unpublished" : "Course published");
        fetchCourse();
      } else {
        toast.error(json.message || "Failed to update");
      }
    } catch {
      toast.error("Failed to update status");
    }
  }

  if (loading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[50vh]">
        <p className="text-xl text-gray-600">Course not found</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
              <button
                type="button"
                onClick={() => router.push("/admin/courses")}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Courses
              </button>

              {/* Course Info / Edit Form */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Course Details</h2>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={togglePublish}
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        course.isPublished
                          ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                    >
                      {course.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      {course.isPublished ? "Unpublish" : "Publish"}
                    </button>
                    {!editing && (
                      <button
                        type="button"
                        onClick={() => setEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </div>

                {!editing ? (
                  <>
                    {course.thumbnail && (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full max-h-48 object-cover rounded-xl mb-4"
                      />
                    )}
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {course.title}
                    </h1>
                    <p className="text-gray-600 mb-4">{course.description}</p>
                    <div className="flex flex-wrap gap-3 mb-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {course.category}
                      </span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                        {course.level}
                      </span>
                      {course.duration && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          {course.duration}
                        </span>
                      )}
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${course.isPublished ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {course.isPublished ? "Published" : "Draft"}
                      </span>
                    </div>
                    {course.price > 0 && (
                      <div className="mb-3 space-y-1">
                        <p className="text-lg font-bold text-gray-900">Total Fee: PKR {course.price.toLocaleString()}</p>
                        {course.enrollmentFee > 0 && (
                          <p className="text-sm text-gray-600">
                            Enrollment Fee: PKR {course.enrollmentFee.toLocaleString()}
                            <span className="text-gray-400 ml-1">(part of total)</span>
                            {" · "}
                            Remaining: PKR {(course.price - course.enrollmentFee).toLocaleString()}
                          </p>
                        )}
                      </div>
                    )}
                    {course.instructor?.name && (
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-semibold">Instructor:</span> {course.instructor.name}
                        {course.instructor.bio && ` — ${course.instructor.bio}`}
                      </p>
                    )}
                    {course.features && course.features.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {course.features.map((f, i) => (
                          <span key={i} className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">{f}</span>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <form onSubmit={handleSaveEdit} className="space-y-5 text-black">
                    <div>
                      <label htmlFor="editTitle" className="block text-sm font-bold text-gray-900 mb-1">Title *</label>
                      <input
                        id="editTitle"
                        type="text"
                        required
                        value={editForm.title}
                        onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="editDesc" className="block text-sm font-bold text-gray-900 mb-1">Description *</label>
                      <textarea
                        id="editDesc"
                        required
                        rows={3}
                        value={editForm.description}
                        onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="editCategory" className="block text-sm font-bold text-gray-900 mb-1">Category *</label>
                        <select
                          id="editCategory"
                          required
                          value={editForm.category}
                          onChange={(e) => setEditForm((p) => ({ ...p, category: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                        >
                          {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="editLevel" className="block text-sm font-bold text-gray-900 mb-1">Level</label>
                        <select
                          id="editLevel"
                          value={editForm.level}
                          onChange={(e) => setEditForm((p) => ({ ...p, level: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                        >
                          {LEVELS.map((level) => (
                            <option key={level} value={level}>{level}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="editDuration" className="block text-sm font-bold text-gray-900 mb-1">Duration</label>
                        <input
                          id="editDuration"
                          type="text"
                          value={editForm.duration}
                          onChange={(e) => setEditForm((p) => ({ ...p, duration: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g. 12 Weeks"
                        />
                      </div>
                      <div>
                        <label htmlFor="editPrice" className="block text-sm font-bold text-gray-900 mb-1">Total Fee (PKR)</label>
                        <input
                          id="editPrice"
                          type="number"
                          min={0}
                          value={editForm.price}
                          onChange={(e) => setEditForm((p) => ({ ...p, price: Number(e.target.value) }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="editEnrollmentFee" className="block text-sm font-bold text-gray-900 mb-1">Enrollment Fee (PKR)</label>
                      <p className="text-xs text-gray-500 mb-1">Part of total fee, not additional. e.g. Total 40,000 — Enrollment 5,000 — Remaining 35,000</p>
                      <input
                        id="editEnrollmentFee"
                        type="number"
                        min={0}
                        max={editForm.price}
                        value={editForm.enrollmentFee}
                        onChange={(e) => setEditForm((p) => ({ ...p, enrollmentFee: Math.min(Number(e.target.value), p.price) }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                      />
                      {editForm.enrollmentFee > 0 && editForm.price > 0 && (
                        <p className="text-xs text-gray-500 mt-1">Remaining after enrollment: PKR {(editForm.price - editForm.enrollmentFee).toLocaleString()}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="editFeatures" className="block text-sm font-bold text-gray-900 mb-1">Features (comma-separated)</label>
                      <input
                        id="editFeatures"
                        type="text"
                        value={editForm.features}
                        onChange={(e) => setEditForm((p) => ({ ...p, features: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                        placeholder="Certificate, Projects, Live Sessions"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="editInstructorName" className="block text-sm font-bold text-gray-900 mb-1">Instructor Name</label>
                        <input
                          id="editInstructorName"
                          type="text"
                          value={editForm.instructorName}
                          onChange={(e) => setEditForm((p) => ({ ...p, instructorName: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="editInstructorBio" className="block text-sm font-bold text-gray-900 mb-1">Instructor Bio</label>
                        <input
                          id="editInstructorBio"
                          type="text"
                          value={editForm.instructorBio}
                          onChange={(e) => setEditForm((p) => ({ ...p, instructorBio: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditing(false)}
                        className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
      </motion.div>
    </div>
  );
}
