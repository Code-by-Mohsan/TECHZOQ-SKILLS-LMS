"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
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

export default function NewCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [curriculum, setCurriculum] = useState<CurriculumModule[]>([]);
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [newTopicInputs, setNewTopicInputs] = useState<Record<number, string>>({});

  function addModule() {
    if (!newModuleTitle.trim()) return;
    setCurriculum((prev) => [...prev, { title: newModuleTitle.trim(), topics: [] }]);
    setNewModuleTitle("");
  }

  function removeModule(idx: number) {
    setCurriculum((prev) => prev.filter((_, i) => i !== idx));
    setNewTopicInputs((prev) => {
      const copy = { ...prev };
      delete copy[idx];
      return copy;
    });
  }

  function addTopic(moduleIdx: number) {
    const topic = (newTopicInputs[moduleIdx] || "").trim();
    if (!topic) return;
    setCurriculum((prev) =>
      prev.map((m, i) => (i === moduleIdx ? { ...m, topics: [...m.topics, topic] } : m))
    );
    setNewTopicInputs((prev) => ({ ...prev, [moduleIdx]: "" }));
  }

  function removeTopic(moduleIdx: number, topicIdx: number) {
    setCurriculum((prev) =>
      prev.map((m, i) =>
        i === moduleIdx ? { ...m, topics: m.topics.filter((_, ti) => ti !== topicIdx) } : m
      )
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Generate slug from title
    const title = formData.get("title") as string;
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    formData.set("slug", slug);

    // Attach curriculum as JSON
    formData.set("curriculum", JSON.stringify(curriculum));

    // Attach instructor as JSON
    const instructorName = formData.get("instructorName") as string;
    const instructorBio = formData.get("instructorBio") as string;
    if (instructorName) {
      formData.set(
        "instructor",
        JSON.stringify({ name: instructorName, bio: instructorBio || "" })
      );
    }
    formData.delete("instructorName");
    formData.delete("instructorBio");

    try {
      const res = await fetch("/api/admin/courses", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (res.ok) {
        toast.success("Course created!");
        router.push(`/admin/courses/${json.data._id}`);
      } else {
        toast.error(json.message || "Failed to create course");
      }
    } catch {
      toast.error("Failed to create course");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
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

              <h1 className="text-3xl font-bold text-gray-900 mb-8">
                Create New Course
              </h1>

              <form
                onSubmit={handleSubmit}
                className="bg-white text-black rounded-2xl shadow-lg border border-gray-100 p-8 space-y-6"
              >
                {/* Title */}
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-bold text-gray-900 mb-2"
                  >
                    Title *
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="e.g. Web Development Bootcamp"
                  />
                </div>

                {/* Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-bold text-gray-900 mb-2"
                  >
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Describe what students will learn..."
                  />
                </div>

                {/* Category & Level */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="category"
                      className="block text-sm font-bold text-gray-900 mb-2"
                    >
                      Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    >
                      <option value="">Select category</option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="level"
                      className="block text-sm font-bold text-gray-900 mb-2"
                    >
                      Level
                    </label>
                    <select
                      id="level"
                      name="level"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    >
                      {LEVELS.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Duration, Price */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="duration"
                      className="block text-sm font-bold text-gray-900 mb-2"
                    >
                      Duration
                    </label>
                    <input
                      id="duration"
                      name="duration"
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="e.g. 12 Weeks"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="price"
                      className="block text-sm font-bold text-gray-900 mb-2"
                    >
                      Total Fee (PKR)
                    </label>
                    <input
                      id="price"
                      name="price"
                      type="number"
                      min={0}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="0 for free"
                    />
                  </div>
                </div>

                {/* Enrollment Fee */}
                <div>
                  <label
                    htmlFor="enrollmentFee"
                    className="block text-sm font-bold text-gray-900 mb-2"
                  >
                    Enrollment Fee (PKR)
                  </label>
                  <p className="text-xs text-gray-500 mb-1">Part of total fee, not an additional charge. e.g. if total fee is 40,000 and enrollment fee is 5,000 then remaining fee is 35,000.</p>
                  <input
                    id="enrollmentFee"
                    name="enrollmentFee"
                    type="number"
                    min={0}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="0"
                  />
                </div>

                {/* Features */}
                <div>
                  <label
                    htmlFor="features"
                    className="block text-sm font-bold text-gray-900 mb-2"
                  >
                    Features
                  </label>
                  <input
                    id="features"
                    name="features"
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Comma-separated, e.g. Certificate, Projects, Live Sessions"
                  />
                </div>

                {/* Instructor */}
                <fieldset className="border border-gray-200 rounded-xl p-5 space-y-4">
                  <legend className="text-sm font-bold text-gray-900 px-2">Instructor</legend>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="instructorName" className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        id="instructorName"
                        name="instructorName"
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Instructor name"
                      />
                    </div>
                    <div>
                      <label htmlFor="instructorBio" className="block text-sm font-medium text-gray-700 mb-1">
                        Bio
                      </label>
                      <input
                        id="instructorBio"
                        name="instructorBio"
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Short bio"
                      />
                    </div>
                  </div>
                </fieldset>

                {/* Curriculum */}
                <fieldset className="border border-gray-200 rounded-xl p-5 space-y-4">
                  <legend className="text-sm font-bold text-gray-900 px-2">Curriculum</legend>

                  {curriculum.map((mod, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">Module {idx + 1}: {mod.title}</h4>
                        <button
                          type="button"
                          onClick={() => removeModule(idx)}
                          className="p-1 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <ul className="space-y-1 mb-3">
                        {mod.topics.map((topic, ti) => (
                          <li key={ti} className="flex items-center justify-between text-sm text-gray-700 bg-white px-3 py-1.5 rounded-lg">
                            <span>• {topic}</span>
                            <button type="button" onClick={() => removeTopic(idx, ti)} className="text-red-400 hover:text-red-600">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </li>
                        ))}
                      </ul>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newTopicInputs[idx] || ""}
                          onChange={(e) => setNewTopicInputs((prev) => ({ ...prev, [idx]: e.target.value }))}
                          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTopic(idx); } }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                          placeholder="Add topic and press Enter"
                        />
                        <button
                          type="button"
                          onClick={() => addTopic(idx)}
                          className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newModuleTitle}
                      onChange={(e) => setNewModuleTitle(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addModule(); } }}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Module title, e.g. Introduction to HTML"
                    />
                    <button
                      type="button"
                      onClick={addModule}
                      className="px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </fieldset>

                {/* Thumbnail */}
                <div>
                  <label
                    htmlFor="thumbnail"
                    className="block text-sm font-bold text-gray-900 mb-2"
                  >
                    Thumbnail Image
                  </label>
                  <input
                    id="thumbnail"
                    name="thumbnail"
                    type="file"
                    accept="image/*"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 file:font-medium"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 shadow-lg"
                >
                  {loading ? "Creating..." : "Create Course"}
                </button>
              </form>
      </motion.div>
    </div>
  );
}
