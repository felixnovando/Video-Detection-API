# 📹 Video Detection API

An Express.js API for managing frames, detections, and alerts in a video-based detection system. Built with TypeScript.

## 🔧 Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/felixnovando/Video-Detection-API.git
   cd video-detection-api
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**

   - Copy the example file:

     ```bash
     cp .env.example .env
     ```

   - Open `.env` and set the `PORT` value:

     ```env
     PORT=3000
     ```

## 🚀 Usage

### Start the development server:

```bash
npm run dev
```

### Build the project:

```bash
npm run build
```

### Start the production server:

```bash
npm run start
```

## 🧪 Testing

Run all unit and integration tests:

```bash
npm run test
```

Generate a coverage report:

```bash
npm run test:coverage
```

## 📁 Project Structure

```
src/
│
├── routes/             # Express routers
├── services/           # Business logic layer
├── repository/         # Data access layer
├── utils/              # Helper utilities
├── dto/                # Data Transfer Objects
├── models/             # TypeScript interfaces/models
├── types/              # Enum and type definitions
└── index.ts            # Entry point
```

## ✅ Features

- Frame ingestion and detection parsing
- Alert generation based on rules
- In-memory local repository implementation
- Structured and testable TypeScript architecture
- Integrated unit and integration tests using Jest + Supertest

## 🛠 Tech Stack

- **Node.js** + **Express**
- **TypeScript**
- **Jest** for unit testing
- **Supertest** for integration testing

---

Feel free to contribute or open issues if you find bugs or want to suggest improvements!
