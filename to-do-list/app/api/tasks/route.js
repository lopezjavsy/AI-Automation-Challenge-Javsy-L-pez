import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"

export async function POST(req) {
  try {
    const body = await req.json()
    const { user, title } = body

    if (!user || !title) {
      return NextResponse.json(
        { error: "Missing user or title" },
        { status: 400 }
      )
    }

    const { error } = await supabase.from("tasks").insert([
      {
        user,
        title,
        completed: false,
      },
    ])

    if (error) {
      console.error("Supabase insert error:", error.message)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("API error:", err.message)
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}
