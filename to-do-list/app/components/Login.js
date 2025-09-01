"use client"
import { useState } from "react"

export default function Login({ onLogin }) {
  const [phone, setPhone] = useState("")

  function handleLogin() {
    if (phone.length === 10) {
      const formatted = `+521${phone}`
      onLogin(formatted)
    } else {
      alert("Enter a valid 10-digit phone number")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-bold">Login</h1>

      {/* Instrucción clara arriba del input */}
      <p className="text-gray-600">Please enter your 10-digit WhatsApp number:</p>

      <input
        type="text"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="e.g. 9992105470"
        className="border px-3 py-2 rounded w-64"
      />

      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        Continue
      </button>
    </div>
  )
}
