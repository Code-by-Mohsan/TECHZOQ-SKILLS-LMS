"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Loader2, CheckCircle2, User, MapPin, Phone, GraduationCap, BookOpen, Users } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { courses } from '@/data/courses';

export default function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    city: '',
    role: 'student' as 'student' | 'instructor',
    educationLevel: 'Undergraduate',
    institution: '',
    degree: '',
    graduationYear: new Date().getFullYear(),
    interests: [] as string[],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleInterest = (courseId: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(courseId)
        ? prev.interests.filter(id => id !== courseId)
        : [...prev.interests, courseId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(prev => prev + 1);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      toast.success('Account created successfully!');
      setTimeout(() => {
        router.push(redirectTo || '/dashboard/student');
        router.refresh();
      }, 1500);

    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
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
            className={`relative flex flex-col items-center gap-2 transition-all duration-300 ${step >= i ? 'scale-100' : 'scale-90 opacity-50'
              }`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all shadow-lg ${step > i
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                : step === i
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white ring-4 ring-blue-200'
                  : 'bg-white text-gray-400 border-2 border-gray-200'
              }`}>
              {step > i ? <CheckCircle2 className="w-6 h-6" /> : i}
            </div>
            <span className={`text-xs font-medium ${step >= i ? 'text-gray-900' : 'text-gray-400'}`}>
              {i === 1 ? 'Account' : i === 2 ? 'Details' : 'Interests'}
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
                <p className="text-gray-600">Let's get started with the basics</p>
              </div>

              {/* Role Selector */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">I want to join as</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, role: 'student' }))}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                      formData.role === 'student'
                        ? 'border-blue-500 bg-blue-50 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <GraduationCap className={`w-6 h-6 ${formData.role === 'student' ? 'text-blue-600' : 'text-gray-400'}`} />
                    <div className="text-left">
                      <p className={`font-bold text-sm ${formData.role === 'student' ? 'text-blue-900' : 'text-gray-700'}`}>Student</p>
                      <p className="text-xs text-gray-500">Learn & grow skills</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, role: 'instructor' }))}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                      formData.role === 'instructor'
                        ? 'border-purple-500 bg-purple-50 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <Users className={`w-6 h-6 ${formData.role === 'instructor' ? 'text-purple-600' : 'text-gray-400'}`} />
                    <div className="text-left">
                      <p className={`font-bold text-sm ${formData.role === 'instructor' ? 'text-purple-900' : 'text-gray-700'}`}>Instructor</p>
                      <p className="text-xs text-gray-500">Requires admin approval</p>
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
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
                  Contact Information
                </h2>
                <p className="text-gray-600">Help us reach you better</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                <input
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  placeholder="123 Main Street"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                <input
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  placeholder="Lahore"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  Education Level
                </label>
                <select
                  name="educationLevel"
                  value={formData.educationLevel}
                  onChange={handleChange}
                  className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all [&>option]:text-black"
                >
                  <option>High School</option>
                  <option>Undergraduate</option>
                  <option>Graduate</option>
                  <option>Post-Graduate</option>
                  <option>Other</option>
                </select>
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
                  Choose Your Interests
                </h2>
                <p className="text-gray-600">Select courses you'd like to explore</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2">
                {courses.map((course) => (
                  <button
                    key={course.id}
                    type="button"
                    onClick={() => toggleInterest(course.id)}
                    className={`text-left p-4 rounded-xl border-2 transition-all ${formData.interests.includes(course.id)
                        ? 'border-blue-500 bg-blue-50 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${formData.interests.includes(course.id)
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                        }`}>
                        {formData.interests.includes(course.id) && (
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-sm mb-1">{course.title}</h4>
                        <p className="text-xs text-gray-600">{course.category}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 text-center">
                Selected {formData.interests.length} course{formData.interests.length !== 1 ? 's' : ''}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-4 mt-8">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(prev => prev - 1)}
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
                Create Account <CheckCircle2 className="w-5 h-5" />
              </>
            ) : (
              <>
                Continue <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
