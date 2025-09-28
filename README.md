# Flask JSON Viewer Web App

A simple Flask web application for viewing JSON files with syntax highlighting and interactive features.

## Features

- **Flask Backend**: Simple Python Flask server to serve the web app
- **File Upload**: Click to select or drag & drop JSON files
- **Client-side Processing**: JSON validation and processing handled in the browser
- **Syntax Highlighting**: Beautiful color-coded JSON display
- **Sample Data**: Load built-in sample JSON data
- **Copy to Clipboard**: Copy formatted JSON with one click
- **Download**: Save the current JSON to your device
- **Responsive Design**: Works on desktop and mobile devices
- **Error Handling**: Clear error messages for invalid JSON

## How to Use

### Installation

1. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Start the Flask server:
   ```bash
   python run.py
   ```
   or
   ```bash
   python app.py
   ```

3. Open your browser and go to: `http://127.0.0.1:3000`

### Using the App

1. Upload JSON files by:
   - Clicking "Choose JSON File" to select a file
   - Dragging and dropping a JSON file onto the page
   - Clicking "Load Sample JSON" to see the viewer in action

2. View your JSON with beautiful syntax highlighting

3. Use the controls to:
   - **Copy**: Copy formatted JSON to clipboard
   - **Download**: Save JSON to your device
   - **Clear**: Reset the viewer

## Project Structure

```
EZLaw/
├── app.py              # Simple Flask application
├── run.py              # Development server runner
├── requirements.txt    # Python dependencies
├── templates/
│   └── index.html     # Flask HTML template
├── static/
│   ├── css/
│   │   └── styles.css # CSS styling
│   └── js/
│       └── script.js  # Client-side JavaScript functionality
├── text.json         # Sample JSON file
└── README.md         # This documentation
```

## Technical Features

- **Flask Framework**: Simple Python web framework for serving static files
- **Client-side Processing**: All JSON handling done in the browser
- **File Reading**: Uses FileReader API for local file processing
- **Error Handling**: Client-side error validation and user feedback
- **No Server Dependencies**: All processing happens in the browser

## Browser Support

Works in all modern browsers that support:
- File API
- Clipboard API
- CSS Grid/Flexbox
- ES6 Classes

## Development

To run in development mode with auto-reload:
```bash
python run.py
```

The server will start on `http://127.0.0.1:3000` with debug mode enabled.
