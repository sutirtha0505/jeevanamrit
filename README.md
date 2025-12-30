# 🌿 जीवनामृत (Jeevanamrit) - Ayurvedic Herb Identification Platform

<div align="center">

![Jeevanamrit Logo](https://img.shields.io/badge/जीवनामृत-Elixir%20of%20Life-22c55e?style=for-the-badge)

**Bridging Ancient Ayurvedic Wisdom with Modern AI Technology**

[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-61dafb?style=flat&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-3ecf8e?style=flat&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Google AI](https://img.shields.io/badge/Google%20AI-Gemini-4285f4?style=flat&logo=google)](https://ai.google.dev/)

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Tech Stack](#-tech-stack) • [Contributing](#-contributing)

</div>

---

## 📖 About

**Jeevanamrit** (Sanskrit: जीवनामृत - "Elixir of Life") is an innovative AI-powered platform designed to identify and explore medicinal herbs native to India. By seamlessly integrating advanced artificial intelligence with ancient Ayurvedic knowledge, we make traditional herbal wisdom accessible to everyone in the modern age.

Whether you're a herbalist, wellness enthusiast, or simply curious about natural remedies, Jeevanamrit empowers you to discover the healing properties of local flora and foster a deeper connection with nature.

---

## ✨ Features

### 🔍 **AI-Powered Herb Identification**
- **Image Recognition**: Upload or capture photos of herbs for instant AI analysis
- **High Confidence Detection**: Powered by Google's Gemini AI for accurate identification
- **Real-time Analysis**: Get immediate results with detailed herb information

### 📚 **Comprehensive Ayurvedic Knowledge Base**
- **Detailed Herb Profiles**: Common & Latin names, confidence levels, categories
- **Medicinal Properties**: Complete information on therapeutic uses and benefits
- **Ayurvedic Applications**: Traditional preparation methods and dosage guidelines
- **Chemical Constituents**: Scientific breakdown of active compounds
- **Cultivation Methods**: Growing requirements and climate needs
- **Historical Context**: Cultural significance and traditional usage
- **Preservation Techniques**: Storage and processing methods

### 📍 **Contextual Information**
- **Geolocation Tracking**: Automatic location capture for each herb
- **Weather Integration**: Real-time weather conditions using Open-Meteo API
- **Environmental Context**: Understand herbs in their natural habitat

### 💾 **User Profile & Management**
- **Personal Herb Library**: Save and organize your herb analyses
- **Beautiful Card Display**: Visual grid of all your saved herbs
- **Detailed View Modal**: Interactive popups with complete herb information
- **Authentication**: Secure user accounts via Supabase Auth
- **History Tracking**: Timestamps for all analyses

### 📄 **Export & Sharing**
- **PDF Report Generation**: Download professionally formatted herb reports
- **Markdown Support**: Formatted text with bullet points and sections
- **Original Image Storage**: Cloud storage of captured herb images
- **Print-Friendly**: Optimized PDF layouts for easy reference

### 🎨 **Modern UI/UX**
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile
- **Smooth Animations**: GSAP-powered scroll animations and transitions
- **Water Ripple Effects**: Beautiful interactive visual elements
- **Dark/Light Themes**: Customizable appearance
- **Intuitive Navigation**: User-friendly interface with easy-to-use features

### 📷 **Flexible Image Capture**
- **Camera Integration**: Direct camera access for instant herb photography
- **File Upload**: Support for existing images from gallery
- **Image Preview**: Review captured images before analysis
- **High-Quality Storage**: Original resolution preservation in Supabase Storage

---

## 🎬 Demo

### Key User Flows

1. **Herb Identification Workflow**
   ```
   Home → Capture → Upload/Camera → AI Analysis → View Results → Save to Profile
   ```

2. **Profile Management**
   ```
   Login → Profile → View Herb Library → Click Card → Detailed View Modal
   ```

3. **Report Generation**
   ```
   Analyze Herb → View Results → Download PDF / Save to Cloud
   ```

---

## 🚀 Installation

### Prerequisites

- **Node.js** 20.x or higher
- **npm** or **yarn** or **pnpm** or **bun**
- **Supabase Account** (for authentication and database)
- **Google AI API Key** (for Gemini AI integration)

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=your_supabase_anon_key

# Google AI (Gemini)
GOOGLE_GENAI_API_KEY=your_google_ai_api_key

# Optional: Next Auth (if using)
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/jeevanamrit.git
   cd jeevanamrit
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up Supabase Database**
   
   Run the SQL scripts in order:
   ```bash
   # In your Supabase SQL Editor
   # 1. Run schema.sql (creates tables and RLS policies)
   # 2. Run data-new.sql (optional: loads sample data)
   ```

4. **Configure Supabase Storage**
   - Create a storage bucket named `herb-images`
   - Set it to public access
   - Storage policies are automatically created via schema.sql

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🛠️ Tech Stack

### Frontend
- **[Next.js 16.1.1](https://nextjs.org/)** - React framework with App Router
- **[React 19.2.3](https://reactjs.org/)** - UI library
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Re-usable component library
- **[Lucide React](https://lucide.dev/)** - Icon library
- **[GSAP](https://greensock.com/gsap/)** - Animation library
- **[Framer Motion](https://www.framer.com/motion/)** - Animation and gestures

### Backend & Database
- **[Supabase](https://supabase.com/)** - Backend as a Service
  - Authentication (Email/Password, OAuth)
  - PostgreSQL Database
  - Row Level Security (RLS)
  - Storage for images
- **[Supabase SSR](https://supabase.com/docs/guides/auth/server-side-rendering)** - Server-side rendering support

### AI & Machine Learning
- **[Google Gemini AI](https://ai.google.dev/)** - Herb identification and analysis
- **[Genkit](https://firebase.google.com/docs/genkit)** - AI workflow framework
- **[@genkit-ai/googleai](https://www.npmjs.com/package/@genkit-ai/googleai)** - Google AI integration

### Additional Libraries
- **[jsPDF](https://github.com/parallax/jsPDF)** - PDF generation
- **[React Toastify](https://fkhadra.github.io/react-toastify/)** - Toast notifications
- **[React Markdown](https://remarkjs.github.io/react-markdown/)** - Markdown rendering
- **[Leaflet](https://leafletjs.com/)** - Interactive maps
- **[React Leaflet](https://react-leaflet.js.org/)** - React wrapper for Leaflet
- **[html2canvas](https://html2canvas.hertzen.com/)** - Screenshot generation

---

## 📁 Project Structure

```
jeevanamrit/
├── app/                        # Next.js App Router
│   ├── actions.ts             # Server actions
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page
│   ├── globals.css            # Global styles
│   ├── about/                 # About page
│   ├── auth/                  # Authentication pages
│   │   ├── login/
│   │   ├── sign-up/
│   │   ├── forgot-password/
│   │   └── update-password/
│   ├── capture/               # Herb capture page
│   ├── maps/                  # Maps page
│   ├── plantHeal/             # Plant healing info
│   ├── profile/[id]/          # User profile page
│   └── ai/                    # AI flows and configurations
│       ├── genkit.ts
│       └── flows/
├── components/                 # React components
│   ├── ui/                    # UI components (shadcn)
│   ├── capture.tsx            # Main capture component
│   ├── form-content.tsx       # Form with camera/upload
│   ├── results.tsx            # Analysis results display
│   ├── navbar-wrapper.tsx     # Navigation bar
│   ├── home.tsx               # Home page content
│   ├── featured-herbs.tsx     # Featured herbs section
│   ├── howitworks.tsx         # How it works section
│   └── faq.tsx                # FAQ section
├── lib/                       # Utility functions
│   ├── supabase/              # Supabase clients
│   │   ├── client.ts          # Client-side
│   │   ├── server.ts          # Server-side
│   │   └── middleware.ts      # Middleware
│   └── utils.ts               # Utility functions
├── types/                     # TypeScript type definitions
│   └── herb.ts                # Herb-related types
├── supabase/                  # Database schemas
│   ├── schema.sql             # Table definitions & RLS
│   └── data-new.sql           # Sample data
├── public/                    # Static assets
├── constants/                 # App constants
│   └── layout.ts              # Navigation links
└── hooks/                     # Custom React hooks
    ├── use-current-user-name.ts
    ├── use-current-user-image.ts
    └── use-toast.ts
```

---

## 🔐 Database Schema

### Tables

#### `profiles`
- User profile information extending auth.users
- Fields: id, email, full_name, avatar_url, timestamps

#### `herb_analyses`
- Stores complete herb identification results
- Fields: 
  - Identification: common_name, latin_name, confidence_level
  - Details: uses, chemical_constituents, cultivation, preservation
  - Context: location, weather, image_url
  - Ayurvedic: ayurvedic_applications, medicinal_properties
  - Meta: user_id, timestamps

#### `chat_messages`
- Chatbot conversation history
- Fields: user_id, message, response, created_at

### Row Level Security (RLS)
- Users can only access their own data
- Policies enforce data privacy at the database level

---

## 🎯 Features in Detail

### Herb Analysis Process

1. **Image Capture**: User captures or uploads herb image
2. **Context Gathering**: Location and weather data collected
3. **AI Analysis**: Image sent to Gemini AI for identification
4. **Information Extraction**: Comprehensive data gathered through AI flows:
   - Basic identification
   - Detailed properties
   - Categorization
   - Ayurvedic applications
5. **Results Display**: Information presented in organized sections
6. **Storage Options**: 
   - Save to cloud (Supabase)
   - Download as PDF
   - View in profile library

### AI Flows (Genkit)

- **identify-herb-details**: Core identification flow
- **categorize-herb-flow**: Categorization and classification
- **ayurvedic-applications**: Traditional medicine information
- **plant-chatbot-flow**: Interactive Q&A about herbs

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Ways to Contribute

1. **Report Bugs**: Open an issue describing the bug
2. **Suggest Features**: Share your ideas for new features
3. **Submit Pull Requests**: Fix bugs or add features
4. **Improve Documentation**: Help make our docs better
5. **Share Feedback**: Tell us about your experience

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- Follow the existing code style
- Use TypeScript for type safety
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Ayurvedic Texts**: Ancient wisdom from Charaka Samhita, Sushruta Samhita, and other classical texts
- **Google AI Team**: For the powerful Gemini AI model
- **Supabase Team**: For the excellent backend platform
- **Next.js Team**: For the amazing React framework
- **shadcn**: For the beautiful component library
- **Open-Meteo**: For the free weather API
- **Community Contributors**: Thank you to everyone who has contributed!

---

## 📞 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/jeevanamrit/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/jeevanamrit/discussions)
- **Email**: support@jeevanamrit.com

---

## 🌟 Star History

If you find this project useful, please consider giving it a ⭐️ on GitHub!

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Google AI Documentation](https://ai.google.dev/docs)
- [Ayurveda Introduction](https://www.ayurveda.com/)
- [Medicinal Plants of India](https://envis.frlht.org/)

---

<div align="center">

**Made with 💚 for preserving ancient Ayurvedic wisdom**

*Jeevanamrit - Your gateway to nature's healing treasures*

</div>
