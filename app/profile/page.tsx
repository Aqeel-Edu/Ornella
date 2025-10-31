"use client"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const router = useRouter()
  const [name, setName] = useState("Cozy Guest")
  const [email, setEmail] = useState("guest@example.com")

  useEffect(() => {
    const n = window.localStorage.getItem("name")
    const e = window.localStorage.getItem("email")
    if (n) setName(n)
    if (e) setEmail(e)
  }, [])

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-semibold">Your Account</h1>
        <div className="mt-6 rounded-lg border bg-card p-6 space-y-3">
          <div className="text-sm">
            <div className="text-muted-foreground">Name</div>
            <div className="font-medium">{name}</div>
          </div>
          <div className="text-sm">
            <div className="text-muted-foreground">Email</div>
            <div className="font-medium">{email}</div>
          </div>
          <button
            onClick={() => {
              window.localStorage.removeItem("auth")
              router.push("/")
            }}
            className="mt-4 inline-flex h-10 items-center rounded-md bg-primary px-4 text-primary-foreground"
          >
            Logout
          </button>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
