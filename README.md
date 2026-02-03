# EcoTrack - Carbon Footprint Calculator & Tracker

A full-stack web application that helps individuals track and reduce their carbon footprint through AI-powered personalized recommendations.

![EcoTrack](https://img.shields.io/badge/EcoTrack-Carbon%20Tracker-10b981)
![React](https://img.shields.io/badge/React-18-61dafb)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933)
![Gemini](https://img.shields.io/badge/Google-Gemini%20AI-4285f4)

## Features

### 🌍 Core Features

- **User Authentication** - Secure JWT-based registration and login
- **Activity Logging** - Track transportation, energy, and diet activities
- **Quick Add Buttons** - One-click logging for common activities
- **Carbon Calculator** - Automatic CO2 emission calculations

### 📊 Visual Dashboard

- **Stats Overview** - Daily, weekly, monthly emission totals
- **Trend Charts** - Line charts showing emission patterns
- **Category Breakdown** - Doughnut chart showing emissions by category
- **Goal Tracking** - Set and monitor monthly emission goals

### 🤖 AI-Powered Recommendations

- **Personalized Tips** - AI-generated recommendations based on your data
- **EcoBot Chatbot** - Interactive chat for carbon footprint advice
- **Smart Analysis** - Uses Google Gemini API for intelligent suggestions

## Tech Stack

| Layer        | Technology                   |
| ------------ | ---------------------------- |
| **Frontend** | React 18 + TypeScript + Vite |
| **Backend**  | Node.js + Express            |
| **Database** | JSON file storage            |
| **Charts**   | Chart.js + react-chartjs-2   |
| **AI**       | Google Gemini API            |

## Project Structure

```
ecotrack/
├── src/                    # React Frontend
│   ├── components/         # Reusable UI components
│   ├── pages/              # Page components
│   ├── contexts/           # React contexts (Auth)
│   ├── services/           # API & AI services
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript types
│   └── App.tsx             # Main app component
├── server/                 # Node.js Backend
│   ├── index.js            # Express server
│   ├── data/               # JSON data files
│   └── package.json        # Backend dependencies
└── package.json            # Frontend dependencies
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Google Gemini API key (optional, for AI features)

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/your-username/ecotrack.git
cd ecotrack
```

2. **Install frontend dependencies:**

```bash
npm install
```

3. **Install backend dependencies:**

```bash
cd server
npm install
cd ..
```

4. **Create `.env` file** in root directory:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### Running the Application

**Start the backend server (Terminal 1):**

```bash
cd server
npm run dev
```

Server runs at: http://localhost:5000

**Start the frontend (Terminal 2):**

```bash
npm run dev
```

Frontend runs at: http://localhost:5173

## Carbon Emission Formulas

| Activity        | Formula (kg CO2) |
| --------------- | ---------------- |
| Car (Petrol)    | Distance × 0.12  |
| Car (Diesel)    | Distance × 0.14  |
| Bus             | Distance × 0.05  |
| Train           | Distance × 0.03  |
| Flight (Short)  | Distance × 0.255 |
| Flight (Long)   | Distance × 0.195 |
| Electricity     | kWh × 0.5        |
| Natural Gas     | kWh × 0.2        |
| Beef Meal       | 6.0 per meal     |
| Chicken Meal    | 2.5 per meal     |
| Vegetarian Meal | 1.5 per meal     |
| Vegan Meal      | 0.9 per meal     |

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Activities

- `GET /api/activities` - Get all activities
- `POST /api/activities` - Create activity
- `PUT /api/activities/:id` - Update activity
- `DELETE /api/activities/:id` - Delete activity

### Stats

- `GET /api/stats` - Get emission statistics
- `GET /api/stats/trend` - Get trend data

## Scripts

**Frontend:**

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

**Backend:**

- `npm run dev` - Start Express server
- `npm start` - Start server (production)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

---

Built with 💚 for a greener planet
