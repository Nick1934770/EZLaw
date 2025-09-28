#!/usr/bin/env python3
"""
Gemini API Key Setup Helper
This script helps you configure your Gemini API key for the EZLaw chatbot.
"""

import os
import webbrowser
import sys

def main():
    print("🤖 Gemini API Key Setup for EZLaw Chatbot")
    print("=" * 50)
    
    # Check if API key is already set
    existing_key = os.getenv('GEMINI_API_KEY')
    if existing_key:
        print(f"✅ GEMINI_API_KEY is already set: {existing_key[:10]}...")
        choice = input("Do you want to update it? (y/n): ").lower().strip()
        if choice != 'y':
            print("Keeping existing API key.")
            return
    
    print("\n📋 Steps to get your Gemini API key:")
    print("1. Visit: https://ai.google.dev/gemini-api/docs/api-key")
    print("2. Sign in with your Google account")
    print("3. Click 'Create API Key'")
    print("4. Copy the generated API key")
    
    # Ask if user wants to open the URL
    open_url = input("\n🌐 Open the Gemini API key page in your browser? (y/n): ").lower().strip()
    if open_url == 'y':
        webbrowser.open('https://ai.google.dev/gemini-api/docs/api-key')
    
    print("\n" + "=" * 50)
    api_key = input("🔑 Paste your Gemini API key here: ").strip()
    
    if not api_key:
        print("❌ No API key provided. Exiting.")
        return
    
    # Validate API key format (basic check)
    if not api_key.startswith('AIza'):
        print("⚠️  Warning: API key doesn't start with 'AIza'. Please verify it's correct.")
        confirm = input("Continue anyway? (y/n): ").lower().strip()
        if confirm != 'y':
            return
    
    # Set the environment variable for current session
    os.environ['GEMINI_API_KEY'] = api_key
    
    # Add to .zshrc file
    zshrc_path = os.path.expanduser('~/.zshrc')
    
    # Read existing .zshrc content
    existing_content = ""
    if os.path.exists(zshrc_path):
        with open(zshrc_path, 'r') as f:
            existing_content = f.read()
    
    # Check if GEMINI_API_KEY is already in .zshrc
    if 'GEMINI_API_KEY' in existing_content:
        print("🔄 Updating existing GEMINI_API_KEY in .zshrc...")
        lines = existing_content.split('\n')
        updated_lines = []
        for line in lines:
            if line.startswith('export GEMINI_API_KEY='):
                updated_lines.append(f'export GEMINI_API_KEY="{api_key}"')
            else:
                updated_lines.append(line)
        updated_content = '\n'.join(updated_lines)
    else:
        print("➕ Adding GEMINI_API_KEY to .zshrc...")
        updated_content = existing_content + f'\n# Gemini API Key for EZLaw Chatbot\nexport GEMINI_API_KEY="{api_key}"\n'
    
    # Write updated content to .zshrc
    with open(zshrc_path, 'w') as f:
        f.write(updated_content)
    
    print("✅ API key configured successfully!")
    print(f"📁 Added to: {zshrc_path}")
    print("\n🔄 To apply changes to current terminal session:")
    print("   source ~/.zshrc")
    print("\n🚀 To start the EZLaw app with chatbot:")
    print("   python3 run.py")
    
    # Test the API key
    print("\n🧪 Testing API key...")
    try:
        import google.generativeai as genai
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content("Hello, this is a test message.")
        print("✅ API key test successful!")
        print(f"🤖 Bot response: {response.text[:100]}...")
    except Exception as e:
        print(f"❌ API key test failed: {str(e)}")
        print("Please check your API key and try again.")

if __name__ == '__main__':
    main()
