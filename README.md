# ✦ GoalForge

**GoalForge** is a premium, AI-driven learning roadmap architect designed to help users forge their path to mastery. By leveraging AI, GoalForge creates personalized, step-by-step learning plans tailored to your specific goals, skill level, and timeframe.

---

## 🚀 Live Demo
Experience the application live: **[goalforgeweb.vercel.app](https://goalforgeweb.vercel.app/)**

## 🛠️ Infrastructure
- **Frontend Repository:** This repository (`GoalForge-UI`)
- **Backend Repository:** [GoalForge-Backend](https://github.com/AKSH-NAIK/GoalForge-Backend)

---

## ✨ Features

- **AI-Powered Generation:** Instantly create logical, structured roadmaps for any topic.
- **Dynamic Configuration:** Specify your goal, duration (e.g., 4 weeks), skill level (Beginner/Intermediate/Advanced), and existing knowledge.
- **Personalized Auth:** Secure login and registration powered by **Supabase**.
- **Roadmap History:** Save your "forged" roadmaps and access them anytime from your dashboard.
- **Incremental Learning:** Use the "Continue Plan" feature to extend your roadmap as you progress.
- **Premium UI:** A sleek "Dark Emerald" aesthetic with glassmorphism components and smooth micro-animations.

---

## 🎨 Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React 19** | Core UI Framework |
| **Vite** | Lightning-fast Build Tool |
| **Supabase** | Authentication & Database |
| **React Router 7** | Frontend Navigation |
| **Vanilla CSS** | Custom Design System & Glassmorphism |

---

## 🛠️ Local Setup

Follow these steps to get GoalForge running on your local machine:

### 1. Clone the Repository
```bash
git clone https://github.com/AKSH-NAIK/GoalForge-UI.git
cd GoalForge-UI
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

### 4. Run Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

---

## 📁 Project Structure

```text
src/
├── components/     # UI Components (Form, Roadmap, Auth, etc.)
├── lib/            # Utility libraries (Supabase client)
├── App.jsx         # Main application logic & routing
├── main.jsx        # Entry point
└── index.css       # Global styles & design system
```

---

## 🛡️ License
Distributed under the MIT License. See `LICENSE` for more information.

## 🤝 Contributing
Contributions are welcome! Feel free to open issues or submit pull requests to improve the forge.

---

<p align="center">
  Built with 💚 by <a href="https://github.com/AKSH-NAIK">AKSH NAIK</a>
</p>
