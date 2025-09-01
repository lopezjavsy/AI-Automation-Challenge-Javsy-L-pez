import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { phone, title } = req.body;
  if (!phone || !title) {
    return res.status(400).json({ error: "Phone and title are required" });
  }

  try {
    const formattedPhone = phone.startsWith("+") ? phone : `+${phone}`;
    const { error } = await supabase.from("tasks").insert([
      {
        title,
        user: formattedPhone,
        completed: false,
      },
    ]);

    if (error) throw error;

    res.status(200).json({ success: true, message: "Task created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
