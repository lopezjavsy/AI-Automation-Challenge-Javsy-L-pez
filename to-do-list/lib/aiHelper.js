// lib/aiHelper.js
import OpenAI from "openai"

export async function enrichTaskDescription(title) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // 👈 esto solo se leerá en server
  })

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",  // o "gpt-3.5-turbo" si prefieres
      messages: [
        { role: "system", content: "You are an assistant that expands tasks into clear English steps." },
        { role: "user", content: `Enrich this task with details and steps: ${title}` },
      ],
    })

    return completion.choices[0].message.content
  } catch (error) {
    console.error("AI error:", error)
    return "No extra details available."
  }
}
