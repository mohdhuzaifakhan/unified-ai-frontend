# Unified AI Platform

A comprehensive, enterprise-grade platform for building, managing, and observing Retrieval-Augmented Generation (RAG) applications. This platform provides a unified interface for data ingestion, model configuration, pipeline management, and real-time observability, enabling developers and enterprises to deploy robust AI solutions efficiently.

## 🚀 Key Features

### 1. Dashboard & Overview
The central hub of the platform, providing a high-level overview of your AI ecosystem. Monitor system health, recent activities, and key metrics at a glance.

![Dashboard](rag%20assets/dashboard.png)

### 2. Project Management
Organize your work into distinct projects. Create, manage, and switch between multiple isolated environments, ensuring that data and configurations are kept separate for different use cases or clients.

| All Projects | Empty State |
|:---:|:---:|
| ![Projects Page](rag%20assets/project%20page%20with%20all%20projects.png) | ![Empty Projects](rag%20assets/projects%20page%20with%20empty%20project.png) |

### 3. Data Sources & Connectivity
Seamlessly connect your data to the platform. We support a wide range of input methods including:
*   **File Uploads**: Drag & drop support for PDF, DOCX, and TXT files.
*   **API Connectors**: Configure custom API endpoints for dynamic data ingestion.
*   **Cloud Storage**: Integrations for Google Drive and Amazon S3 (coming soon).

![Data Sources](rag%20assets/data%20source%20page.png)

### 4. Advanced Ingestion Pipeline
Take full control over how your data is processed. Configure every step of the RAG pipeline:
*   **Chunking Strategy**: Customize chunk size and overlap to optimize retrieval.
*   **Embedding Models**: Select from various embedding models (e.g., all-MiniLM-L6-v2) to suit your accuracy/performance needs.
*   **Vector Store**: Choose your preferred vector database (MongoDB, Milvus, etc.).
*   **Pipeline Execution**: Run and monitor long-running ingestion tasks with real-time logs.

![Ingestion Pipeline](rag%20assets/ingestion%20pipeline%20page.png)
![Running Pipeline](rag%20assets/running%20pipeline%20modal.png)

### 5. Model Configuration (LLMs)
Fine-tune the intelligence behind your applications.
*   **Model Selection**: Choose from top-tier models like **Gemini 2.5 Pro**, **GPT-4o**, and **Claude 3.5 Sonnet**.
*   **Parameter Tuning**: Adjust temperature, max tokens, and provide custom system prompts to shape the AI's persona and expertise.
*   **Security**: securely manage provider API keys.

![Model Configuration](rag%20assets/model%20configuration%20page.png)
![Embedding Selection](rag%20assets/embedding%20selection%20page.png)

### 6. RAG Observability
Gain deep insights into your system's performance. Track retrieval quality, generation latency, and system resource usage with interactive charts and logs.

![RAG Observability](rag%20assets/rag%20observability%20page.png)
![Observability Details](rag%20assets/observability%20second%20page.png)

### 7. Interactive Integration & Chat
Test your RAG pipelines immediately with the built-in chat interface. Interact with your agents, verify retrieval accuracy, and debunk hallucinations in real-time.

![Integration Chat](rag%20assets/integration%20page%20with%20chats.png)

### 8. Security & Access Control
Enterprise-grade security features to protect your data and endpoints.
*   **API Key Management**: Generate and revoke API keys with granular/domain-level permissions.
*   **IP Whitelisting**: Restrict access to specific IP ranges.
*   **PII Detection**: Automatically detect and redact sensitive information (emails, credit cards) from your documents.

![Security & API Keys](rag%20assets/api%20key%20page.png)

### 9. Documentation & Resources
Integrated documentation ensures you have all the guides and API references you need right within the platform.

![Documentation](rag%20assets/docs%20page.png)

### 10. Authentication
Secure and modern authentication flow including Login, Signup, and Password Recovery.

| Login | Signup |
|:---:|:---:|
| ![Login Page](rag%20assets/login%20page.png) | ![Signup Page](rag%20assets/signup%20page.png) |

---

## 🛠️ Tech Stack

This project is built with a modern, high-performance stack:

*   **Frontend**: [React 19](https://react.dev/)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
*   **Animations**: [Framer Motion](https://www.framer.com/motion/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Charts**: [Recharts](https://recharts.org/)
*   **Routing**: [React Router DOM](https://reactrouter.com/)

## 📦 Getting Started

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/unified-ai-platform.git
    cd unified-ai-platform
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Start the development server**
    ```bash
    npm run dev
    ```

4.  **Build for production**
    ```bash
    npm run build
    ```

---

## 💎 Pricing Plans
Flexible pricing tiers to scale with your usage.

![Pricing](rag%20assets/price%20page.png)
