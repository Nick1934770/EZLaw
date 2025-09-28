#!/usr/bin/env python3
"""
Flask JSON Viewer - Run Script
Simple script to start the Flask development server
"""

from app import app

if __name__ == '__main__':
    print("🚀 Starting Flask JSON Viewer...")
    print("📱 Open your browser and go to: http://127.0.0.1:3000")
    print("🔄 Press Ctrl+C to stop the server")
    print("-" * 50)
    
    app.run(
        debug=True,
        host='127.0.0.1',
        port=3000,
        use_reloader=True
    )
