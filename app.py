from flask import Flask, render_template, jsonify, request
import requests
import zipfile
import json
import io
import tempfile
import os
from google import genai

app = Flask(__name__)

# Configure Gemini API (google-genai client)
# Make sure GEMINI_API_KEY is set in your environment

genai_client = genai.Client(api_key="AIzaSyA7FgZWAiJuRsT9ROVQthoViVacQt7VlEs") 

@app.route('/')
def index():
    """Serve the main JSON viewer page"""
    return render_template('index.html')

@app.route('/chat')
def chat():
    """Serve the chat page with floating chatbot and inline search"""
    return render_template('chat.html')

@app.route('/api/get-laws')
def get_laws():
    """Fetch laws from LegiScan API, extract zip, and return JSON data"""
    try:
        # LegiScan API endpoint
        api_url = "https://api.legiscan.com/?key=b6faddc9568927ca69bf4440932834d6&op=getDataset&access_key=5NPEPvbRSeqY4haz080Nwh&id=2183"
        
        print(f"Fetching data from LegiScan API: {api_url}")
        
        # Make request to LegiScan API
        response = requests.get(api_url, timeout=30)
        response.raise_for_status()
        
        # Parse the JSON response
        api_data = response.json()
        
        if api_data.get('status') != 'OK':
            return jsonify({
                'success': False,
                'error': 'LegiScan API returned error status'
            }), 400
        
        dataset = api_data.get('dataset', {})
        zip_data = dataset.get('zip')
        
        if not zip_data:
            return jsonify({
                'success': False,
                'error': 'No zip data found in API response'
            }), 400
        
        print("Processing zip data...")
        
        # Decode base64 zip data
        import base64
        zip_bytes = base64.b64decode(zip_data)
        
        # Extract and process zip file
        extracted_data = {}
        sample_files = []
        
        with zipfile.ZipFile(io.BytesIO(zip_bytes), 'r') as zip_ref:
            file_list = zip_ref.namelist()
            print(f"Found {len(file_list)} files in zip")
            
            # Process up to 5 JSON files for display
            json_files = [f for f in file_list if f.endswith('.json')][:5]
            
            for file_name in json_files:
                try:
                    with zip_ref.open(file_name) as file:
                        content = file.read().decode('utf-8')
                        json_content = json.loads(content)
                        
                        # Store with simplified filename
                        simple_name = os.path.basename(file_name)
                        extracted_data[simple_name] = json_content
                        sample_files.append(simple_name)
                        
                except Exception as e:
                    print(f"Error processing {file_name}: {str(e)}")
                    continue
        
        if not extracted_data:
            return jsonify({
                'success': False,
                'error': 'No valid JSON files found in zip archive'
            }), 400
        
        # Create response with dataset info and sample files
        result = {
            'success': True,
            'dataset_info': {
                'state_id': dataset.get('state_id'),
                'session_title': dataset.get('session_title'),
                'session_name': dataset.get('session_name'),
                'year_start': dataset.get('year_start'),
                'year_end': dataset.get('year_end'),
                'dataset_date': dataset.get('dataset_date'),
                'total_files': len(file_list),
                'processed_files': len(extracted_data)
            },
            'sample_files': sample_files,
            'data': extracted_data
        }
        
        print(f"Successfully processed {len(extracted_data)} files")
        return jsonify(result)
        
    except requests.RequestException as e:
        print(f"Request error: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Failed to fetch data from LegiScan API: {str(e)}'
        }), 500
        
    except Exception as e:
        print(f"General error: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Error processing LegiScan data: {str(e)}'
        }), 500

@app.route('/api/chatbot', methods=['POST'])
def chatbot():
    """Handle chatbot messages using Gemini API"""
    try:
        if not genai_client:
            return jsonify({
                'success': False,
                'error': 'Gemini API not configured. Please set GEMINI_API_KEY environment variable.'
            }), 500
        
        data = request.get_json()
        if not data or 'message' not in data:
            return jsonify({
                'success': False,
                'error': 'Message is required'
            }), 400
        
        user_message = data['message']
        
        # Generate response using Gemini (google-genai client)
        result = genai_client.models.generate_content(
            model="gemini-2.5-pro",
            contents="You are a lookup machine that will only return the top 3 bill ids sorted in order of relevance with one being garunteed to be relevant and less progressive at number 3, we need these bill ids in the database related to the user input for" + 
            f"congress API bill lookup ONLY RETURN THE BILL IDS, CONGRESS NUMBER AND NOTHING ELSE in the form: hr.1234.118, then use a bar to seperate elements (laws), this is the user's input:" + user_message
        )
        
        # Store Gemini result for later use
        gemini_response = result.text

        return jsonify({
            'success': True,
            'response': result.text
        })
        
    except Exception as e:
        print(f"Chatbot error: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Error processing message: {str(e)}'
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=3003)
