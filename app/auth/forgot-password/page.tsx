"use client"

import Link from "next/link"
import { Leaf, ArrowLeft } from "lucide-react"
import { useState, FormEvent } from "react"
import { useAuth } from "@/contexts/AuthContext"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const { resetPassword } = useAuth()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)
    setLoading(true)

    try {
      await resetPassword(email)
      setSuccess(true)
      setEmail("")
    } catch (err: any) {
      setError(err.message || "Failed to send reset email. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/collections/kitchen.jpg)' }}
        ></div>
        {/* Light overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/30"></div>
        <div className="relative z-10 flex flex-col justify-center items-center w-full px-12 text-white drop-shadow-lg">
          <div className="max-w-md">
            <Link href="/" className="inline-flex items-center gap-3 mb-8">
              <Leaf className="h-10 w-10 text-white" />
              <span className="text-3xl font-bold tracking-tight text-white">Ornella</span>
            </Link>
            <h2 className="text-4xl font-bold mb-4 text-balance text-white">
              Forgot Your Password?
            </h2>
            <p className="text-lg text-white/90 text-pretty">
              No worries! Enter your email and we'll send you instructions to reset your password.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Reset Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden inline-flex items-center gap-2 mb-8">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Ornella</span>
          </Link>

          <div className="bg-card rounded-2xl shadow-sm border p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
              <p className="text-sm text-muted-foreground">
                We'll send you an email with a link to reset your password
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-5 p-3 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm">
                Password reset email sent! Check your inbox for further instructions.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 px-4 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            <div className="mt-6">
              <Link 
                href="/auth/login" 
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Sign In
              </Link>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <h3 className="text-sm font-medium mb-2">Having trouble?</h3>
            <p className="text-xs text-muted-foreground mb-3">
              If you don't receive an email within a few minutes, please check your spam folder or contact our support team.
            </p>
            <Link href="#" className="text-xs text-primary hover:underline font-medium">
              Contact Support →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
