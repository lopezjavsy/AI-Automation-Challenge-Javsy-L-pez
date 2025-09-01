
# AI Automation Challenge – To-Do List App

This project was built as part of the **AI Automation Challenge**.  
It demonstrates how to combine **Next.js**, **Supabase**, **OpenAI**, and **N8N** with WhatsApp (UltraMsg) to create an AI-powered To-Do List.

---

## 🚀 Features

- **Minimalist To-Do List App** built with **Next.js** and deployed on **Vercel**.  
- **Supabase** database for persistence: tasks are stored by user identifier (WhatsApp number).  
- **WhatsApp login identifier**: users enter their 10-digit WhatsApp number (internally formatted to `+521XXXXXXXXXX` for MX).  
- **Task management**:
  - Add tasks  
  - Edit task title or description  
  - Mark as complete / uncomplete  
  - Delete tasks  
- **AI Enrichment (OpenAI)**:  
  When a user adds a task, the description is automatically enriched in **English** with step-by-step guidance generated via the OpenAI API.  
- **N8N workflow** integrated with **UltraMsg** to listen to WhatsApp messages with `#todolist`.  
  - Messages are received successfully.  
  - The step to insert into Supabase is designed but requires adjustment to finalize.  

---

## 📦 Tech Stack

- [Next.js](https://nextjs.org/) – Frontend & API routes  
- [Supabase](https://supabase.com/) – Database (Postgres) + Auth (phone identifier)  
- [OpenAI API](https://platform.openai.com/) – Task description enrichment  
- [Vercel](https://vercel.com/) – Hosting  
- [N8N](https://n8n.io/) – Automation workflows  
- [UltraMsg](https://ultramsg.com/) – WhatsApp integration  

---

## 🗄️ Database Schema (Supabase)

```sql
create table public.tasks (
  id uuid not null default extensions.uuid_generate_v4 (),
  title text not null,
  description text null,
  completed boolean null default false,
  "user" text not null,
  created_at timestamp with time zone null default now(),
  constraint tasks_pkey primary key (id)
);
