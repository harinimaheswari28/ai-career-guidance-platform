import os
import sys
import json

# Ensure project root is in path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.app import create_app, db
from backend.app.models.user import User, UserProfile
from backend.app.models.career import Skill, Career, CareerSkill
from backend.app.models.assessment import AssessmentQuestion, AssessmentOption
from backend.app.models.course import Course, CareerCourse
from backend.app.models.roadmap import LearningRoadmap, RoadmapStep

def seed_database():
    app = create_app()
    with app.app_context():
        print("Creating all database tables...")
        db.create_all()

        # 1. Seed Admin User
        admin_email = app.config.get('ADMIN_INIT_EMAIL', 'admin@aicareer.edu')
        admin_user = User.query.filter_by(email=admin_email).first()
        if not admin_user:
            print(f"Creating default admin account ({admin_email})...")
            admin_user = User(
                name=app.config.get('ADMIN_INIT_NAME', 'System Administrator'),
                email=admin_email,
                role='admin'
            )
            admin_user.set_password(app.config.get('ADMIN_INIT_PASSWORD', 'AdminPass@2026'))
            db.session.add(admin_user)
            db.session.flush()

            admin_profile = UserProfile(
                user_id=admin_user.id,
                education_level="Master's in Computer Science",
                interests="Educational Technology, AI Systems, Cloud Engineering",
                bio="Platform system administrator & academic supervisor.",
                career_goals="Empower engineering students to find fulfilling careers."
            )
            db.session.add(admin_profile)

        # 2. Seed Demo Student
        demo_student_email = 'student@example.com'
        demo_student = User.query.filter_by(email=demo_student_email).first()
        if not demo_student:
            print(f"Creating demo student account ({demo_student_email})...")
            demo_student = User(
                name='Alex Chen',
                email=demo_student_email,
                role='student'
            )
            demo_student.set_password('StudentPass@2026')
            db.session.add(demo_student)
            db.session.flush()

            student_profile = UserProfile(
                user_id=demo_student.id,
                education_level="B.Tech Computer Science (3rd Year)",
                interests="Full Stack Web Development, Machine Learning, UI/UX Design",
                bio="Aspiring software engineer interested in building modern web apps and intelligent tools.",
                career_goals="Become a high-impact Full Stack Engineer at a product startup."
            )
            db.session.add(student_profile)

        # 3. Seed Skills
        skills_data = [
            ("Python", "technical"), ("JavaScript", "technical"), ("TypeScript", "technical"),
            ("HTML/CSS", "technical"), ("React.js", "technical"), ("Node.js", "technical"),
            ("Flask", "technical"), ("Django", "technical"), ("SQL / MySQL", "technical"),
            ("PostgreSQL", "technical"), ("MongoDB", "technical"), ("Git / GitHub", "tool"),
            ("Docker", "tool"), ("Kubernetes", "tool"), ("AWS", "technical"),
            ("Azure", "technical"), ("Linux", "technical"), ("REST APIs", "technical"),
            ("Data Structures & Algorithms", "technical"), ("Machine Learning", "technical"),
            ("Pandas & NumPy", "technical"), ("Scikit-Learn", "technical"), ("PyTorch", "technical"),
            ("TensorFlow", "technical"), ("Tableau / PowerBI", "tool"), ("Network Security", "technical"),
            ("Penetration Testing", "technical"), ("CI/CD Pipelines", "tool"), ("Terraform", "tool"),
            ("Figma", "tool"), ("UI/UX Design Systems", "technical"), ("Wireframing & Prototyping", "technical"),
            ("React Native", "technical"), ("Flutter", "technical"), ("Unit Testing & QA", "technical"),
            ("Selenium / Cypress", "tool"), ("System Design", "technical"),
            ("Analytical Thinking", "soft"), ("Problem Solving", "soft"), ("Communication", "soft"),
            ("Team Collaboration", "soft"), ("Agile / Scrum", "soft"), ("Critical Thinking", "soft")
        ]

        skill_objs = {}
        for s_name, s_cat in skills_data:
            sk = Skill.query.filter_by(name=s_name).first()
            if not sk:
                sk = Skill(name=s_name, category=s_cat)
                db.session.add(sk)
                db.session.flush()
            skill_objs[s_name] = sk

        # 4. Seed 12 Detailed Careers
        careers_data = [
            {
                "title": "Full Stack Developer",
                "slug": "full-stack-developer",
                "category": "Web & Software Engineering",
                "description": "Full Stack Developers engineer both front-facing client interfaces and scalable backend server architectures, connecting responsive user experiences with robust database systems and secure RESTful services.",
                "difficulty": "Intermediate",
                "education_req": "Bachelor's in Computer Science, IT, or equivalent practical coding experience",
                "growth_outlook": "High Demand - 25% projected expansion over the next decade",
                "prerequisites": "Foundational programming knowledge, basic computer networking, and understanding of web browsers.",
                "typical_responsibilities": [
                    "Design and build responsive web applications using modern frontend frameworks like React.",
                    "Develop scalable server-side REST APIs using Flask, Express, or Django.",
                    "Design relational database schemas and optimize queries in MySQL or PostgreSQL.",
                    "Implement secure JWT authentication and role-based authorization.",
                    "Set up CI/CD pipelines, automated testing, and cloud deployment."
                ],
                "example_projects": [
                    "SaaS Project Management Application with Real-Time Notifications",
                    "E-Commerce Marketplace with Stripe Payment Processing & Order Tracking",
                    "Collaborative Document Editor with Rich-Text & Role Access"
                ],
                "required_skills": ["HTML/CSS", "JavaScript", "React.js", "Python", "Flask", "SQL / MySQL", "Git / GitHub"],
                "preferred_skills": ["TypeScript", "Docker", "REST APIs", "System Design"],
                "soft_skills": ["Problem Solving", "Communication", "Team Collaboration"],
                "roadmap_stages": [
                    {
                        "stage_number": 1,
                        "stage_title": "Web Fundamentals & Modern JavaScript",
                        "topics": ["Semantic HTML5", "CSS3 Flexbox & Grid", "Modern JavaScript (ES6+)", "DOM Manipulation", "Asynchronous JavaScript (Promises & Fetch)"],
                        "skills_covered": ["HTML/CSS", "JavaScript"],
                        "practical_exercises": "Build responsive landing pages and an interactive task tracker using vanilla JS.",
                        "mini_project": "Responsive Portfolio Website featuring dynamic theme toggling and project filters.",
                        "capstone_project": "",
                        "checklist": ["Master Flexbox and Grid layouts", "Understand ES6 modules, destructuring, and arrow functions", "Consume public JSON APIs"]
                    },
                    {
                        "stage_number": 2,
                        "stage_title": "Frontend Mastery with React",
                        "topics": ["React Components & Props", "State Management with Hooks (useState, useEffect)", "Context API", "React Router Navigation", "Tailwind / Modern CSS Modules"],
                        "skills_covered": ["React.js", "JavaScript"],
                        "practical_exercises": "Create reusable UI component libraries (cards, modal popups, data tables).",
                        "mini_project": "Dynamic Weather & Activity Dashboard with live API integration.",
                        "capstone_project": "",
                        "checklist": ["Build client-side routing", "Manage component lifecycles cleanly", "Handle form state and validation"]
                    },
                    {
                        "stage_number": 3,
                        "stage_title": "Backend Engineering with Python & Flask",
                        "topics": ["Flask Architecture", "Routing & Blueprints", "Request/Response lifecycle", "JSON API Conventions", "Error Handling & Middleware"],
                        "skills_covered": ["Python", "Flask", "REST APIs"],
                        "practical_exercises": "Create a modular RESTful CRUD API with JSON response formatting.",
                        "mini_project": "Inventory & Product Catalog REST API with filtering and search.",
                        "capstone_project": "",
                        "checklist": ["Configure Flask Application Factory pattern", "Implement centralized error handlers", "Test endpoints using Postman or cURL"]
                    },
                    {
                        "stage_number": 4,
                        "stage_title": "Relational Databases & SQLAlchemy",
                        "topics": ["Relational Database Design", "MySQL Schema & Constraints", "SQLAlchemy ORM Models", "Migrations with Flask-Migrate", "Query Optimization"],
                        "skills_covered": ["SQL / MySQL", "Flask"],
                        "practical_exercises": "Model one-to-many and many-to-many relational tables with indexing.",
                        "mini_project": "Database-driven Blog Engine with nested comments and category tags.",
                        "capstone_project": "",
                        "checklist": ["Enforce foreign key constraints", "Perform complex join queries", "Execute schema migrations safely"]
                    },
                    {
                        "stage_number": 5,
                        "stage_title": "Authentication, Security & Testing",
                        "topics": ["JWT Authentication", "Password Hashing (Bcrypt/PBKDF2)", "CORS Configuration", "SQL Injection Protection", "Unit & Integration Testing with Pytest"],
                        "skills_covered": ["Flask", "REST APIs", "Unit Testing & QA"],
                        "practical_exercises": "Write automated test cases verifying authentication tokens and protected routes.",
                        "mini_project": "Secure Auth Microservice with password reset tokens and role authorization.",
                        "capstone_project": "",
                        "checklist": ["Implement refresh token rotation", "Sanitize user inputs", "Achieve >80% test coverage on API routes"]
                    },
                    {
                        "stage_number": 6,
                        "stage_title": "DevOps, Containerization & Cloud Deployment",
                        "topics": ["Dockerizing Frontend & Backend", "Docker Compose", "Environment Variable Management", "Production Web Servers (Gunicorn, Nginx)", "Cloud Deployment"],
                        "skills_covered": ["Docker", "Git / GitHub", "Linux"],
                        "practical_exercises": "Write Dockerfiles and launch local multi-container environments.",
                        "mini_project": "Containerized Deployment of Full Stack Application to Cloud.",
                        "capstone_project": "",
                        "checklist": ["Create multi-stage Docker builds", "Deploy backend and static frontend", "Set up automated GitHub Actions workflow"]
                    },
                    {
                        "stage_number": 7,
                        "stage_title": "Comprehensive Capstone Full Stack Platform",
                        "topics": ["System Architecture", "End-to-End Integration", "Production Monitoring", "Performance Profiling", "Documentation"],
                        "skills_covered": ["Full Stack Architecture", "System Design"],
                        "practical_exercises": "Benchmark response times and optimize bundle sizes.",
                        "mini_project": "",
                        "capstone_project": "Production-Ready Collaborative Workspace Platform with live analytics, user authentication, and responsive dashboards.",
                        "checklist": ["Implement full CRUD workflows", "Connect React UI with Flask & MySQL backend", "Deploy live application with documentation"]
                    }
                ]
            },
            {
                "title": "Frontend Developer",
                "slug": "frontend-developer",
                "category": "Web & Software Engineering",
                "description": "Frontend Developers specialize in crafting visually compelling, accessible, and ultra-responsive user interfaces. They bridge UI/UX design concepts into high-performance web applications.",
                "difficulty": "Beginner to Intermediate",
                "education_req": "Bachelor's in CS / IT or relevant self-guided frontend portfolio",
                "growth_outlook": "High Demand - 20% estimated industry growth",
                "prerequisites": "Basic understanding of web pages and visual design aesthetics.",
                "typical_responsibilities": [
                    "Translate UI/UX Figma wireframes into clean, accessible React components.",
                    "Optimize rendering performance and minimize client-side bundle size.",
                    "Ensure cross-browser compatibility and mobile responsiveness.",
                    "Manage state flow using Context API or modern state managers."
                ],
                "example_projects": [
                    "Interactive Analytics Dashboard with Recharts and dark mode",
                    "Design System Component Library documented with Storybook",
                    "Streaming Video Browser with smooth micro-interactions"
                ],
                "required_skills": ["HTML/CSS", "JavaScript", "React.js", "Git / GitHub"],
                "preferred_skills": ["TypeScript", "Figma", "UI/UX Design Systems"],
                "soft_skills": ["Creativity", "Communication", "Problem Solving"],
                "roadmap_stages": [
                    {
                        "stage_number": 1,
                        "stage_title": "Modern HTML5 & Responsive CSS Mastery",
                        "topics": ["Semantic Web", "Flexbox & CSS Grid", "CSS Variables", "Responsive Media Queries"],
                        "skills_covered": ["HTML/CSS"],
                        "practical_exercises": "Build responsive mockups matching modern SaaS landing pages.",
                        "mini_project": "Pixel-Perfect Landing Page with smooth micro-interactions.",
                        "capstone_project": "",
                        "checklist": ["Pass accessibility contrast checks", "Support mobile/tablet breakpoints"]
                    },
                    {
                        "stage_number": 2,
                        "stage_title": "Deep JavaScript (ES6+)",
                        "topics": ["Closures & Scope", "Asynchronous JS & Event Loop", "Fetch API", "Local Storage"],
                        "skills_covered": ["JavaScript"],
                        "practical_exercises": "Implement an interactive Kanban board with drag-and-drop.",
                        "mini_project": "Product Catalog with multi-attribute filtering.",
                        "capstone_project": "",
                        "checklist": ["Write modular ES6 code", "Handle API errors gracefully"]
                    },
                    {
                        "stage_number": 3,
                        "stage_title": "React Ecosystem & Hooks",
                        "topics": ["Component Hierarchy", "useState, useEffect, useMemo", "Custom Hooks", "React Router"],
                        "skills_covered": ["React.js"],
                        "practical_exercises": "Develop reusable modal dialogs, data tables, and toast notifications.",
                        "mini_project": "Personal Finance Tracker with dynamic charts.",
                        "capstone_project": "",
                        "checklist": ["Optimize component re-renders", "Manage route guards"]
                    },
                    {
                        "stage_number": 4,
                        "stage_title": "TypeScript for React",
                        "topics": ["Type Inference & Interfaces", "Generic Components", "Typing Hooks & Props", "Strict Mode"],
                        "skills_covered": ["TypeScript", "React.js"],
                        "practical_exercises": "Migrate JavaScript React components to strongly-typed TypeScript.",
                        "mini_project": "Interactive Form Builder with dynamic validation.",
                        "capstone_project": "",
                        "checklist": ["Eliminate any-type usages", "Type API payload responses"]
                    },
                    {
                        "stage_number": 5,
                        "stage_title": "Advanced UI & Capstone Application",
                        "topics": ["Performance Profiling", "Lighthouse 100/100 Audits", "Micro-Interactions", "Production Build"],
                        "skills_covered": ["UI/UX Design Systems", "React.js"],
                        "practical_exercises": "Conduct performance audits and tree-shaking optimizations.",
                        "mini_project": "",
                        "capstone_project": "High-Performance Interactive SaaS Dashboard with customizable widgets and real-time data feeds.",
                        "checklist": ["Ensure sub-1s First Contentful Paint", "Deploy to Vercel/Netlify"]
                    }
                ]
            },
            {
                "title": "Backend Developer",
                "slug": "backend-developer",
                "category": "Web & Software Engineering",
                "description": "Backend Developers construct the engine that drives modern applications. They design scalable servers, business logic, secure database schemas, high-throughput caching, and robust API endpoints.",
                "difficulty": "Intermediate",
                "education_req": "Bachelor's degree in Computer Science, Software Engineering, or related discipline",
                "growth_outlook": "High Demand - 22% expected growth",
                "prerequisites": "Solid foundation in programming logic and data structures.",
                "typical_responsibilities": [
                    "Design and implement RESTful and GraphQL API services.",
                    "Optimize database schemas, indexes, and queries.",
                    "Ensure bulletproof application security and data protection.",
                    "Implement background tasks, caching, and message queues."
                ],
                "example_projects": [
                    "High-Throughput Payment Processing API with idempotency keys",
                    "Real-Time Chat & Collaboration Engine using WebSockets",
                    "Distributed File Storage & Metadata Management Service"
                ],
                "required_skills": ["Python", "Flask", "SQL / MySQL", "REST APIs", "Git / GitHub"],
                "preferred_skills": ["Docker", "PostgreSQL", "System Design", "Linux"],
                "soft_skills": ["Analytical Thinking", "Problem Solving", "Team Collaboration"],
                "roadmap_stages": [
                    {
                        "stage_number": 1,
                        "stage_title": "Core Programming & Data Structures",
                        "topics": ["Object-Oriented Programming", "Algorithm Complexity (Big O)", "Hash Tables, Trees, Graphs", "File I/O"],
                        "skills_covered": ["Python", "Data Structures & Algorithms"],
                        "practical_exercises": "Implement custom data structures and algorithm benchmarks.",
                        "mini_project": "CLI Database Query Engine with in-memory caching.",
                        "capstone_project": "",
                        "checklist": ["Write unit tests for core logic", "Analyze time and space complexity"]
                    },
                    {
                        "stage_number": 2,
                        "stage_title": "Server Architecture & REST APIs",
                        "topics": ["HTTP Protocol & Status Codes", "Flask RESTful Routing", "Request Validation", "Middleware"],
                        "skills_covered": ["Flask", "REST APIs"],
                        "practical_exercises": "Build a secure REST API with OpenAPI/Swagger documentation.",
                        "mini_project": "User & Role Management Microservice with token auth.",
                        "capstone_project": "",
                        "checklist": ["Return standardized JSON error structures", "Prevent common OWASP vulnerabilities"]
                    },
                    {
                        "stage_number": 3,
                        "stage_title": "Relational Data Modeling & Optimization",
                        "topics": ["Schema Normalization (3NF)", "Indexes & Execution Plans", "Transactions & ACID", "Connection Pooling"],
                        "skills_covered": ["SQL / MySQL", "PostgreSQL"],
                        "practical_exercises": "Profile slow queries and implement composite B-Tree indexes.",
                        "mini_project": "E-Commerce Database Schema handling concurrency and transactions.",
                        "capstone_project": "",
                        "checklist": ["Manage database rollbacks", "Handle high concurrency locks safely"]
                    },
                    {
                        "stage_number": 4,
                        "stage_title": "Caching, Background Jobs & Architecture",
                        "topics": ["Redis Caching", "Asynchronous Task Queues", "System Design Basics", "Rate Limiting"],
                        "skills_covered": ["System Design", "Docker"],
                        "practical_exercises": "Implement token bucket rate limiter and caching layer.",
                        "mini_project": "Email & Notification Dispatcher with job retries.",
                        "capstone_project": "",
                        "checklist": ["Cache frequent query results", "Configure exponential backoff"]
                    },
                    {
                        "stage_number": 5,
                        "stage_title": "Scalable Backend Capstone System",
                        "topics": ["Microservices vs Monolith", "Monitoring & Logging", "Dockerized Containerization", "Load Balancing"],
                        "skills_covered": ["System Design", "Docker", "Linux"],
                        "practical_exercises": "Deploy multi-tier containerized stack with health checks.",
                        "mini_project": "",
                        "capstone_project": "Enterprise Multi-Tenant REST API Platform with automated auditing, caching, and database clustering.",
                        "checklist": ["Achieve high throughput under load testing", "Deploy with monitoring metrics"]
                    }
                ]
            },
            {
                "title": "Data Analyst",
                "slug": "data-analyst",
                "category": "Data & Analytics",
                "description": "Data Analysts transform raw business data into actionable visual insights, interactive dashboards, and strategic forecasts that guide enterprise decision-making.",
                "difficulty": "Beginner to Intermediate",
                "education_req": "Bachelor's in CS, Information Systems, Statistics, or Business Analytics",
                "growth_outlook": "Very High - 23% projected growth",
                "prerequisites": "Basic arithmetic, curiosity for business metrics, and structured thinking.",
                "typical_responsibilities": [
                    "Query and aggregate complex datasets using SQL.",
                    "Clean and normalize messy data using Python and Pandas.",
                    "Build executive dashboards in PowerBI, Tableau, or web charting libraries.",
                    "Perform exploratory data analysis and trend hypothesis testing."
                ],
                "example_projects": [
                    "Customer Churn & Retention Analysis Dashboard",
                    "Sales Performance & Regional Revenue Forecasting Tool",
                    "Healthcare Operational Efficiency & Wait-Time Study"
                ],
                "required_skills": ["SQL / MySQL", "Python", "Pandas & NumPy", "Tableau / PowerBI"],
                "preferred_skills": ["Analytical Thinking", "HTML/CSS", "Git / GitHub"],
                "soft_skills": ["Communication", "Critical Thinking", "Problem Solving"],
                "roadmap_stages": [
                    {
                        "stage_number": 1,
                        "stage_title": "Advanced SQL for Analytics",
                        "topics": ["SELECT & Filtering", "Aggregations & GROUP BY", "Window Functions (ROW_NUMBER, RANK)", "CTEs & Subqueries"],
                        "skills_covered": ["SQL / MySQL"],
                        "practical_exercises": "Write multi-table analytical joins and cohort retention SQL queries.",
                        "mini_project": "E-Commerce Customer Lifetime Value & Cohort Analysis in SQL.",
                        "capstone_project": "",
                        "checklist": ["Master inner/outer/cross joins", "Use analytical window functions"]
                    },
                    {
                        "stage_number": 2,
                        "stage_title": "Data Wrangling with Python & Pandas",
                        "topics": ["NumPy Arrays", "Pandas DataFrames", "Data Imputation & Cleaning", "Datetime & Categorical Transformations"],
                        "skills_covered": ["Python", "Pandas & NumPy"],
                        "practical_exercises": "Clean messy real-world datasets with missing values and outliers.",
                        "mini_project": "Global Air Quality & Weather Trends Exploratory Analysis.",
                        "capstone_project": "",
                        "checklist": ["Profile datasets using Pandas", "Handle missing data systematically"]
                    },
                    {
                        "stage_number": 3,
                        "stage_title": "Data Storytelling & Business Intelligence",
                        "topics": ["Data Visualization Best Practices", "PowerBI / Tableau Modeling", "KPI Dashboards", "Statistical Summaries"],
                        "skills_covered": ["Tableau / PowerBI", "Communication"],
                        "practical_exercises": "Design intuitive KPI cards, funnel charts, and geo-maps.",
                        "mini_project": "Interactive SaaS Executive Operations Dashboard.",
                        "capstone_project": "",
                        "checklist": ["Structure executive summaries", "Present key findings clearly"]
                    },
                    {
                        "stage_number": 4,
                        "stage_title": "End-to-End Analytics Capstone Portfolio",
                        "topics": ["Hypothesis Testing", "Correlation vs Causation", "Automated Reporting", "Executive Deck Presentation"],
                        "skills_covered": ["Analytical Thinking", "Pandas & NumPy"],
                        "practical_exercises": "Deliver an analytical presentation with actionable recommendations.",
                        "mini_project": "",
                        "capstone_project": "Comprehensive Multi-Year Retail Market Analysis & Predictive Trend Forecast.",
                        "checklist": ["Validate analytical conclusions", "Publish interactive report"]
                    }
                ]
            },
            {
                "title": "Data Scientist",
                "slug": "data-scientist",
                "category": "Data & Analytics",
                "description": "Data Scientists leverage mathematics, statistical modeling, and machine learning algorithms to uncover predictive patterns, automate forecasting, and extract profound insights from massive datasets.",
                "difficulty": "Intermediate to Advanced",
                "education_req": "Bachelor's or Master's in Computer Science, Data Science, Mathematics, or Statistics",
                "growth_outlook": "Extremely High - 35% growth through 2032",
                "prerequisites": "Strong foundation in calculus, linear algebra, probability, and Python programming.",
                "typical_responsibilities": [
                    "Formulate mathematical formulations for complex predictive problems.",
                    "Perform feature engineering, extraction, and dimensional reduction.",
                    "Train, evaluate, and tune machine learning regression and classification models.",
                    "Deploy statistical models as production API endpoints."
                ],
                "example_projects": [
                    "Credit Default Risk Prediction with Gradient Boosting",
                    "Customer Sentiment Classification using NLP",
                    "Dynamic Pricing Recommendation Engine"
                ],
                "required_skills": ["Python", "Pandas & NumPy", "Scikit-Learn", "SQL / MySQL", "Machine Learning"],
                "preferred_skills": ["PyTorch", "Docker", "Git / GitHub"],
                "soft_skills": ["Analytical Thinking", "Problem Solving", "Critical Thinking"],
                "roadmap_stages": [
                    {
                        "stage_number": 1,
                        "stage_title": "Mathematical Foundations for Data Science",
                        "topics": ["Linear Algebra (Matrices & Vectors)", "Calculus (Gradients & Partial Derivatives)", "Probability Distributions", "Hypothesis Testing"],
                        "skills_covered": ["Analytical Thinking", "Python"],
                        "practical_exercises": "Implement linear regression using pure matrix algebra.",
                        "mini_project": "Statistical Analysis of Real-World Clinical Trial Data.",
                        "capstone_project": "",
                        "checklist": ["Understand variance, covariance, and standard error", "Calculate eigenvalues & eigenvectors"]
                    },
                    {
                        "stage_number": 2,
                        "stage_title": "Feature Engineering & Machine Learning",
                        "topics": ["Scikit-Learn Workflows", "Supervised Learning (Trees, Forests, SVM)", "Unsupervised Learning (K-Means, PCA)", "Cross-Validation & Hyperparameter Tuning"],
                        "skills_covered": ["Scikit-Learn", "Machine Learning"],
                        "practical_exercises": "Build preprocessing pipelines with one-hot encoding and robust scaling.",
                        "mini_project": "Housing Price Valuation Engine with ensemble regressors.",
                        "capstone_project": "",
                        "checklist": ["Evaluate Precision, Recall, F1, and ROC-AUC", "Prevent data leakage in train/test splits"]
                    },
                    {
                        "stage_number": 3,
                        "stage_title": "Advanced Predictive Modeling & ML Pipelines",
                        "topics": ["XGBoost & LightGBM", "Model Explainability (SHAP, LIME)", "Imbalanced Data Strategies (SMOTE)", "Model Serialization"],
                        "skills_covered": ["Machine Learning", "Python"],
                        "practical_exercises": "Explain model predictions with SHAP waterfall plots.",
                        "mini_project": "Fraud Detection System for Financial Transactions.",
                        "capstone_project": "",
                        "checklist": ["Deploy serialized model as Flask endpoint", "Document feature importance"]
                    },
                    {
                        "stage_number": 4,
                        "stage_title": "Production Data Science Capstone",
                        "topics": ["End-to-End ML Lifecycle", "Monitoring Data Drift", "A/B Testing Frameworks", "Production Deployment"],
                        "skills_covered": ["Machine Learning", "Flask", "Docker"],
                        "practical_exercises": "Build automated batch inference pipeline with containerization.",
                        "mini_project": "",
                        "capstone_project": "End-to-End Predictive Health Analytics & Early Diagnosis Platform with interactive web dashboard.",
                        "checklist": ["Complete full pipeline from raw data to predictions", "Host on cloud instance"]
                    }
                ]
            },
            {
                "title": "AI/ML Engineer",
                "slug": "ai-ml-engineer",
                "category": "Artificial Intelligence",
                "description": "AI & Machine Learning Engineers design, train, fine-tune, and deploy deep learning architectures, Large Language Models (LLMs), computer vision networks, and scalable AI infrastructure.",
                "difficulty": "Advanced",
                "education_req": "Bachelor's or Master's in Computer Science, Artificial Intelligence, or Robotics",
                "growth_outlook": "Extraordinary - 40% growth in modern engineering roles",
                "prerequisites": "Advanced Python, calculus, linear algebra, and data structures.",
                "typical_responsibilities": [
                    "Design and optimize deep neural network architectures using PyTorch or TensorFlow.",
                    "Fine-tune pre-trained foundation models using LoRA and parameter-efficient techniques.",
                    "Build Retrieval-Augmented Generation (RAG) systems with vector databases.",
                    "Optimize inference latency using quantization and TensorRT."
                ],
                "example_projects": [
                    "Enterprise Document Q&A with RAG, Embeddings & Vector Search",
                    "Real-Time Object Detection & Safety Monitoring System",
                    "Autonomous Agent Workflow Automation with Tool Calling"
                ],
                "required_skills": ["Python", "PyTorch", "Machine Learning", "Data Structures & Algorithms"],
                "preferred_skills": ["TensorFlow", "Docker", "REST APIs", "AWS"],
                "soft_skills": ["Problem Solving", "Analytical Thinking", "Critical Thinking"],
                "roadmap_stages": [
                    {
                        "stage_number": 1,
                        "stage_title": "Deep Learning Fundamentals",
                        "topics": ["Perceptrons & Multi-Layer Neural Nets", "Backpropagation & Gradient Descent", "Activation Functions (ReLU, GELU)", "Loss Functions & Optimizers (AdamW)"],
                        "skills_covered": ["Python", "Machine Learning"],
                        "practical_exercises": "Implement backpropagation from scratch with NumPy.",
                        "mini_project": "Handwritten Digit Classifier from scratch.",
                        "capstone_project": "",
                        "checklist": ["Derive backpropagation gradient equations", "Implement custom loss layers"]
                    },
                    {
                        "stage_number": 2,
                        "stage_title": "PyTorch Mastery & Computer Vision",
                        "topics": ["PyTorch Tensors & autograd", "Convolutional Neural Networks (CNNs)", "Transfer Learning (ResNet, EfficientNet)", "Data Augmentation"],
                        "skills_covered": ["PyTorch", "Machine Learning"],
                        "practical_exercises": "Train a custom image classification model with PyTorch Lightning.",
                        "mini_project": "Medical Scan Anomaly Detection System.",
                        "capstone_project": "",
                        "checklist": ["Utilize GPU acceleration with CUDA", "Save and load model checkpoints"]
                    },
                    {
                        "stage_number": 3,
                        "stage_title": "Transformers, NLP & Generative AI",
                        "topics": ["Attention Mechanisms & Transformer Architecture", "HuggingFace Ecosystem", "Vector Databases & Embeddings", "Retrieval-Augmented Generation (RAG)"],
                        "skills_covered": ["PyTorch", "Python"],
                        "practical_exercises": "Build a RAG pipeline utilizing vector search and open foundation models.",
                        "mini_project": "Domain-Specific Technical Documentation Assistant.",
                        "capstone_project": "",
                        "checklist": ["Chunk documents and generate embeddings", "Perform similarity search"]
                    },
                    {
                        "stage_number": 4,
                        "stage_title": "Production AI Capstone & MLOps",
                        "topics": ["Model Serving (FastAPI/Triton)", "Quantization (GGUF/AWQ)", "Monitoring Latency & Hallucinations", "Dockerized AI Microservice"],
                        "skills_covered": ["Docker", "REST APIs", "PyTorch"],
                        "practical_exercises": "Deploy quantized model behind a production REST API.",
                        "mini_project": "",
                        "capstone_project": "Enterprise Multi-Modal Intelligent Knowledge Base with real-time vector search and tool-calling capabilities.",
                        "checklist": ["Measure tokens per second latency", "Deploy with complete API docs"]
                    }
                ]
            },
            {
                "title": "Cybersecurity Analyst",
                "slug": "cybersecurity-analyst",
                "category": "Security & Infrastructure",
                "description": "Cybersecurity Analysts safeguard networks, servers, and sensitive digital assets from threats, vulnerabilities, unauthorized intrusion, and cyberattacks.",
                "difficulty": "Intermediate",
                "education_req": "Bachelor's in Cybersecurity, Computer Science, or Network Engineering",
                "growth_outlook": "Exceptional - 32% expected industry expansion",
                "prerequisites": "Understanding of computer networks, operating systems, and basic scripting.",
                "typical_responsibilities": [
                    "Monitor networks for security breaches, anomalies, and unauthorized intrusions.",
                    "Conduct vulnerability assessments and penetration tests.",
                    "Analyze malware, phishing attempts, and threat attack vectors.",
                    "Implement firewalls, access controls, and encryption standards."
                ],
                "example_projects": [
                    "Automated Vulnerability Scanner & Report Generator",
                    "Network Intrusion Detection System using Packet Analysis",
                    "Security Information & Event Management (SIEM) Log Pipeline"
                ],
                "required_skills": ["Linux", "Network Security", "Python", "Git / GitHub"],
                "preferred_skills": ["Penetration Testing", "Docker", "Analytical Thinking"],
                "soft_skills": ["Critical Thinking", "Problem Solving", "Communication"],
                "roadmap_stages": [
                    {
                        "stage_number": 1,
                        "stage_title": "Networking Protocols & Operating System Security",
                        "topics": ["OSI & TCP/IP Model", "DNS, HTTP/S, SSH, ARP protocols", "Linux System Administration", "File Permissions & Hardening"],
                        "skills_covered": ["Linux", "Network Security"],
                        "practical_exercises": "Analyze network traffic using Wireshark and configure iptables firewalls.",
                        "mini_project": "Secure Linux Server Hardening & Auditing Script.",
                        "capstone_project": "",
                        "checklist": ["Inspect PCAP packets", "Configure SSH key-based authentication"]
                    },
                    {
                        "stage_number": 2,
                        "stage_title": "Security Operations & Vulnerability Assessment",
                        "topics": ["OWASP Top 10 Web Vulnerabilities", "Port Scanning with Nmap", "Vulnerability Scanning", "Log Analysis & SIEM"],
                        "skills_covered": ["Network Security", "Linux"],
                        "practical_exercises": "Perform controlled penetration testing on deliberately vulnerable web apps.",
                        "mini_project": "Automated Port & Security Header Scanner in Python.",
                        "capstone_project": "",
                        "checklist": ["Identify SQL injection and XSS flaws", "Parse server authentication logs"]
                    },
                    {
                        "stage_number": 3,
                        "stage_title": "Threat Intelligence & Cryptography",
                        "topics": ["Symmetric vs Asymmetric Encryption", "Public Key Infrastructure (PKI)", "Threat Modeling", "Incident Response Protocols"],
                        "skills_covered": ["Network Security", "Analytical Thinking"],
                        "practical_exercises": "Generate certificates and configure TLS 1.3 encryption.",
                        "mini_project": "Incident Response Plan & Malware Sandbox Simulator.",
                        "capstone_project": "",
                        "checklist": ["Verify digital signatures", "Map threats to MITRE ATT&CK framework"]
                    },
                    {
                        "stage_number": 4,
                        "stage_title": "Enterprise Cybersecurity Capstone",
                        "topics": ["Zero Trust Architecture", "Cloud Security (IAM)", "Security Compliance (SOC2/ISO 27001)", "Security Automation"],
                        "skills_covered": ["Network Security", "Linux", "Python"],
                        "practical_exercises": "Automate security compliance checks in cloud environments.",
                        "mini_project": "",
                        "capstone_project": "End-to-End Enterprise SIEM Threat Detection & Incident Response Pipeline with live alert dashboards.",
                        "checklist": ["Trigger real-time intrusion alerts", "Deliver comprehensive audit report"]
                    }
                ]
            },
            {
                "title": "Cloud Engineer",
                "slug": "cloud-engineer",
                "category": "Cloud & DevOps",
                "description": "Cloud Engineers architect, configure, and maintain scalable cloud infrastructure, storage systems, virtual networks, and serverless architectures on major cloud platforms like AWS and Azure.",
                "difficulty": "Intermediate to Advanced",
                "education_req": "Bachelor's in Computer Science, Cloud Computing, or IT",
                "growth_outlook": "High Demand - 27% growth",
                "prerequisites": "Foundations in networking, Linux shell, and basic programming.",
                "typical_responsibilities": [
                    "Design resilient, highly available multi-region cloud architectures.",
                    "Provision infrastructure as code using Terraform.",
                    "Manage cloud identity, access roles, and VPC networks.",
                    "Optimize cloud resource costs and monitoring telemetry."
                ],
                "example_projects": [
                    "Automated Multi-Tier AWS VPC Infrastructure with Terraform",
                    "Serverless Event-Driven Image Processing Pipeline",
                    "High-Availability Auto-Scaling Web Application Cluster"
                ],
                "required_skills": ["AWS", "Linux", "Docker", "Python", "Git / GitHub"],
                "preferred_skills": ["Terraform", "Kubernetes", "Azure", "CI/CD Pipelines"],
                "soft_skills": ["Problem Solving", "Team Collaboration", "Communication"],
                "roadmap_stages": [
                    {
                        "stage_number": 1,
                        "stage_title": "Linux & Cloud Foundations",
                        "topics": ["Linux CLI & Bash Scripting", "Cloud Service Models (IaaS, PaaS, SaaS)", "Virtual Private Clouds (VPCs)", "Compute Instances (EC2/VMs)"],
                        "skills_covered": ["Linux", "AWS"],
                        "practical_exercises": "Configure virtual subnets, route tables, and security groups.",
                        "mini_project": "Automated Web Server Provisioning using Cloud-Init scripts.",
                        "capstone_project": "",
                        "checklist": ["Configure public and private subnets", "Connect securely via bastion hosts"]
                    },
                    {
                        "stage_number": 2,
                        "stage_title": "Storage, Databases & Serverless",
                        "topics": ["Object Storage (S3/Blob)", "Managed Relational DBs (RDS)", "Serverless Functions (Lambda)", "API Gateway Integration"],
                        "skills_covered": ["AWS", "SQL / MySQL"],
                        "practical_exercises": "Build an event-driven serverless pipeline triggered by file uploads.",
                        "mini_project": "Serverless Document Conversion & Thumbnail Microservice.",
                        "capstone_project": "",
                        "checklist": ["Enforce S3 bucket encryption policies", "Connect Lambda functions to RDS"]
                    },
                    {
                        "stage_number": 3,
                        "stage_title": "Infrastructure as Code (Terraform)",
                        "topics": ["Declarative HCL Syntax", "Terraform State Management", "Reusable Terraform Modules", "Remote Backends"],
                        "skills_covered": ["Terraform", "AWS"],
                        "practical_exercises": "Write Terraform modules to spin up production VPC environments.",
                        "mini_project": "Reproducible Multi-Environment Cloud Stack with Terraform.",
                        "capstone_project": "",
                        "checklist": ["Manage state locks with DynamoDB", "Parameterize environments (dev/prod)"]
                    },
                    {
                        "stage_number": 4,
                        "stage_title": "High Availability & Cloud Capstone",
                        "topics": ["Application Load Balancers", "Auto Scaling Groups", "CloudWatch Metrics & Alarms", "Cost Optimization"],
                        "skills_covered": ["AWS", "System Design"],
                        "practical_exercises": "Perform stress testing to demonstrate automated scale-out.",
                        "mini_project": "",
                        "capstone_project": "Enterprise Multi-Region Fault-Tolerant Cloud Application with automated failover and telemetry.",
                        "checklist": ["Implement health check auto-recovery", "Audit cost optimization opportunities"]
                    }
                ]
            },
            {
                "title": "DevOps Engineer",
                "slug": "devops-engineer",
                "category": "Cloud & DevOps",
                "description": "DevOps Engineers bridge the gap between software development and IT operations. They automate CI/CD release cycles, manage container orchestration with Kubernetes, and maintain site reliability.",
                "difficulty": "Intermediate to Advanced",
                "education_req": "Bachelor's in Computer Science, Software Engineering, or equivalent IT experience",
                "growth_outlook": "Very High - 26% market demand",
                "prerequisites": "Proficiency in Linux, scripting (Python or Bash), and version control.",
                "typical_responsibilities": [
                    "Build automated Continuous Integration and Continuous Deployment (CI/CD) pipelines.",
                    "Orchestrate containerized clusters using Kubernetes and Helm.",
                    "Implement centralized logging, tracing, and metric alerts (Prometheus/Grafana).",
                    "Automate zero-downtime rolling deployments and rollbacks."
                ],
                "example_projects": [
                    "Zero-Downtime Blue/Green CI/CD Pipeline on GitHub Actions",
                    "Kubernetes Cluster Deployment with Helm & Ingress Controller",
                    "Observability Stack with Prometheus, Grafana, and Alertmanager"
                ],
                "required_skills": ["Docker", "Linux", "CI/CD Pipelines", "Git / GitHub", "Python"],
                "preferred_skills": ["Kubernetes", "AWS", "Terraform"],
                "soft_skills": ["Problem Solving", "Team Collaboration", "Agile / Scrum"],
                "roadmap_stages": [
                    {
                        "stage_number": 1,
                        "stage_title": "Containers & Docker Deep Dive",
                        "topics": ["Container Isolation & Namespaces", "Writing Optimized Dockerfiles", "Multi-Stage Builds", "Docker Compose Multi-Service Setup"],
                        "skills_covered": ["Docker", "Linux"],
                        "practical_exercises": "Containerize a full-stack Flask + React + MySQL application.",
                        "mini_project": "Production-Ready Container Suite with health checks.",
                        "capstone_project": "",
                        "checklist": ["Minimize image layers", "Run containers under non-root users"]
                    },
                    {
                        "stage_number": 2,
                        "stage_title": "Continuous Integration & Delivery (CI/CD)",
                        "topics": ["GitHub Actions Workflows", "Automated Testing in Pipelines", "Linting & Security Scans", "Artifact Packaging & Registries"],
                        "skills_covered": ["CI/CD Pipelines", "Git / GitHub"],
                        "practical_exercises": "Build a pipeline that triggers tests, builds images, and publishes to Docker Hub.",
                        "mini_project": "Automated Test & Release Pipeline for Microservices.",
                        "capstone_project": "",
                        "checklist": ["Implement branch protection rules", "Automate semantic versioning"]
                    },
                    {
                        "stage_number": 3,
                        "stage_title": "Kubernetes Orchestration",
                        "topics": ["Pods, Deployments, Services", "ConfigMaps & Secrets", "Ingress Controllers", "Helm Charts Packaging"],
                        "skills_covered": ["Kubernetes", "Docker"],
                        "practical_exercises": "Deploy multi-replica services with rolling update strategies.",
                        "mini_project": "Kubernetes Microservices Manifest Suite with ingress routing.",
                        "capstone_project": "",
                        "checklist": ["Define CPU/Memory resource limits", "Configure readiness & liveness probes"]
                    },
                    {
                        "stage_number": 4,
                        "stage_title": "Observability & Production DevOps Capstone",
                        "topics": ["Prometheus Metrics Scraping", "Grafana Dashboards", "Log Aggregation", "GitOps Practices"],
                        "skills_covered": ["CI/CD Pipelines", "Linux", "System Design"],
                        "practical_exercises": "Build custom Grafana dashboard tracking latency, errors, and throughput.",
                        "mini_project": "",
                        "capstone_project": "Full-Lifecycle GitOps Continuous Delivery Platform with automated canary deployments and live observability.",
                        "checklist": ["Configure automated rollback on error spikes", "Document operational runbooks"]
                    }
                ]
            },
            {
                "title": "UI/UX Designer",
                "slug": "ui-ux-designer",
                "category": "Design & Product",
                "description": "UI/UX Designers conceptualize engaging, intuitive digital experiences. They conduct user research, craft wireframes, establish comprehensive design systems, and prototype sleek interfaces in Figma.",
                "difficulty": "Beginner to Intermediate",
                "education_req": "Bachelor's in Design, Human-Computer Interaction, or Computer Science",
                "growth_outlook": "High - 16% growth in tech product sectors",
                "prerequisites": "Empathy for end users, attention to visual hierarchy, and interest in design tools.",
                "typical_responsibilities": [
                    "Conduct qualitative user interviews and create user personas.",
                    "Develop low-fidelity wireframes and user flow journey maps.",
                    "Design high-fidelity UI mockups and interactive prototypes in Figma.",
                    "Establish atomic design component libraries and style guides."
                ],
                "example_projects": [
                    "Mobile Banking & Investment App Redesign with Accessibility Focus",
                    "Comprehensive SaaS Dashboard Design System in Figma",
                    "E-Commerce Checkout Optimization Prototype with A/B Testing Variations"
                ],
                "required_skills": ["Figma", "UI/UX Design Systems", "Wireframing & Prototyping"],
                "preferred_skills": ["HTML/CSS", "Communication", "Analytical Thinking"],
                "soft_skills": ["Creativity", "Communication", "Problem Solving"],
                "roadmap_stages": [
                    {
                        "stage_number": 1,
                        "stage_title": "UX Principles & User Research",
                        "topics": ["Design Thinking Methodology", "User Personas & Journey Maps", "Information Architecture", "Usability Heuristics"],
                        "skills_covered": ["UI/UX Design Systems"],
                        "practical_exercises": "Audit an existing application using Nielsen's 10 usability heuristics.",
                        "mini_project": "User Research Report & Persona Deck for a student productivity app.",
                        "capstone_project": "",
                        "checklist": ["Map end-to-end user journeys", "Identify core user pain points"]
                    },
                    {
                        "stage_number": 2,
                        "stage_title": "Wireframing & Figma Tool Mastery",
                        "topics": ["Low-Fidelity Sketches", "Figma Auto-Layout & Constraints", "Components & Variants", "Interactive Micro-Animations"],
                        "skills_covered": ["Figma", "Wireframing & Prototyping"],
                        "practical_exercises": "Design responsive navigation bars and modal layouts using Auto-Layout.",
                        "mini_project": "Clickable Mobile App Prototype with realistic interactions.",
                        "capstone_project": "",
                        "checklist": ["Master nested Auto-Layout frames", "Create component interactive states"]
                    },
                    {
                        "stage_number": 3,
                        "stage_title": "Visual Design & Design Systems",
                        "topics": ["Color Theory & Contrast Accessibility (WCAG 2.1)", "Typography Hierarchy", "Design Tokens & Styles", "Atomic Design Systems"],
                        "skills_covered": ["UI/UX Design Systems", "Figma"],
                        "practical_exercises": "Create a complete design system with typography, color, and component tokens.",
                        "mini_project": "Design System UI Kit with 50+ reusable components.",
                        "capstone_project": "",
                        "checklist": ["Ensure AA/AAA accessibility compliance", "Document component developer guidelines"]
                    },
                    {
                        "stage_number": 4,
                        "stage_title": "End-to-End Product Design Capstone",
                        "topics": ["Usability Testing & Iteration", "Design-to-Code Developer Handoff", "Interactive Prototypes", "Case Study Storytelling"],
                        "skills_covered": ["Figma", "Communication", "Creativity"],
                        "practical_exercises": "Run usability testing sessions with 5 users and document insights.",
                        "mini_project": "",
                        "capstone_project": "End-to-End SaaS Web & Mobile Platform Product Redesign with interactive prototype and case study.",
                        "checklist": ["Publish complete Behance/Dribbble case study", "Provide developer handoff specs"]
                    }
                ]
            },
            {
                "title": "Mobile App Developer",
                "slug": "mobile-app-developer",
                "category": "Mobile Engineering",
                "description": "Mobile App Developers build smooth, high-performing native and cross-platform smartphone applications for iOS and Android using frameworks like React Native or Flutter.",
                "difficulty": "Intermediate",
                "education_req": "Bachelor's in Computer Science, Mobile Development, or equivalent practical skills",
                "growth_outlook": "High Demand - 24% growth",
                "prerequisites": "Solid foundation in JavaScript, TypeScript, or Dart and mobile UX conventions.",
                "typical_responsibilities": [
                    "Build responsive cross-platform mobile interfaces.",
                    "Integrate REST APIs, real-time push notifications, and offline storage.",
                    "Optimize mobile device performance, battery usage, and memory footprints.",
                    "Manage app builds, signing certificates, and App Store / Play Store deployment."
                ],
                "example_projects": [
                    "Cross-Platform Fitness Tracking App with GPS & Health Kit",
                    "Social Food Delivery App with Live Driver Mapping",
                    "Offline-First Note Taking & Syncing App with SQLite"
                ],
                "required_skills": ["JavaScript", "React.js", "React Native", "Git / GitHub"],
                "preferred_skills": ["TypeScript", "REST APIs", "Flutter"],
                "soft_skills": ["Problem Solving", "Creativity", "Team Collaboration"],
                "roadmap_stages": [
                    {
                        "stage_number": 1,
                        "stage_title": "Mobile Foundations & React Native Basics",
                        "topics": ["Mobile UI Paradigms", "Core React Native Components (View, Text, FlatList)", "Flexbox for Mobile", "Expo Tooling"],
                        "skills_covered": ["React Native", "JavaScript"],
                        "practical_exercises": "Build responsive mobile layouts and customized scrollable lists.",
                        "mini_project": "Recipe Discovery App with search and smooth card animations.",
                        "capstone_project": "",
                        "checklist": ["Test on iOS and Android emulators", "Implement touch gestures"]
                    },
                    {
                        "stage_number": 2,
                        "stage_title": "Navigation & Device Features",
                        "topics": ["React Navigation (Stack, Tabs, Drawer)", "Camera & Photo Library Access", "Location & Geolocation APIs", "AsyncStorage & Local Caching"],
                        "skills_covered": ["React Native", "TypeScript"],
                        "practical_exercises": "Implement deep linking and nested bottom tab navigation.",
                        "mini_project": "Travel Explorer Mobile App with interactive maps and photo uploads.",
                        "capstone_project": "",
                        "checklist": ["Manage camera permissions", "Cache data for offline usage"]
                    },
                    {
                        "stage_number": 3,
                        "stage_title": "State Management, APIs & Push Notifications",
                        "topics": ["Global State with Context/Zustand", "Consuming REST APIs", "WebSockets in Mobile", "Push Notifications (Expo/FCM)"],
                        "skills_covered": ["React Native", "REST APIs"],
                        "practical_exercises": "Configure background notifications and real-time feed updates.",
                        "mini_project": "Real-Time Group Messenger with chat notifications.",
                        "capstone_project": "",
                        "checklist": ["Handle network disconnects gracefully", "Trigger background notifications"]
                    },
                    {
                        "stage_number": 4,
                        "stage_title": "Mobile App Store Capstone",
                        "topics": ["Performance Optimization (Re-render profiling)", "App Store & Play Store Guidelines", "Release Builds & Signing", "Crash Analytics"],
                        "skills_covered": ["React Native", "Git / GitHub"],
                        "practical_exercises": "Generate signed release APKs and configure crash monitoring.",
                        "mini_project": "",
                        "capstone_project": "Full-Featured Cross-Platform E-Commerce Mobile App with authentication, cart, and payment gateway integration.",
                        "checklist": ["Ensure 60 FPS scrolling performance", "Prepare store assets and screenshots"]
                    }
                ]
            },
            {
                "title": "Software Tester / QA Engineer",
                "slug": "software-tester-qa-engineer",
                "category": "Quality Assurance & Testing",
                "description": "Quality Assurance Engineers verify software stability, correctness, security, and performance. They construct automated test suites, conduct API validation, and ensure enterprise software meets quality standards.",
                "difficulty": "Beginner to Intermediate",
                "education_req": "Bachelor's in Computer Science, Software Engineering, or Information Systems",
                "growth_outlook": "Stable High - 18% expected industry need",
                "prerequisites": "Attention to detail, understanding of software lifecycles, and basic coding.",
                "typical_responsibilities": [
                    "Design comprehensive test plans, test matrices, and test cases.",
                    "Develop end-to-end automated UI test scripts using Selenium or Cypress.",
                    "Perform automated REST API testing and load validation.",
                    "Track, report, and verify defect resolution in issue tracking tools."
                ],
                "example_projects": [
                    "Automated End-to-End Regression Test Suite for E-Commerce Checkout",
                    "Automated API Performance & Security Testing Pipeline",
                    "Cross-Browser Compatibility Test Automation Matrix"
                ],
                "required_skills": ["Python", "Unit Testing & QA", "Selenium / Cypress", "Git / GitHub"],
                "preferred_skills": ["SQL / MySQL", "CI/CD Pipelines", "REST APIs"],
                "soft_skills": ["Critical Thinking", "Analytical Thinking", "Communication"],
                "roadmap_stages": [
                    {
                        "stage_number": 1,
                        "stage_title": "QA Principles & Manual Test Engineering",
                        "topics": ["Software Testing Life Cycle (STLC)", "Black Box & White Box Testing", "Boundary Value Analysis & Equivalence Partitioning", "Defect Life Cycle & Bug Reporting"],
                        "skills_covered": ["Unit Testing & QA"],
                        "practical_exercises": "Draft complete test plans and write test case matrices for complex forms.",
                        "mini_project": "Comprehensive Test Plan & Bug Report Suite for a Web Application.",
                        "capstone_project": "",
                        "checklist": ["Categorize bug severity vs priority", "Perform exploratory testing"]
                    },
                    {
                        "stage_number": 2,
                        "stage_title": "Automated Unit & Integration Testing",
                        "topics": ["Python Pytest Framework", "Assertions, Fixtures & Parametrization", "Mocking & Patching External Services", "Code Coverage Analysis"],
                        "skills_covered": ["Python", "Unit Testing & QA"],
                        "practical_exercises": "Write automated unit test suites achieving >85% code coverage.",
                        "mini_project": "Automated Test Suite for RESTful Authentication & Database APIs.",
                        "capstone_project": "",
                        "checklist": ["Write parameterized test cases", "Generate HTML coverage reports"]
                    },
                    {
                        "stage_number": 3,
                        "stage_title": "UI & End-to-End Automation (Selenium / Cypress)",
                        "topics": ["DOM Locators (XPath, CSS Selectors)", "Page Object Model (POM) Design Pattern", "Handling Waits & Asynchronous Elements", "Cross-Browser Automation"],
                        "skills_covered": ["Selenium / Cypress", "Python"],
                        "practical_exercises": "Implement Page Object Model for login and multi-step forms.",
                        "mini_project": "Automated End-to-End UI Regression Suite for Web Portal.",
                        "capstone_project": "",
                        "checklist": ["Eliminate flaky tests with explicit waits", "Capture failure screenshots"]
                    },
                    {
                        "stage_number": 4,
                        "stage_title": "API Testing, Performance & QA Capstone",
                        "topics": ["Automated API Testing (Postman/Requests)", "Load & Stress Testing (Locust)", "CI/CD Pipeline Test Automation", "Quality Metrics & Dashboards"],
                        "skills_covered": ["REST APIs", "CI/CD Pipelines", "Analytical Thinking"],
                        "practical_exercises": "Integrate test suites into GitHub Actions to block breaking commits.",
                        "mini_project": "",
                        "capstone_project": "Enterprise Test Automation Framework with E2E UI tests, REST API benchmarks, and automated CI/CD quality reports.",
                        "checklist": ["Run automated tests on pull requests", "Publish execution dashboards"]
                    }
                ]
            }
        ]

        career_objs = {}
        for cdata in careers_data:
            c = Career.query.filter_by(title=cdata['title']).first()
            if not c:
                c = Career(
                    title=cdata['title'],
                    slug=cdata['slug'],
                    category=cdata['category'],
                    description=cdata['description'],
                    difficulty=cdata['difficulty'],
                    education_req=cdata['education_req'],
                    growth_outlook=cdata['growth_outlook'],
                    prerequisites=cdata.get('prerequisites', ''),
                    typical_responsibilities=json.dumps(cdata.get('typical_responsibilities', [])),
                    example_projects=json.dumps(cdata.get('example_projects', []))
                )
                db.session.add(c)
                db.session.flush()

                # Add Career Skills
                for sk_name in cdata.get('required_skills', []):
                    sk = skill_objs.get(sk_name)
                    if sk:
                        cs = CareerSkill(career_id=c.id, skill_id=sk.id, skill_type='required', weight=1.0)
                        db.session.add(cs)

                for sk_name in cdata.get('preferred_skills', []):
                    sk = skill_objs.get(sk_name)
                    if sk:
                        cs = CareerSkill(career_id=c.id, skill_id=sk.id, skill_type='preferred', weight=0.7)
                        db.session.add(cs)

                for sk_name in cdata.get('soft_skills', []):
                    sk = skill_objs.get(sk_name)
                    if sk:
                        cs = CareerSkill(career_id=c.id, skill_id=sk.id, skill_type='soft', weight=0.5)
                        db.session.add(cs)

                # Add Roadmap
                roadmap = LearningRoadmap(
                    career_id=c.id,
                    title=f"{c.title} Comprehensive Career Roadmap",
                    description=f"Curated step-by-step progressive path to master the core competencies of a {c.title}."
                )
                db.session.add(roadmap)
                db.session.flush()

                for sdata in cdata.get('roadmap_stages', []):
                    rstep = RoadmapStep(
                        roadmap_id=roadmap.id,
                        stage_number=sdata['stage_number'],
                        stage_title=sdata['stage_title'],
                        topics=json.dumps(sdata.get('topics', [])),
                        skills_covered=json.dumps(sdata.get('skills_covered', [])),
                        practical_exercises=sdata.get('practical_exercises', ''),
                        mini_project=sdata.get('mini_project', ''),
                        capstone_project=sdata.get('capstone_project', ''),
                        checklist=json.dumps(sdata.get('checklist', []))
                    )
                    db.session.add(rstep)

            career_objs[c.title] = c

        # 5. Seed Real Verified Courses
        courses_data = [
            {
                "title": "CS50's Introduction to Computer Science",
                "provider": "Harvard University / edX",
                "description": "An introduction to the intellectual enterprises of computer science and the art of programming. Covers C, Python, SQL, HTML, CSS, JavaScript.",
                "category": "Computer Science",
                "difficulty": "Beginner",
                "duration": "12 weeks (6-18 hrs/week)",
                "course_url": "https://www.edx.org/learn/computer-science/harvard-university-cs50-s-introduction-to-computer-science",
                "is_free": True,
                "rating": 4.9,
                "career_titles": ["Full Stack Developer", "Backend Developer", "Software Tester / QA Engineer"]
            },
            {
                "title": "Full Stack Open: Modern Web Development",
                "provider": "University of Helsinki",
                "description": "Deep dive into modern web development with JavaScript, React, Redux, Node.js, Express, REST APIs, GraphQL, and TypeScript.",
                "category": "Web & Software Engineering",
                "difficulty": "Intermediate",
                "duration": "14 weeks (10 hrs/week)",
                "course_url": "https://fullstackopen.com/en/",
                "is_free": True,
                "rating": 4.9,
                "career_titles": ["Full Stack Developer", "Frontend Developer", "Backend Developer"]
            },
            {
                "title": "Meta Front-End Developer Professional Certificate",
                "provider": "Meta / Coursera",
                "description": "Comprehensive program covering HTML5, CSS3, modern JavaScript, React, UI/UX principles, and version control with Git.",
                "category": "Web & Software Engineering",
                "difficulty": "Beginner",
                "duration": "7 months (6 hrs/week)",
                "course_url": "https://www.coursera.org/professional-certificates/meta-front-end-developer",
                "is_free": False,
                "rating": 4.8,
                "career_titles": ["Frontend Developer", "Full Stack Developer", "UI/UX Designer"]
            },
            {
                "title": "Python for Everybody Specialization",
                "provider": "University of Michigan / Coursera",
                "description": "Learn to program and analyze data with Python. Develop programs to gather, clean, analyze, and visualize data.",
                "category": "Programming & Data",
                "difficulty": "Beginner",
                "duration": "8 months (3 hrs/week)",
                "course_url": "https://www.coursera.org/specializations/python",
                "is_free": False,
                "rating": 4.8,
                "career_titles": ["Backend Developer", "Data Analyst", "Data Scientist"]
            },
            {
                "title": "Machine Learning Specialization",
                "provider": "DeepLearning.AI / Stanford / Coursera",
                "description": "Foundational program by Andrew Ng covering supervised learning, neural networks, decision trees, and unsupervised learning algorithms.",
                "category": "Artificial Intelligence",
                "difficulty": "Intermediate",
                "duration": "3 months (10 hrs/week)",
                "course_url": "https://www.coursera.org/specializations/machine-learning-introduction",
                "is_free": False,
                "rating": 4.9,
                "career_titles": ["AI/ML Engineer", "Data Scientist"]
            },
            {
                "title": "Google Data Analytics Professional Certificate",
                "provider": "Google / Coursera",
                "description": "Gain in-demand skills in data cleaning, problem solving, critical thinking, data ethics, and data visualization using spreadsheets, SQL, and R/Python.",
                "category": "Data & Analytics",
                "difficulty": "Beginner",
                "duration": "6 months (10 hrs/week)",
                "course_url": "https://www.coursera.org/professional-certificates/google-data-analytics",
                "is_free": False,
                "rating": 4.8,
                "career_titles": ["Data Analyst", "Data Scientist"]
            },
            {
                "title": "Google Cybersecurity Professional Certificate",
                "provider": "Google / Coursera",
                "description": "Prepare for an entry-level cybersecurity role with hands-on practice in Linux, SQL, SIEM tools, network protocols, and Python security automation.",
                "category": "Security & Infrastructure",
                "difficulty": "Beginner",
                "duration": "6 months (7 hrs/week)",
                "course_url": "https://www.coursera.org/professional-certificates/google-cybersecurity",
                "is_free": False,
                "rating": 4.8,
                "career_titles": ["Cybersecurity Analyst"]
            },
            {
                "title": "AWS Cloud Solutions Architect Path",
                "provider": "Amazon Web Services / AWS Skill Builder",
                "description": "Official foundational and associate curriculum for cloud compute, networking, security, storage, and architectural best practices.",
                "category": "Cloud & DevOps",
                "difficulty": "Intermediate",
                "duration": "8 weeks (5 hrs/week)",
                "course_url": "https://explore.skillbuilder.aws/learn",
                "is_free": True,
                "rating": 4.7,
                "career_titles": ["Cloud Engineer", "DevOps Engineer"]
            },
            {
                "title": "Google UX Design Professional Certificate",
                "provider": "Google / Coursera",
                "description": "Foundations of UX design, empathizing with users, creating wireframes, low/high-fidelity prototypes in Figma, and usability studies.",
                "category": "Design & Product",
                "difficulty": "Beginner",
                "duration": "6 months (10 hrs/week)",
                "course_url": "https://www.coursera.org/professional-certificates/google-ux-design",
                "is_free": False,
                "rating": 4.8,
                "career_titles": ["UI/UX Designer", "Frontend Developer"]
            },
            {
                "title": "The Complete React Native + Hooks Course",
                "provider": "Stephen Grider / Udemy",
                "description": "Understand React Native with Hooks, Context, navigation, and build real-world iOS and Android mobile applications.",
                "category": "Mobile Engineering",
                "difficulty": "Intermediate",
                "duration": "38 hours on-demand",
                "course_url": "https://www.udemy.com/course/the-complete-react-native-and-redux-course/",
                "is_free": False,
                "rating": 4.7,
                "career_titles": ["Mobile App Developer", "Frontend Developer"]
            },
            {
                "title": "Automated Software Testing with Python",
                "provider": "Test Automation University",
                "description": "Comprehensive guide to writing unit tests, integration tests, mock objects, and web UI automated tests with Pytest and Selenium.",
                "category": "Quality Assurance & Testing",
                "difficulty": "Beginner",
                "duration": "4 weeks (4 hrs/week)",
                "course_url": "https://testautomationu.applitools.com/",
                "is_free": True,
                "rating": 4.9,
                "career_titles": ["Software Tester / QA Engineer", "Backend Developer"]
            },
            {
                "title": "Docker and Kubernetes: The Complete Guide",
                "provider": "Stephen Grider / Udemy",
                "description": "Build, test, and deploy Docker applications with Kubernetes while learning production CI/CD workflows and multi-container environments.",
                "category": "Cloud & DevOps",
                "difficulty": "Intermediate",
                "duration": "22 hours on-demand",
                "course_url": "https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/",
                "is_free": False,
                "rating": 4.8,
                "career_titles": ["DevOps Engineer", "Cloud Engineer", "Backend Developer"]
            },
{
        "title": "CS50's Web Programming with Python and JavaScript",
        "provider": "Harvard University / edX",
        "description": "Comprehensive full-stack course delving into Django, React, SQL, object-oriented design, security, scalability, and UX design principles.",
        "category": "Web & Software Engineering",
        "difficulty": "Intermediate",
        "duration": "12 weeks (6-9 hrs/week)",
        "course_url": "https://www.edx.org/learn/web-development/harvard-university-cs50-s-web-programming-with-python-and-javascript",
        "is_free": True,
        "rating": 4.9,
        "career_titles": ["Full Stack Developer", "Backend Developer", "Frontend Developer"]
    },
    {
        "title": "The Missing Semester of Your CS Education",
        "provider": "MIT (Massachusetts Institute of Technology)",
        "description": "Essential computer science practical tools: master the command line shell, vim, git version control, data wrangling, security, compilers, and profiling.",
        "category": "Computer Science",
        "difficulty": "Beginner",
        "duration": "4 weeks (4 hrs/week)",
        "course_url": "https://missing.csail.mit.edu/",
        "is_free": True,
        "rating": 4.9,
        "career_titles": ["Full Stack Developer", "DevOps Engineer", "Cloud Engineer", "Backend Developer", "Software Tester / QA Engineer"]
    },
    {
        "title": "MIT 6.0001: Introduction to Computer Science and Programming in Python",
        "provider": "MIT OpenCourseWare",
        "description": "Rigorous introduction to computational problem solving, data structures, algorithm complexity, testing, debugging, and dynamic programming.",
        "category": "Computer Science",
        "difficulty": "Beginner",
        "duration": "9 weeks (8-12 hrs/week)",
        "course_url": "https://ocw.mit.edu/courses/6-0001-introduction-to-computer-science-and-programming-in-python-fall-2016/",
        "is_free": True,
        "rating": 4.9,
        "career_titles": ["Backend Developer", "Data Scientist", "AI/ML Engineer"]
    },
    {
        "title": "Deep Learning Specialization",
        "provider": "DeepLearning.AI / Andrew Ng / Coursera",
        "description": "Master deep learning foundations: build neural networks from scratch in Python, tune hyperparameters, implement CNNs, RNNs, and Transformers.",
        "category": "Artificial Intelligence",
        "difficulty": "Advanced",
        "duration": "3 months (10 hrs/week)",
        "course_url": "https://www.coursera.org/specializations/deep-learning",
        "is_free": False,
        "rating": 4.9,
        "career_titles": ["AI/ML Engineer", "Data Scientist"]
    },
    {
        "title": "Generative AI with Large Language Models (LLMs)",
        "provider": "AWS & DeepLearning.AI / Coursera",
        "description": "Hands-on foundation model lifecycle: fine-tuning with PEFT/LoRA, Reinforcement Learning from Human Feedback (RLHF), and building RAG pipelines with LangChain.",
        "category": "Artificial Intelligence",
        "difficulty": "Intermediate",
        "duration": "3 weeks (8 hrs/week)",
        "course_url": "https://www.coursera.org/learn/generative-ai-with-llms",
        "is_free": False,
        "rating": 4.8,
        "career_titles": ["AI/ML Engineer", "Data Scientist", "Full Stack Developer"]
    },
    {
        "title": "Fast.ai: Practical Deep Learning for Coders",
        "provider": "Fast.ai / Jeremy Howard",
        "description": "Top-down approach to deep learning using PyTorch. Train state-of-the-art models for computer vision, natural language processing, and tabular data.",
        "category": "Artificial Intelligence",
        "difficulty": "Intermediate",
        "duration": "8 weeks (6 hrs/week)",
        "course_url": "https://course.fast.ai/",
        "is_free": True,
        "rating": 4.9,
        "career_titles": ["AI/ML Engineer", "Data Scientist"]
    },
    {
        "title": "Stanford CS229: Machine Learning Course",
        "provider": "Stanford Online / YouTube",
        "description": "Comprehensive mathematical and algorithmic treatment of machine learning, linear algebra foundations, support vector machines, and kernel methods.",
        "category": "Artificial Intelligence",
        "difficulty": "Advanced",
        "duration": "10 weeks (10 hrs/week)",
        "course_url": "https://see.stanford.edu/Course/CS229",
        "is_free": True,
        "rating": 4.9,
        "career_titles": ["AI/ML Engineer", "Data Scientist"]
    },
    {
        "title": "IBM Data Science Professional Certificate",
        "provider": "IBM / Coursera",
        "description": "Complete data science pathway covering Python, SQL, data analysis with Pandas & NumPy, visualization with Matplotlib & Seaborn, and machine learning pipelines.",
        "category": "Data & Analytics",
        "difficulty": "Beginner",
        "duration": "5 months (8 hrs/week)",
        "course_url": "https://www.coursera.org/professional-certificates/ibm-data-science",
        "is_free": False,
        "rating": 4.7,
        "career_titles": ["Data Scientist", "Data Analyst"]
    },
    {
        "title": "Data Analysis with Python Certification",
        "provider": "freeCodeCamp",
        "description": "Practical projects performing exploratory data analysis, reading real datasets, statistical calculations, and generating visual insights using Pandas & Seaborn.",
        "category": "Data & Analytics",
        "difficulty": "Intermediate",
        "duration": "6 weeks (5 hrs/week)",
        "course_url": "https://www.freecodecamp.org/learn/data-analysis-with-python/",
        "is_free": True,
        "rating": 4.8,
        "career_titles": ["Data Analyst", "Data Scientist"]
    },
    {
        "title": "SQL for Data Science & Business Intelligence",
        "provider": "UC Davis / Coursera",
        "description": "Master SQL query writing, filtering, aggregations, JOIN operations, subqueries, and window functions to solve complex business analytical problems.",
        "category": "Data & Analytics",
        "difficulty": "Beginner",
        "duration": "4 weeks (4 hrs/week)",
        "course_url": "https://www.coursera.org/learn/sql-for-data-science",
        "is_free": True,
        "rating": 4.8,
        "career_titles": ["Data Analyst", "Backend Developer", "Full Stack Developer"]
    },
    {
        "title": "Meta Back-End Developer Professional Certificate",
        "provider": "Meta / Coursera",
        "description": "Industry-standard backend training covering Python, Django REST framework, database architecture with MySQL, API design, version control, and cloud hosting.",
        "category": "Web & Software Engineering",
        "difficulty": "Beginner to Intermediate",
        "duration": "8 months (6 hrs/week)",
        "course_url": "https://www.coursera.org/professional-certificates/meta-back-end-developer",
        "is_free": False,
        "rating": 4.8,
        "career_titles": ["Backend Developer", "Full Stack Developer"]
    },
    {
        "title": "Spring Boot & Microservices Masterclass",
        "provider": "in28Minutes / Udemy",
        "description": "Enterprise backend architecture with Java, Spring Boot 3, RESTful APIs, Spring Security, JPA/Hibernate, Docker containers, and microservices patterns.",
        "category": "Web & Software Engineering",
        "difficulty": "Intermediate to Advanced",
        "duration": "32 hours on-demand",
        "course_url": "https://www.udemy.com/course/spring-boot-and-spring-framework-tutorial-for-beginners/",
        "is_free": False,
        "rating": 4.7,
        "career_titles": ["Backend Developer", "Cloud Engineer"]
    },
    {
        "title": "Modern JavaScript from Novice to Ninja",
        "provider": "The Net Ninja / YouTube",
        "description": "Complete modern JavaScript curriculum: ES6-ES2024 features, async/await, fetch API, promises, DOM manipulation, OOP classes, and modular project setup.",
        "category": "Web & Software Engineering",
        "difficulty": "Beginner to Intermediate",
        "duration": "18 hours on-demand",
        "course_url": "https://www.youtube.com/playlist?list=PL4cUxeGkcC9haFPT7J25Q9GRB_ZkFrQAc",
        "is_free": True,
        "rating": 4.9,
        "career_titles": ["Frontend Developer", "Full Stack Developer", "Mobile App Developer"]
    },
    {
        "title": "freeCodeCamp: Responsive Web Design Certification",
        "provider": "freeCodeCamp",
        "description": "Learn HTML5, CSS3, modern Flexbox, CSS Grid, media queries, accessibility, typography, and build 5 responsive project capstones.",
        "category": "Web & Software Engineering",
        "difficulty": "Beginner",
        "duration": "300 hours interactive",
        "course_url": "https://www.freecodecamp.org/learn/2022/responsive-web-design/",
        "is_free": True,
        "rating": 4.9,
        "career_titles": ["Frontend Developer", "UI/UX Designer", "Full Stack Developer"]
    },
    {
        "title": "Practical Ethical Hacking - The Complete Course",
        "provider": "TCM Security / Heath Adams",
        "description": "Hands-on cybersecurity and penetration testing: Linux foundations, networking, active directory exploitation, OWASP Top 10 vulnerabilities, and report writing.",
        "category": "Security & Infrastructure",
        "difficulty": "Intermediate",
        "duration": "25 hours hands-on",
        "course_url": "https://academy.tcm-sec.com/p/practical-ethical-hacking-the-complete-course",
        "is_free": False,
        "rating": 4.9,
        "career_titles": ["Cybersecurity Analyst"]
    },
    {
        "title": "TryHackMe: Complete Beginner Cybersecurity Path",
        "provider": "TryHackMe",
        "description": "Interactive cybersecurity labs covering security fundamentals, network scanning with Nmap, Wireshark packet capture, Burp Suite, and defensive monitoring.",
        "category": "Security & Infrastructure",
        "difficulty": "Beginner",
        "duration": "8 weeks (6 hrs/week)",
        "course_url": "https://tryhackme.com/path/outline/beginner",
        "is_free": True,
        "rating": 4.9,
        "career_titles": ["Cybersecurity Analyst"]
    },
    {
        "title": "CompTIA Security+ (SY0-701) Prep Course",
        "provider": "Professor Messer / YouTube",
        "description": "Industry-standard certification training covering security architecture, cryptography, identity & access management, risk mitigation, and threat analysis.",
        "category": "Security & Infrastructure",
        "difficulty": "Beginner to Intermediate",
        "duration": "6 weeks (5 hrs/week)",
        "course_url": "https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/",
        "is_free": True,
        "rating": 4.9,
        "career_titles": ["Cybersecurity Analyst", "Cloud Engineer"]
    },
    {
        "title": "Google Cloud Certified Associate Cloud Engineer",
        "provider": "Google Cloud Skills Boost / Coursera",
        "description": "Deploy, monitor, and maintain solutions on Google Cloud Platform: Compute Engine VMs, Google Kubernetes Engine (GKE), Cloud Storage, IAM, and BigQuery.",
        "category": "Cloud & DevOps",
        "difficulty": "Intermediate",
        "duration": "2 months (8 hrs/week)",
        "course_url": "https://www.coursera.org/professional-certificates/google-cloud-associate-cloud-engineer",
        "is_free": False,
        "rating": 4.8,
        "career_titles": ["Cloud Engineer", "DevOps Engineer"]
    },
    {
        "title": "HashiCorp Certified: Terraform Associate Hands-On",
        "provider": "freeCodeCamp / Anton Putra",
        "description": "Master Infrastructure as Code (IaC) with HashiCorp Terraform: write clean HCL configurations, manage state files, build modules, and provision AWS resources.",
        "category": "Cloud & DevOps",
        "difficulty": "Intermediate",
        "duration": "11 hours on-demand",
        "course_url": "https://www.youtube.com/watch?v=V4wakeLKWD4",
        "is_free": True,
        "rating": 4.8,
        "career_titles": ["DevOps Engineer", "Cloud Engineer"]
    },
    {
        "title": "Kubernetes for Beginners (CKAD/CKA Foundation)",
        "provider": "KodeKloud / Mumshad Mannambeth",
        "description": "Learn Kubernetes container orchestration step-by-step: Pods, ReplicaSets, Deployments, Services, ConfigMaps, Secrets, Ingress, and persistent volumes.",
        "category": "Cloud & DevOps",
        "difficulty": "Intermediate",
        "duration": "15 hours hands-on labs",
        "course_url": "https://kodekloud.com/courses/kubernetes-for-the-absolute-beginners-hands-on/",
        "is_free": False,
        "rating": 4.9,
        "career_titles": ["DevOps Engineer", "Cloud Engineer"]
    },
    {
        "title": "Figma UI/UX Essentials Masterclass",
        "provider": "Daniel Walter Scott / Bring Your Own Laptop",
        "description": "Complete hands-on Figma guide: responsive auto-layout, atomic design systems, interactive micro-animations, clickable prototypes, and developer handoff.",
        "category": "Design & Product",
        "difficulty": "Beginner",
        "duration": "12 hours on-demand",
        "course_url": "https://www.youtube.com/watch?v=FTFaQWZBqQ8",
        "is_free": True,
        "rating": 4.8,
        "career_titles": ["UI/UX Designer", "Frontend Developer"]
    },
    {
        "title": "UI Design Bootcamp: From Principles to Design Systems",
        "provider": "Scrimba / Gary Simon",
        "description": "Master visual design principles: typographic scale, high-contrast color palettes, spatial rhythm, accessible UI components, and component library creation.",
        "category": "Design & Product",
        "difficulty": "Intermediate",
        "duration": "6 weeks (6 hrs/week)",
        "course_url": "https://scrimba.com/learn/uidesign",
        "is_free": False,
        "rating": 4.9,
        "career_titles": ["UI/UX Designer", "Frontend Developer"]
    },
    {
        "title": "Flutter & Dart - The Complete Guide",
        "provider": "Academind / Maximilian Schwarzmüller",
        "description": "Build high-performance native iOS and Android apps using Flutter and Dart. Covers widget trees, state management with Riverpod, HTTP APIs, and local device storage.",
        "category": "Mobile Engineering",
        "difficulty": "Beginner to Intermediate",
        "duration": "30 hours on-demand",
        "course_url": "https://academind.com/courses/flutter-dart",
        "is_free": False,
        "rating": 4.8,
        "career_titles": ["Mobile App Developer"]
    },
    {
        "title": "Android Basics in Compose",
        "provider": "Google Developers Training",
        "description": "Official Google curriculum for modern native Android development using Kotlin, Jetpack Compose UI toolkit, Material Design 3, and Coroutines.",
        "category": "Mobile Engineering",
        "difficulty": "Beginner",
        "duration": "8 weeks (5 hrs/week)",
        "course_url": "https://developer.android.com/courses/android-basics-compose/course",
        "is_free": True,
        "rating": 4.9,
        "career_titles": ["Mobile App Developer"]
    },
    {
        "title": "iOS 17 & SwiftUI App Development Bootcamp",
        "provider": "The App Brewery / Angela Yu",
        "description": "Complete iOS development bootcamp: Swift syntax, declarative SwiftUI layouts, MVVM architecture, CoreData persistence, and App Store submission guidelines.",
        "category": "Mobile Engineering",
        "difficulty": "Beginner to Intermediate",
        "duration": "40 hours on-demand",
        "course_url": "https://www.appbrewery.co/p/ios-13-app-development-bootcamp",
        "is_free": False,
        "rating": 4.9,
        "career_titles": ["Mobile App Developer"]
    },
    {
        "title": "Playwright Modern Web Test Automation",
        "provider": "freeCodeCamp / Automation Panda",
        "description": "Modern end-to-end testing with Microsoft Playwright: multi-browser testing (Chromium, Firefox, WebKit), network mocking, visual regression, and GitHub Actions CI.",
        "category": "Quality Assurance & Testing",
        "difficulty": "Intermediate",
        "duration": "8 hours hands-on",
        "course_url": "https://www.youtube.com/watch?v=3sWKn0yvX7c",
        "is_free": True,
        "rating": 4.9,
        "career_titles": ["Software Tester / QA Engineer", "Frontend Developer"]
    },
    {
        "title": "API Testing with Postman & Newman for CI/CD",
        "provider": "Valentin Despa / Udemy",
        "description": "Automated REST API testing: writing JavaScript test scripts in Postman collections, parameterization, environment variables, and Newman CI/CD integration.",
        "category": "Quality Assurance & Testing",
        "difficulty": "Beginner to Intermediate",
        "duration": "14 hours on-demand",
        "course_url": "https://www.udemy.com/course/postman-the-complete-guide/",
        "is_free": False,
        "rating": 4.8,
        "career_titles": ["Software Tester / QA Engineer", "Backend Developer"]
    },
    {
        "title": "Database Systems & Advanced PostgreSQL Architecture",
        "provider": "Carnegie Mellon University (CMU 15-445/645) / Andy Pavlo",
        "description": "In-depth computer science course on relational database internal design: buffer pool management, B+ trees, query planning, concurrency control, and ACID recovery.",
        "category": "Computer Science",
        "difficulty": "Advanced",
        "duration": "14 weeks (10 hrs/week)",
        "course_url": "https://15445.courses.cs.cmu.edu/",
        "is_free": True,
        "rating": 5.0,
        "career_titles": ["Backend Developer", "Data Scientist", "Cloud Engineer"]
    }
        ]

        for crs in courses_data:
            c = Course.query.filter_by(title=crs['title']).first()
            if not c:
                c = Course(
                    title=crs['title'],
                    provider=crs['provider'],
                    description=crs['description'],
                    category=crs['category'],
                    difficulty=crs['difficulty'],
                    duration=crs['duration'],
                    course_url=crs['course_url'],
                    is_free=crs['is_free'],
                    rating=crs['rating']
                )
                db.session.add(c)
                db.session.flush()

                for ct in crs.get('career_titles', []):
                    car = career_objs.get(ct)
                    if car:
                        cc = CareerCourse(career_id=car.id, course_id=c.id)
                        db.session.add(cc)

        # 6. Seed Meaningful Assessment Questions across 8 sections
        questions_seed = [
            # Technical Skills Section
            {
                "section": "technical",
                "order_num": 1,
                "question_text": "When building an interactive software feature, which aspect do you find most intellectually engaging?",
                "options": [
                    ("Writing server-side algorithms, database queries, and REST APIs", 1.0, "backend,database,architecture"),
                    ("Designing pixel-perfect, accessible user interfaces with reactive state", 0.9, "frontend,ui,react"),
                    ("Analyzing mathematical data trends, training models, and statistics", 1.0, "data_science,machine_learning"),
                    ("Investigating network traffic packets, system configurations, and firewalls", 1.0, "security,linux,networking")
                ]
            },
            {
                "section": "technical",
                "order_num": 2,
                "question_text": "What is your comfort level with programming and writing code in languages such as Python, JavaScript, C++, or Java?",
                "options": [
                    ("Proficient: I build full applications, connect APIs, and debug efficiently", 1.0, "fullstack,backend,frontend"),
                    ("Intermediate: I write functioning scripts and solve core algorithmic problems", 0.8, "intermediate_coder"),
                    ("Beginner: I understand syntax and control flows, but still learning frameworks", 0.6, "beginner_coder"),
                    ("Design/Product-oriented: I prefer visual prototyping tools like Figma over deep code", 0.5, "ui_designer,product")
                ]
            },
            # Logical Reasoning Section
            {
                "section": "logical",
                "order_num": 3,
                "question_text": "If a critical production service slows down unexpectedly during peak traffic, what is your initial instinct?",
                "options": [
                    ("Inspect execution logs, database query plans, and server CPU/memory bottlenecks", 1.0, "backend,devops,sysadmin"),
                    ("Trace network latency packets and verify DDoS or security firewall anomalies", 1.0, "security,networking"),
                    ("Evaluate data input distributions to check for anomalous customer payloads", 0.9, "data_analysis,algorithms"),
                    ("Verify if client-side asset sizes and frontend network requests are blocking the UI thread", 0.85, "frontend,performance")
                ]
            },
            {
                "section": "logical",
                "order_num": 4,
                "question_text": "You are given a complex dataset with missing values and skewed categories. How would you approach it?",
                "options": [
                    ("Perform exploratory statistical distribution analysis and impute data systematically", 1.0, "data_science,analytics"),
                    ("Write a normalized database migration with foreign keys and validation constraints", 0.9, "database,backend"),
                    ("Write a series of automated unit tests to assert data boundaries and edge cases", 0.85, "qa,testing"),
                    ("Construct an interactive visualization to help business stakeholders spot patterns", 0.85, "analytics,frontend")
                ]
            },
            # Communication Skills Section
            {
                "section": "communication",
                "order_num": 5,
                "question_text": "How do you prefer communicating complex technical trade-offs to non-technical stakeholders?",
                "options": [
                    ("Using intuitive visual flowcharts, interactive prototypes, and plain-language metaphors", 1.0, "communication,design"),
                    ("Presenting clear executive metric dashboards highlighting business ROI and impact", 0.95, "analytics,leadership"),
                    ("Writing thorough architectural documentation with clear pros, cons, and alternatives", 0.9, "backend,system_design"),
                    ("Providing concise status briefings with risk mitigation milestones", 0.85, "project_management,agile")
                ]
            },
            # Problem-Solving Section
            {
                "section": "problem_solving",
                "order_num": 6,
                "question_text": "When encountering a stubborn, obscure software bug with no obvious error message, how do you proceed?",
                "options": [
                    ("Formulate hypotheses, isolate minimal reproducible test cases, and use a step debugger", 1.0, "debugging,problem_solving"),
                    ("Analyze telemetry logs and simulate edge-case inputs across isolated modules", 0.95, "qa,backend"),
                    ("Refactor the suspected module into pure, independently testable functions", 0.9, "architecture,code_quality"),
                    ("Consult official documentation, RFC specifications, and peer developer forums", 0.85, "collaboration,research")
                ]
            },
            # Creativity Section
            {
                "section": "creativity",
                "order_num": 7,
                "question_text": "How important is visual aesthetics, typography, color balance, and delightful user micro-interactions to you?",
                "options": [
                    ("Critical: I love crafting beautiful, responsive experiences that delight end users", 1.0, "ui_ux,frontend"),
                    ("Important: I appreciate good design and enjoy connecting beautiful UIs with APIs", 0.85, "frontend,fullstack"),
                    ("Secondary: I focus primarily on computational efficiency, data integrity, and throughput", 0.6, "backend,data_science"),
                    ("Minimal: I am happiest in Linux terminals, CLI tools, and infrastructure code", 0.5, "devops,cloud,security")
                ]
            },
            # Work Preferences Section
            {
                "section": "work_preferences",
                "order_num": 8,
                "question_text": "Which day-to-day project artifact would give you the greatest sense of professional accomplishment?",
                "options": [
                    ("A live SaaS web application used by thousands of daily active users", 1.0, "fullstack,frontend"),
                    ("A predictive machine learning model that automates complex forecasting accurately", 1.0, "data_science,ai"),
                    ("An impenetrable cloud infrastructure deployment that achieves 99.99% uptime", 1.0, "cloud,devops,security"),
                    ("A sleek mobile app rated 4.9 stars on the App Store for its intuitive UX", 1.0, "mobile,ui_ux")
                ]
            },
            # Preferred Work Environment Section
            {
                "section": "work_env",
                "order_num": 9,
                "question_text": "What type of team work cadence and development environment excites you most?",
                "options": [
                    ("Fast-paced agile product sprint delivering weekly features directly to users", 1.0, "agile,startup,product"),
                    ("Deep-focus research environment testing algorithmic theories and large datasets", 0.95, "research,data_science"),
                    ("Mission-critical enterprise setting where security, stability, and zero bugs are paramount", 0.9, "enterprise,security,qa"),
                    ("Collaborative design studio iterating rapidly on wireframes and interactive feedback", 0.9, "design,ui_ux")
                ]
            },
            # Education & Experience Section
            {
                "section": "education_exp",
                "order_num": 10,
                "question_text": "What best describes your current education level and software project portfolio status?",
                "options": [
                    ("Computer Science / IT undergraduate or graduate with multiple finished GitHub projects", 1.0, "experienced_student"),
                    ("Engineering / Science student actively learning web frameworks and algorithms", 0.85, "growing_student"),
                    ("Self-taught developer or bootcamp graduate building a hands-on project portfolio", 0.85, "self_taught"),
                    ("High school or beginning college student exploring career pathways in technology", 0.7, "early_explorer")
                ]
            }
        ]

        for qdata in questions_seed:
            existing_q = AssessmentQuestion.query.filter_by(question_text=qdata['question_text']).first()
            if not existing_q:
                q = AssessmentQuestion(
                    section=qdata['section'],
                    order_num=qdata['order_num'],
                    question_text=qdata['question_text']
                )
                db.session.add(q)
                db.session.flush()

                for opt_text, opt_weight, opt_tags in qdata['options']:
                    opt = AssessmentOption(
                        question_id=q.id,
                        option_text=opt_text,
                        score_weight=opt_weight,
                        trait_tags=opt_tags
                    )
                    db.session.add(opt)

        db.session.commit()
        print("Database successfully seeded with careers, roadmaps, verified courses, skills, and assessment questions!")

if __name__ == '__main__':
    seed_database()
