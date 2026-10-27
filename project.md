# DeepLeaf - Smart Plant Disease Detection System

## Overview
DeepLeaf is a web-based platform that helps farmers detect plant diseases using AI-powered image analysis. Farmers upload photos of their plants, and the system identifies diseases, provides treatment recommendations, and offers preventive measures.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                    │
│              React/Next.js + TypeScript                  │
│         Image Upload UI, Results Dashboard               │
└───────────────────────────┬─────────────────────────────┘
                            │ REST APIs
                            ▼
┌─────────────────────────────────────────────────────────┐
│                BACKEND (Node.js + Express)               │
│              REST APIs, Image Processing                 │
│         Database Operations, External API Calls          │
└───────┬─────────────────────────────┬───────────────────┘
        │                             │
        ▼                             ▼
┌───────────────────┐     ┌───────────────────────────────┐
│   MongoDB (Atlas) │     │      AI/ML APIs (External)    │
│                   │     │                               │
│  - Plant Data     │     │  - YOLO v11 (Detection)       │
│  - Disease Info   │     │  - YOLO v11 (Classification)  │
│  - User Data      │     │  - TensorFlow/PyTorch (Later) │
└───────────────────┘     └───────────────────────────────┘
```

## Tech Stack

| Layer        | Technology                    |
|--------------|-------------------------------|
| Frontend     | Next.js, React, TypeScript    |
| Styling      | Tailwind CSS                  |
| Backend      | Node.js, Express.js, TypeScript|
| Database     | MongoDB (Mongoose ODM)        |
| AI/ML        | YOLO v11 API, TensorFlow API  |
| External APIs| Weather API, Pest/Disease DB, Market Price API |

## Project Structure

```
capstone/
├── frontend/          # Next.js frontend application
│   ├── src/
│   │   ├── app/       # App router pages
│   │   ├── components/# React components
│   │   └── lib/       # Utilities, API clients
│   └── package.json
│
├── backend/           # Express.js backend server (coming soon)
│   ├── src/
│   │   ├── routes/    # API routes
│   │   ├── controllers/
│   │   ├── models/    # Mongoose models
│   │   ├── middleware/
│   │   └── services/  # External API integrations
│   └── package.json
│
└── project.md         # This file
```

## Key Features

### Phase 1 - Core (Current)
- Plant image upload from frontend
- Backend sends images to YOLO v11 API for disease detection
- Display detection results with disease info
- Treatment and preventive recommendations

### Phase 2 - User System (Later)
- Farmer registration and login
- Per-user plant tracking and history
- Dashboard with disease history per plant
- Multi-farmer onboarding

### Phase 3 - External APIs (Later)
- Weather API integration for environmental context
- Pest/Disease Database for detailed info
- Market Price API for crop pricing

## API Flow

```
User uploads image
    → Frontend sends to Backend
    → Backend processes image
    → Backend calls YOLO v11 API
    → YOLO returns disease detection/classification
    → Backend queries MongoDB for disease info
    → Backend calls external APIs (weather, market, etc.)
    → Backend returns aggregated response
    → Frontend displays results to farmer
```
