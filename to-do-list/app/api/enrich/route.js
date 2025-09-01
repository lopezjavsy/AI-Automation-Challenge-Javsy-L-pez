import OpenAI from "openai"

export async function POST(req) {
  try {
    const { title } = await req.json()

    if (!title) {
      return new Response(JSON.stringify({ error: "Missing title" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are an assistant that expands task titles into **clear, concise, step-by-step descriptions in English**. 
Always return a short **summary** (1–2 sentences) followed by **3–5 clear steps**. 
Format the response in Markdown like this:

**Summary:** <short explanation>  
**Steps:**  
1. Step one  
2. Step two  
3. Step three  
`,
        },
        {
          role: "user",
          content: `Task: "${title}"`,
        },
      ],
      temperature: 0.7,
    })

    const description =
      completion.choices[0]?.message?.content?.trim() ||
      `**Summary:** This is a generic task.  
**Steps:**  
1. Start  
2. Work on it  
3. Finish`

    return new Response(JSON.stringify({ description }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (err) {
    console.error("AI error:", err)
    return new Response(
      JSON.stringify({ error: "AI enrichment failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
