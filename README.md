# EZLaw Analyzer

A comprehensive legal analysis web application that uses AI to help users understand legal situations and find relevant laws.

## Features

### 🔍 **Legal Analysis**
- **AI-Powered Search**: Enter your legal situation and get AI analysis
- **Bill Identification**: Automatically identifies relevant congressional bills
- **Legal Insights**: Get detailed legal analysis and recommendations

### 📋 **Law Documents**
- **Congress API Integration**: Fetches detailed information from Congress.gov
- **Bill Details**: View comprehensive bill information including:
  - Bill title, number, type, and congress session
  - Introduction date and latest actions
  - Policy area and sponsor information
  - Full text content of bills
- **Text Content Display**: Read actual bill text with proper formatting

### 🎯 **User Experience**
- **Simple Interface**: Clean, intuitive design for easy navigation
- **Responsive Design**: Works perfectly on desktop and mobile
- **Real-time Processing**: Fast AI analysis and law retrieval
- **Professional Styling**: Modern UI with legal document aesthetics

## How to Use

### Installation

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Start the application:**
   ```bash
   python app.py
   ```

3. **Open your browser and go to:** `http://127.0.0.1:3003`

### Using the Application

1. **Enter Your Legal Situation:**
   - Type your legal question or situation in the search bar
   - Click "Analyze Situation" or press Enter

2. **Review AI Analysis:**
   - View the identified relevant bills
   - Read the detailed legal analysis
   - Get practical recommendations

3. **Explore Law Documents:**
   - Click "View Law Documents" to see full bill details
   - Read the complete text of relevant laws
   - Access additional information on Congress.gov

## Project Structure

```
EZLaw-1/
├── app.py                    # Main Flask application
├── requirements.txt          # Python dependencies
├── templates/
│   ├── index.html           # Main search page
│   ├── results.html         # Analysis results page
│   ├── laws.html           # Law documents page
│   └── chat.html           # Chat interface (if needed)
├── static/
│   ├── css/
│   │   └── styles.css      # Application styling
│   └── js/
│       └── script.js       # Frontend functionality
└── README.md               # This documentation
```

## Technical Features

### **Backend (Flask)**
- **AI Integration**: Gemini API for legal analysis
- **Congress API**: Real-time law data from Congress.gov
- **RESTful API**: Clean endpoints for frontend communication
- **Error Handling**: Comprehensive error management

### **Frontend (HTML/CSS/JavaScript)**
- **Interactive UI**: Dynamic content loading and user interactions
- **API Communication**: Seamless backend integration
- **Responsive Design**: Mobile-first approach
- **Modern Styling**: Professional legal document aesthetics

### **APIs Used**
- **Google Gemini API**: AI-powered legal analysis
- **Congress.gov API**: Official congressional data
- **LegiScan API**: Additional legal data sources

## Key Endpoints

- **`/`** - Main search interface
- **`/results`** - Analysis results with legal insights
- **`/laws`** - Detailed law documents and text
- **`/api/chatbot`** - AI analysis endpoint
- **`/api/legal-analysis`** - Detailed legal analysis
- **`/api/law-details`** - Congress API integration

## Dependencies

- **Flask 3.0.0** - Web framework
- **requests 2.31.0** - HTTP client for API calls
- **google-genai 0.3.0** - Google AI integration

## Browser Support

Works in all modern browsers that support:
- ES6+ JavaScript features
- Fetch API
- CSS Grid/Flexbox
- File API (for future features)

## Development

To run in development mode:
```bash
python app.py
```

The server will start on `http://127.0.0.1:3003` with debug mode enabled.

## Features Overview

### 🔍 **Search & Analysis**
- Enter legal situations in natural language
- Get AI-powered analysis and bill identification
- Receive practical legal recommendations

### 📄 **Law Documents**
- View complete bill text and details
- Access official congressional information
- Read legislative history and actions

### 🎨 **User Interface**
- Clean, professional design
- Mobile-responsive layout
- Intuitive navigation flow

### ⚡ **Performance**
- Fast AI processing
- Efficient API integration
- Optimized for speed and reliability

## Getting Started

1. **Clone the repository**
2. **Install dependencies**: `pip install -r requirements.txt`
3. **Run the application**: `python app.py`
4. **Open browser**: Navigate to `http://127.0.0.1:3003`
5. **Start analyzing**: Enter your legal situation and get AI-powered insights!

---

**EZLaw Analyzer** - Making legal analysis accessible and intelligent.
