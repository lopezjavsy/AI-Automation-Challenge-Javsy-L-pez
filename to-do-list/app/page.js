"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import EditableField from "./components/EditableField"

export default function Home() {
  const [rawPhone, setRawPhone] = useState("")
  const [tasks, setTasks] = useState([])
  const [newTitle, setNewTitle] = useState("")
  const [newDesc, setNewDesc] = useState("")
  const [loadingAI, setLoadingAI] = useState(false)

  useEffect(() => {
    if (rawPhone.length === 10) {
      fetchTasks()
    } else {
      setTasks([])
    }
  }, [rawPhone])

  async function fetchTasks() {
    const formattedPhone = `+521${rawPhone}`
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user", formattedPhone)
      .order("created_at", { ascending: true })

    if (error) console.error("Supabase error:", error.message)
    else setTasks(data)
  }

  // 👇 Pedir enriquecimiento a IA SOLO al guardar
  async function enrichWithAI(title) {
    setLoadingAI(true)
    try {
      const res = await fetch("/api/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      })
      const data = await res.json()
      return data.description || ""
    } catch (err) {
      console.error("Error fetching AI enrichment:", err)
      return ""
    } finally {
      setLoadingAI(false)
    }
  }

  async function addTask() {
    if (!newTitle) {
      alert("Please enter a task title")
      return
    }
    if (rawPhone.length !== 10) {
      alert("Please enter your WhatsApp number first")
      return
    }

    // 👇 Si el usuario no escribió nota, IA la genera
    let enrichedDesc = newDesc
    if (!newDesc) {
      enrichedDesc = await enrichWithAI(newTitle)
    }

    const formattedPhone = `+521${rawPhone}`
    const { error } = await supabase.from("tasks").insert([
      {
        title: newTitle,
        description: enrichedDesc,
        completed: false,
        user: formattedPhone,
      },
    ])

    if (error) {
      console.error("Supabase insert error:", error.message)
    } else {
      setNewTitle("")
      setNewDesc("")
      fetchTasks()
    }
  }

  return (
    <main className="flex flex-col items-center min-h-screen bg-[#A0F0E8] text-gray-800 p-6">
      <div className="flex flex-col items-center w-full max-w-md space-y-6">
        {/* Title card */}
        <div className="bg-white rounded-xl shadow-md p-6 w-full text-center">
          <h1 className="text-xl font-bold text-gray-900">#1 Time to focus!</h1>
        </div>

        {/* WhatsApp number card */}
        <div className="bg-white rounded-xl shadow-md p-6 w-full">
          <p className="text-gray-700 font-medium mb-3">
            Enter your WhatsApp number to see your tasks:
          </p>
          <input
            type="text"
            maxLength={10}
            value={rawPhone}
            placeholder="e.g. 1234567890"
            onChange={(e) => setRawPhone(e.target.value)}
            className="border border-gray-300 px-4 py-3 rounded-lg w-full text-center focus:outline-none focus:ring-2 focus:ring-[#A0F0E8] transition"
          />
        </div>

        {/* Add Task card */}
        {rawPhone.length === 10 && (
          <div className="bg-white rounded-xl shadow-md p-6 w-full">
            <input
              type="text"
              placeholder="What are you working on?"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addTask()
                }
              }}
              className="w-full text-xl font-bold text-gray-900 border-none focus:ring-0 placeholder-gray-400"
            />

            {/* Descripción SIEMPRE visible */}
            <textarea
              placeholder={
                loadingAI
                  ? "⏳ AI enriching your task..."
                  : "Add note or leave empty for AI to enrich"
              }
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="w-full mt-2 border px-3 py-2 rounded-lg text-sm"
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setNewTitle("")
                  setNewDesc("")
                }}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={addTask}
                className="px-4 py-2 rounded-lg bg-[#A0F0E8] text-gray-900 font-semibold hover:opacity-80 transition"
              >
                Save
              </button>
            </div>
          </div>
        )}

        {/* Tasks list */}
        {tasks.length > 0 && (
          <div className="w-full space-y-3">
            {tasks.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-xl shadow-sm p-4 flex flex-col"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="checkbox"
                      checked={t.completed}
                      onChange={() =>
                        supabase
                          .from("tasks")
                          .update({ completed: !t.completed })
                          .eq("id", t.id)
                          .then(fetchTasks)
                      }
                    />

                    <EditableField
                      value={t.title}
                      onSave={(val) =>
                        supabase
                          .from("tasks")
                          .update({ title: val })
                          .eq("id", t.id)
                          .then(fetchTasks)
                      }
                      isTitle
                    />
                  </div>

                  <button
                    onClick={() =>
                      supabase
                        .from("tasks")
                        .delete()
                        .eq("id", t.id)
                        .then(fetchTasks)
                    }
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    🗑️
                  </button>
                </div>

                <EditableField
                  value={t.description}
                  onSave={(val) =>
                    supabase
                      .from("tasks")
                      .update({ description: val })
                      .eq("id", t.id)
                      .then(fetchTasks)
                  }
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
