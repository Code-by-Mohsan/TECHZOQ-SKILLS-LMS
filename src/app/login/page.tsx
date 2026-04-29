import LoginForm from '@/components/LoginForm';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Sparkles, Award, Users, BookOpen } from 'lucide-react';

export const metadata = {
  title: 'Login | TechZoq',
  description: 'Login to your TechZoq account and continue learning.',
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ redirect?: string }> }) {
  const { redirect } = await searchParams;
  const signupHref = redirect ? `/signup?redirect=${encodeURIComponent(redirect)}` : '/signup';

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
                  <span>Continue Your Journey</span>
                </div>

                <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                  Welcome Back to{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                    Learning
                  </span>
                </h1>

                <p className="text-xl text-gray-700 leading-relaxed">
                  Pick up where you left off and continue mastering new skills with our expert-led courses.
                </p>

                {/* Features */}
                <div className="space-y-4 pt-6">
                  <div className="flex items-start gap-4 bg-white rounded-2xl p-4 shadow-lg">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Access All Courses</h3>
                      <p className="text-sm text-gray-600">Continue learning from where you stopped</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 bg-white rounded-2xl p-4 shadow-lg">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Track Progress</h3>
                      <p className="text-sm text-gray-600">Monitor your learning achievements</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 bg-white rounded-2xl p-4 shadow-lg">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Join Community</h3>
                      <p className="text-sm text-gray-600">Connect with fellow learners</p>
                    </div>
                  </div>
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

              <LoginForm />

              <p className="text-center text-gray-600 mt-8 text-sm">
                Don't have an account?{' '}
                <Link href={signupHref} className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                  Sign up now
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
