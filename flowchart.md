# DeepLeaf - Software Flowchart

## 1. System Architecture Overview

```mermaid
flowchart TD
    subgraph FRONTEND["Frontend (Next.js + TypeScript)"]
        A1[Hero / Landing Page]
        A2[Upload Section]
        A3[Plant Profile Page]
        A4[Plant Detail Page]
        A5[Redux Store]
    end

    subgraph BACKEND["Backend (Express.js + TypeScript)"]
        B1["/api/analyze<br/>(analyzeController)"]
        B2["/api/plants<br/>(plantController)"]
        B3[upload middleware<br/>Multer]
        B4[mlService.ts]
        B5[cloudinaryService.ts]
        B6[plantService.ts]
    end

    subgraph ML["ML Model Server (Python + FastAPI)"]
        C1["/predict endpoint<br/>(api.py)"]
        C2[predict.py]
        C3[EfficientNet-B0<br/>best_model.pt]
    end

    subgraph DB["MongoDB Atlas"]
        D1[(Plant)]
        D2[(DailyLog)]
        D3[(SprayEvent)]
        D4[(CohortComparison)]
    end

    subgraph EXT["External Services"]
        E1[Cloudinary<br/>Image Storage]
    end

    FRONTEND -- "REST API<br/>axios" --> BACKEND
    BACKEND -- "POST /predict<br/>multipart/form-data" --> ML
    BACKEND --> DB
    B5 --> E1
```

---

## 2. Image Analysis Flow (Core Feature)

```mermaid
flowchart TD
    START([Farmer opens DeepLeaf]) --> HOME[Landing Page loads<br/>HeroSection + UploadSection]
    HOME --> UPLOAD[Farmer selects plant image<br/>and optionally enters plant_id + env_data]
    UPLOAD --> SUBMIT[uploadAndAnalyze via<br/>analysisService.ts]

    subgraph FRONTEND_FLOW["Frontend"]
        SUBMIT --> AXIOS[apiClient.post /api/analyze<br/>multipart/form-data]
    end

    AXIOS --> MIDDLEWARE["Multer upload middleware<br/>stores image buffer in memory"]

    subgraph BACKEND_FLOW["Backend - analyzeController.ts"]
        MIDDLEWARE --> VALIDATE{Image file<br/>provided?}
        VALIDATE -- No --> ERR400[400 Error:<br/>No image file provided]
        VALIDATE -- Yes --> ML_CALL["mlService.analyzePlantImage<br/>POST to ML Server /predict"]
    end

    subgraph ML_FLOW["ML Server - FastAPI"]
        ML_CALL --> ENSURE[ensure_model_loaded<br/>Load best_model.pt if not cached]
        ENSURE --> PIL_OPEN["PIL Image.open<br/>from bytes"]
        PIL_OPEN --> TRANSFORM["Resize 256 → CenterCrop 224<br/>ImageNet normalization"]
        TRANSFORM --> INFERENCE["EfficientNet-B0 forward pass<br/>softmax → class probabilities"]
        INFERENCE --> FORMAT["format_prediction<br/>predicted_class, disease_score,<br/>disease_present_score, class_scores"]
        FORMAT --> ML_RESPONSE[Return JSON response]
    end

    ML_RESPONSE --> MAP["mlService.mapToMLPrediction<br/>Map disease → PESTICIDE_MAP<br/>Get pesticide + dosage"]

    MAP --> CLOUD["cloudinaryService.uploadImage<br/>Upload image to Cloudinary"]
    CLOUD --> IMAGE_URL[Get secure_url]

    IMAGE_URL --> HAS_PLANT{plant_id<br/>provided?}
    HAS_PLANT -- Yes --> SAVE_LOG["DailyLog.create<br/>Save: plant_id, date, image_url,<br/>disease_percent, severity_score,<br/>env_data, diagnosis,<br/>recommended_pesticide, dosage"]
    HAS_PLANT -- No --> RESPOND
    SAVE_LOG --> RESPOND["Return JSON response:<br/>diagnosis, severity_score,<br/>disease_percent, recommended_pesticide,<br/>recommended_dosage_ml, confidence, image_url"]

    RESPOND --> DISPLAY["Frontend displays results<br/>via Redux store → useAnalysis hook"]
    DISPLAY --> DONE([End])
```

---

## 3. Plant Management Flow

```mermaid
flowchart TD
    subgraph REGISTER["Register Plant Flow"]
        R1([POST /api/plants/register]) --> R2[plantController.registerPlant]
        R2 --> R3[plantService.registerPlant]
        R3 --> R4["Calculate centroid from bbox_region"]
        R4 --> R5["Plant.save() to MongoDB"]
        R5 --> R6[Return saved Plant document]
    end

    subgraph VIEW_PLANTS["View All Plants"]
        V1([GET /api/plants]) --> V2[plantController.getAllPlants]
        V2 --> V3["Plant.find().sort(plant_id)"]
        V3 --> V4[Return all plants]
    end

    subgraph PLANT_DETAIL["Plant Detail Flow"]
        PD1([GET /api/plants/:id]) --> PD2[plantController.getPlantById]
        PD2 --> PD3["Plant.findOne(plant_id)"]
        PD3 --> PD4{Found?}
        PD4 -- No --> PD5[404 Not Found]
        PD4 -- Yes --> PD6[Return plant]
    end

    subgraph PLANT_LOGS["Daily Logs Flow"]
        PL1([GET /api/plants/:id/logs]) --> PL2[plantController.getPlantLogs]
        PL2 --> PL3["DailyLog.find(plant_id).sort(date:-1)"]
        PL3 --> PL4[Return logs array]
    end

    subgraph SPRAY_HISTORY["Spray History Flow"]
        S1([GET /api/plants/:id/sprays]) --> S2[plantController.getPlantSprays]
        S2 --> S3["SprayEvent.find(plant_id).sort(date:-1)"]
        S3 --> S4[Return spray events]
    end
```

