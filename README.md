# 🎥 VisionCast – Backend

VisionCast is an accessibility-focused backend service that converts videos into **frame-by-frame textual descriptions**, helping **visually impaired users** understand the essence of visual scenes through text.

This repository contains the **backend** logic responsible for video processing, authentication, and data management.

---

## 🚀 Features

- 📤 Video upload handling using **Multer**
- 🎞️ Frame-by-frame / per-second extraction using **FFmpeg**
- 📝 Conversion of visual frames into descriptive text
- 🔐 Secure authentication using **JWT**
- 🔑 Password hashing with **Bcrypt**
- 🗄️ Database integration using **MongoDB & Mongoose**
- ☁️ **Supabase** integration for storage or metadata
- 🌍 CORS-enabled REST APIs
- ⚙️ Environment-based configuration using **dotenv**

---

## 🧠 How It Works

1. A user uploads a video file
2. The backend processes the video using FFmpeg
3. Frames are extracted at fixed intervals
4. Each frame is analyzed and converted into text
5. The generated text describes:
   - Actions
   - Characters
   - Scene transitions
   - Visual context

This textual output allows blind users to grasp the story and environment of the video.

---

## 🛠️ Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**
- **FFmpeg**
- **Supabase**
- **JWT Authentication**

---
## 🛠️ Setup .env file

PORT=
MONGODB_URI=
JWT_SECRET=
SUPABASE_URL=
SUPABASE_KEY=

**Getting Started**
Install Dependencies
npm install

**Start the Server**
npm start

