class JSONViewer {
    constructor() {
        this.getLawsButton = document.getElementById('getLaws');
        this.viewerSection = document.getElementById('viewerSection');
        this.errorSection = document.getElementById('errorSection');
        this.jsonDisplay = document.getElementById('jsonDisplay');
        this.fileName = document.getElementById('fileName');
        this.errorText = document.getElementById('errorText');
        this.copyButton = document.getElementById('copyButton');
        this.downloadButton = document.getElementById('downloadButton');
        this.clearButton = document.getElementById('clearButton');
        
        this.currentJSON = null;
        this.currentFileName = '';
        
        
        this.initEventListeners();
        
    }
    
    initEventListeners() {
        // All event listeners disabled - UI is non-interactive
        // this.copyButton.addEventListener('click', () => this.copyToClipboard());
        // this.downloadButton.addEventListener('click', () => this.downloadJSON());
        // this.clearButton.addEventListener('click', () => this.clearViewer());
        
        // Enable Analyze Situation button
        this.getLawsButton.addEventListener('click', async () => {
            const searchInput = document.getElementById('chatbotInput');
            const inputValue = searchInput.value.trim();
            
            if (inputValue) {
                user_message = inputValue;
                console.log('User message from button:', user_message);
                
                // Send message to backend and get Gemini response
                try {
                    const response = await fetch('/api/chatbot', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ message: user_message })
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        gemini_response = data.response;
                        console.log('Gemini response from button:', gemini_response);
                    } else {
                        console.error('Error from backend:', data.error);
                        gemini_response = 'Error: ' + data.error;
                    }
                } catch (error) {
                    console.error('Error sending message to backend:', error);
                    gemini_response = 'Error: Failed to connect to backend';
                }
                
                // Clear the search input after processing
                searchInput.value = '';
            } else {
                console.log('No input provided');
            }
        });
    }
    
    // Removed Get Laws click handler and related logic
    
    displayJSON(jsonData, filename) {
        this.currentJSON = jsonData;
        this.currentFileName = filename;
        
        // Hide error section and show viewer
        this.errorSection.style.display = 'none';
        this.viewerSection.style.display = 'block';
        
        // Update filename
        this.fileName.textContent = filename;
        
        // Format and display JSON with syntax highlighting
        const formattedJSON = this.formatJSON(jsonData);
        this.jsonDisplay.innerHTML = formattedJSON;
    }
    
    formatJSON(obj, indent = 0) {
        const indentStr = '  '.repeat(indent);
        
        if (obj === null) {
            return '<span class="json-null">null</span>';
        }
        
        if (typeof obj === 'string') {
            return `<span class="json-string">"${this.escapeHtml(obj)}"</span>`;
        }
        
        if (typeof obj === 'number') {
            return `<span class="json-number">${obj}</span>`;
        }
        
        if (typeof obj === 'boolean') {
            return `<span class="json-boolean">${obj}</span>`;
        }
        
        if (Array.isArray(obj)) {
            if (obj.length === 0) {
                return '<span class="json-punctuation">[]</span>';
            }
            
            let result = '<span class="json-punctuation">[</span>\n';
            obj.forEach((item, index) => {
                result += indentStr + '  ' + this.formatJSON(item, indent + 1);
                if (index < obj.length - 1) {
                    result += '<span class="json-punctuation">,</span>';
                }
                result += '\n';
            });
            result += indentStr + '<span class="json-punctuation">]</span>';
            return result;
        }
        
        if (typeof obj === 'object') {
            const keys = Object.keys(obj);
            if (keys.length === 0) {
                return '<span class="json-punctuation">{}</span>';
            }
            
            let result = '<span class="json-punctuation">{</span>\n';
            keys.forEach((key, index) => {
                result += indentStr + '  ';
                result += `<span class="json-key">"${this.escapeHtml(key)}"</span>`;
                result += '<span class="json-punctuation">: </span>';
                result += this.formatJSON(obj[key], indent + 1);
                if (index < keys.length - 1) {
                    result += '<span class="json-punctuation">,</span>';
                }
                result += '\n';
            });
            result += indentStr + '<span class="json-punctuation">}</span>';
            return result;
        }
        
        return String(obj);
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    showError(message) {
        this.viewerSection.style.display = 'none';
        this.errorSection.style.display = 'block';
        this.errorText.textContent = message;
    }
    
    copyToClipboard() {
        if (!this.currentJSON) return;
        
        const jsonString = JSON.stringify(this.currentJSON, null, 2);
        navigator.clipboard.writeText(jsonString).then(() => {
            // Visual feedback
            const originalText = this.copyButton.textContent;
            this.copyButton.textContent = 'Copied!';
            this.copyButton.style.background = '#10b981';
            this.copyButton.style.color = 'white';
            
            setTimeout(() => {
                this.copyButton.textContent = originalText;
                this.copyButton.style.background = '';
                this.copyButton.style.color = '';
            }, 2000);
        }).catch(() => {
            alert('Failed to copy to clipboard');
        });
    }
    
    downloadJSON() {
        if (!this.currentJSON) return;
        
        const jsonString = JSON.stringify(this.currentJSON, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = this.currentFileName || 'data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    clearViewer() {
        this.currentJSON = null;
        this.currentFileName = '';
        this.viewerSection.style.display = 'none';
        this.errorSection.style.display = 'none';
    }
    
    // Removed state dropdown functionality
}

// Chatbot Class
class Chatbot {
    constructor() {
        this.widget = document.getElementById('chatbotWidget');
        this.toggle = document.getElementById('chatbotToggle');
        this.container = document.getElementById('chatbotContainer');
        this.closeBtn = document.getElementById('chatbotClose');
        this.messagesContainer = document.getElementById('chatbotMessages');
        this.input = document.getElementById('chatbotInput');
        this.sendBtn = document.getElementById('chatbotSend');
        this.status = document.getElementById('chatbotStatus');
        
        this.isOpen = false;
        this.isLoading = false;
        
        this.initEventListeners();
    }
    
    initEventListeners() {
        // All chatbot functionality disabled - UI is non-interactive
        // if (this.toggle) {
        //     this.toggle.addEventListener('click', () => this.toggleChatbot());
        // }
        // if (this.closeBtn) {
        //     this.closeBtn.addEventListener('click', () => this.closeChatbot());
        // }
        
        // Send message functionality disabled
        // this.sendBtn.addEventListener('click', () => this.sendMessage());
        
        // Enter key functionality disabled
        // this.input.addEventListener('keypress', (e) => {
        //     if (e.key === 'Enter' && !e.shiftKey) {
        //         e.preventDefault();
        //         this.sendMessage();
        //     }
        // });
        
        // Close-on-outside-click disabled
        // if (this.widget && this.widget.classList.contains('chatbot-widget')) {
        //     document.addEventListener('click', (e) => {
        //         if (this.isOpen && !this.widget.contains(e.target)) {
        //             this.closeChatbot();
        //         }
        //     });
        // }
    }
    
    toggleChatbot() {
        if (this.isOpen) {
            this.closeChatbot();
        } else {
            this.openChatbot();
        }
    }
    
    openChatbot() {
        this.isOpen = true;
        this.widget.classList.add('open');
        this.input.focus();
    }
    
    closeChatbot() {
        this.isOpen = false;
        this.widget.classList.remove('open');
    }
    
    async sendMessage() {
        const message = this.input.value.trim();
        if (!message || this.isLoading) return;
        
        // Add user message to chat
        this.addMessage(message, 'user');
        
        // Clear input and show loading
        this.input.value = '';
        this.setLoading(true);
        
        try {
            // Send message to backend
            const response = await fetch('/api/chatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Add bot response to chat
                this.addMessage(data.response, 'bot');
                this.setStatus('', 'success');
            } else {
                throw new Error(data.error || 'Failed to get response');
            }
            
        } catch (error) {
            console.error('Chatbot error:', error);
            this.addMessage('Sorry, I encountered an error. Please try again.', 'bot');
            this.setStatus('Error: ' + error.message, 'error');
        } finally {
            this.setLoading(false);
        }
    }
    
    addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${sender}-message`;
        
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.innerHTML = `
            <div class="message-content">${this.escapeHtml(content)}</div>
            <div class="message-time">${timeString}</div>
        `;
        
        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    setLoading(loading) {
        this.isLoading = loading;
        this.sendBtn.disabled = loading;
        
        if (loading) {
            this.sendBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spinning">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="m9 12 2 2 4-4"></path>
                </svg>
            `;
            this.setStatus('Thinking...', '');
        } else {
            this.sendBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
                </svg>
            `;
        }
    }
    
    setStatus(message, type) {
        this.status.textContent = message;
        this.status.className = `chatbot-status ${type}`;
        
        if (!message) {
            setTimeout(() => {
                this.status.textContent = '';
                this.status.className = 'chatbot-status';
            }, 3000);
        }
    }
    
    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Global variables to store user message and Gemini response
let user_message = '';
let gemini_response = '';

// Initialize the JSON viewer and chatbot when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new JSONViewer();
    new Chatbot();
    
    // Add Enter key handler for search input
    const searchInput = document.getElementById('chatbotInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', async (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const inputValue = searchInput.value.trim();
                if (inputValue) {
                    user_message = inputValue;
                    console.log('User message saved:', user_message);
                    
                    // Send message to backend and get Gemini response
                    try {
                        const response = await fetch('/api/chatbot', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ message: user_message })
                        });
                        
                        const data = await response.json();
                        
                        if (data.success) {
                            gemini_response = data.response;
                            console.log('Gemini response saved:', gemini_response);
                        } else {
                            console.error('Error from backend:', data.error);
                            gemini_response = 'Error: ' + data.error;
                        }
                    } catch (error) {
                        console.error('Error sending message to backend:', error);
                        gemini_response = 'Error: Failed to connect to backend';
                    }
                    
                    // Clear the input after processing
                    searchInput.value = '';
                }
            }
        });
    }
});