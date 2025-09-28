#!/usr/bin/env python3
"""
Test Gemini API Key
Run this script to test if your GEMINI_API_KEY is working correctly.
"""

import os
import sys

def test_gemini_api():
    print("🧪 Testing Gemini API Key...")
    
    # Check if API key is set
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        print("❌ GEMINI_API_KEY environment variable is not set!")
        print("Please set it first:")
        print("export GEMINI_API_KEY=\"your_api_key_here\"")
        return False
    
    print(f"✅ API key found: {api_key[:10]}...")
    
    try:
        import google.generativeai as genai
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-pro')
        
        print("🔄 Testing API connection...")
        response = model.generate_content("Hello! Please respond with 'API test successful'.")
        
        print("✅ API test successful!")
        print(f"🤖 Bot response: {response.text}")
        return True
        
    except ImportError:
        print("❌ google-generativeai package not installed!")
        print("Run: pip3 install google-generativeai --break-system-packages")
        return False
    except Exception as e:
        print(f"❌ API test failed: {str(e)}")
        print("Please check your API key and try again.")
        return False

if __name__ == '__main__':
    success = test_gemini_api()
    if success:
        print("\n🎉 Your Gemini API is ready!")
        print("🚀 You can now start the EZLaw app with: python3 run.py")
    else:
        print("\n❌ Please fix the issues above before starting the app.")
    sys.exit(0 if success else 1)
