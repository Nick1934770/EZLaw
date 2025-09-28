#!/bin/bash
# Quick setup script for Gemini API key

echo "🤖 EZLaw Chatbot - Gemini API Setup"
echo "===================================="
echo ""

# Check if API key is already set
if [ ! -z "$GEMINI_API_KEY" ]; then
    echo "✅ GEMINI_API_KEY is already set: ${GEMINI_API_KEY:0:10}..."
    echo "🧪 Testing API key..."
    python3 test_gemini.py
    exit $?
fi

echo "📋 To get your Gemini API key:"
echo "1. Visit: https://ai.google.dev/gemini-api/docs/api-key"
echo "2. Sign in with your Google account"
echo "3. Click 'Create API Key'"
echo "4. Copy the generated API key"
echo ""
echo "🔑 Then run this command with your actual API key:"
echo "   export GEMINI_API_KEY=\"your_actual_api_key_here\""
echo ""
echo "🔄 To make it permanent:"
echo "   echo 'export GEMINI_API_KEY=\"your_actual_api_key_here\"' >> ~/.zshrc"
echo "   source ~/.zshrc"
echo ""
echo "🧪 Test your setup with: python3 test_gemini.py"
echo "🚀 Start the app with: python3 run.py"