---

## 4. ML Training Pipeline (Plant_disease)

```mermaid
flowchart TD
    subgraph DATA_PREP["Data Preparation"]
        DS[(Dataset<br/>Original + Augmented)] --> SPLIT["splits/<br/>train.csv / val.csv / test.csv<br/>70/15/15 split"]
        DS --> EDA["eda.py<br/>Exploratory Data Analysis"]
    end

    subgraph TRAINING["Model Training"]
        SPLIT --> EXP1["Experiment 001<br/>EfficientNet-B0<br/>Original data only"]
        SPLIT --> EXP2["Experiment 002<br/>EfficientNet-B0<br/>Augmented data"]
        SPLIT --> EXP3["Experiment 003<br/>EfficientNet-B0<br/>Combined data<br/>★ Best Model"]
    end

    EXP1 --> EVAL1[eval_exp003_test.py<br/>Metrics: accuracy, F1,<br/>confusion matrix]
    EXP2 --> EVAL1
    EXP3 --> EVAL1

    EVAL3["Experiment 003<br/>best_model.pt"] --> API

    subgraph INFERENCE["Inference"]
        API["FastAPI Server<br/>src/api.py<br/>POST /predict"]
        API --> LOAD["Load best_model.pt<br/>once into RAM"]
        LOAD --> PREDICT["predict.py<br/>predict_pil()"]
        PREDICT --> RESULT["predicted_class +<br/>class_scores +<br/>disease_present_score"]
    end

    subgraph CLASSES["Disease Classes"]
        C1[bacterial_spot_rot]
        C2[black_rot]
        C3[downy_mildew]
        C4[no_disease]
    end
```

---

## 5. Data Model Relationships

```mermaid
erDiagram
    PLANT {
        string plant_id UK
        string crop_type
        object position
        object bbox_region
        object centroid
        date date_registered
        date date_planted
        object current_status
        number total_pesticide_used_ml
    }

    DAILY_LOG {
        string plant_id FK
        date date
        string image_url
        number disease_percent
        number severity_score
        object env_data
        string diagnosis
        string cohort_verdict
        string recommended_pesticide
        number recommended_dosage_ml
    }

    SPRAY_EVENT {
        string plant_id FK
        date date
        ObjectId triggered_by_log_id FK
        string pesticide_used
        number amount_ml
        date spray_time
        string status
    }

    COHORT_COMPARISON {
        date date
        string plant_ids_compared
        string verdict
        string reasoning
    }

    PLANT ||--o{ DAILY_LOG : "has daily logs"
    PLANT ||--o{ SPRAY_EVENT : "has spray events"
    DAILY_LOG ||--o{ SPRAY_EVENT : "triggers spray"
```

---

## 6. Frontend Component Flow

```mermaid
flowchart TD
    subgraph PAGES["Pages (App Router)"]
        HOME["/ → page.tsx<br/>Landing Page"]
        PLANT_LIST["/plants → Plant List"]
        PLANT_DETAIL["/plants/[id] → Plant Detail"]
    end

    subgraph LANDING["Landing Page Components"]
        L1[HeroSection]
        L2[HowItWorks]
        L3[UploadSection]
        L4[PlantProfilePreview]
        L5[FeaturesSection]
        L6[StatsSection]
    end

    subgraph DETAIL["Plant Detail Components"]
        D1[HealthProfile]
        D2[DecisionLog]
        D3[HistoryTimeline]
        D4[TrendsChart]
        D5[CohortInfo]
    end

    subgraph SHARED["Shared Components"]
        S1[Providers.tsx<br/>Redux Provider]
    end

    subgraph HOOKS["Custom Hooks"]
        H1[useAnalysis]
        H2[usePlants]
        H3[usePlantDetail]
        H4[useUpload]
    end

    subgraph STATE["State Management"]
        ST1[Redux Store]
        ST2["slices/<br/>analysis slice"]
    end

    HOME --> L1 & L2 & L3 & L4 & L5 & L6
    PLANT_DETAIL --> D1 & D2 & D3 & D4 & D5
    HOOKS --> ST1
    ST1 --> ST2
    PAGES --> HOOKS
    HOOKS --> SERVICES["Services:<br/>apiClient / analysisService /<br/>plantService / mlService"]
```

---

## 7. End-to-End Request Lifecycle

```mermaid
sequenceDiagram
    actor Farmer
    participant FE as Frontend (Next.js)
    participant API as Backend (Express)
    participant ML as ML Server (FastAPI)
    participant DB as MongoDB
    participant CDN as Cloudinary

    Farmer->>FE: Upload plant image
    FE->>API: POST /api/analyze (multipart)
    API->>ML: POST /predict (image buffer)
    ML->>ML: Load EfficientNet-B0 model
    ML->>ML: Transform image (224x224)
    ML->>ML: Run inference → class probabilities
    ML-->>API: {predicted_class, confidence, scores}
    API->>API: Map disease → pesticide + dosage
    API->>CDN: Upload image
    CDN-->>API: secure_url
    API->>DB: Save DailyLog (if plant_id)
    API-->>FE: {diagnosis, severity, pesticide, dosage, image_url}
    FE-->>Farmer: Display results dashboard
```