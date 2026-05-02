import SignupForm from '@/components/SignupForm';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Sparkles, Award, Users, TrendingUp } from 'lucide-react';

export const metadata = {
  title: 'Join TechZoq | Start Your Tech Journey',
  description: 'Sign up for TechZoq courses and start your career in AI, Software Engineering, and more.',
};

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ redirect?: string }> }) {
  const { redirect } = await searchParams;
  const loginHref = redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : '/login';

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-4 pt-24">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-tr from-pink-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
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
                  <span>Join Our Learning Community</span>
                </div>

                <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                  Transform Your{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                    Career
                  </span>
                </h1>

                <p className="text-xl text-gray-700 leading-relaxed">
                  Join thousands of students mastering AI, Development, and Design. Build your future with industry-leading courses.
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-6">
                  <div className="bg-white rounded-2xl p-4 shadow-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">2,000+</div>
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
                      <div className="text-sm text-gray-600">Full Stack Developer</div>
                    </div>
                  </div>
                  <p className="text-gray-700 italic">
                    "TechZoq transformed my career. The courses are practical and the instructors are amazing!"
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

              <SignupForm />

              <p className="text-center text-gray-600 mt-8 text-sm">
                Already have an account?{' '}
                <Link href={loginHref} className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
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
