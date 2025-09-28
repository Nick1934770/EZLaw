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
        
        // States dropdown elements
        this.statesInput = document.getElementById('statesInput');
        this.statesDropdown = document.getElementById('statesDropdown');
        this.selectedState = document.getElementById('selectedState');
        this.selectedStateValue = document.getElementById('selectedStateValue');
        this.clearStateButton = document.getElementById('clearState');
        
        this.currentJSON = null;
        this.currentFileName = '';
        this.selectedStateData = null;
        this.highlightedIndex = -1;
        
        this.initEventListeners();
        this.initStatesDropdown();
    }
    
    initEventListeners() {
        this.getLawsButton.addEventListener('click', () => this.handleGetLaws());
        this.copyButton.addEventListener('click', () => this.copyToClipboard());
        this.downloadButton.addEventListener('click', () => this.downloadJSON());
        this.clearButton.addEventListener('click', () => this.clearViewer());
    }
    
    async handleGetLaws() {
        console.log('Get Laws button clicked');
        
        // Show loading state
        this.getLawsButton.disabled = true;
        this.getLawsButton.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spinning">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="m9 12 2 2 4-4"></path>
            </svg>
            Loading Laws...
        `;
        
        try {
            // Call our Flask backend API endpoint
            console.log('Fetching laws from LegiScan API via Flask backend...');
            const response = await fetch('/api/get-laws');
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('API Response:', data);
            
            if (!data.success) {
                throw new Error(data.error || 'Unknown error occurred');
            }
            
            // Create a comprehensive display object with dataset info and sample files
            const displayData = {
                "LegiScan_Dataset_Info": data.dataset_info,
                "Sample_Files_Included": data.sample_files,
                "Extracted_Legal_Documents": data.data
            };
            
            // Display the processed JSON data
            this.displayJSON(displayData, `LegiScan Dataset - ${data.dataset_info.session_name}`);
            
        } catch (error) {
            console.error('Error fetching laws:', error);
            this.showError(`Error fetching laws: ${error.message}`);
        } finally {
            // Reset button state
            this.getLawsButton.disabled = false;
            this.getLawsButton.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14,2 14,8 20,8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10,9 9,9 8,9"></polyline>
                </svg>
                Get Laws
            `;
        }
    }
    
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
    
    // States Dropdown Functionality
    initStatesDropdown() {
        const dropdownContainer = this.statesInput.parentElement;
        
        // Input events
        this.statesInput.addEventListener('input', (e) => this.handleStatesInput(e));
        this.statesInput.addEventListener('focus', () => this.openDropdown());
        this.statesInput.addEventListener('keydown', (e) => this.handleKeyNavigation(e));
        
        // Dropdown item clicks
        const dropdownItems = this.statesDropdown.querySelectorAll('.dropdown-item');
        dropdownItems.forEach(item => {
            item.addEventListener('click', () => this.selectState(item));
        });
        
        // Clear selection
        this.clearStateButton.addEventListener('click', () => this.clearStateSelection());
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdownContainer.contains(e.target)) {
                this.closeDropdown();
            }
        });
    }
    
    handleStatesInput(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        // If search term is empty, restore original order and show all items
        if (searchTerm === '') {
            this.restoreOriginalOrder();
            this.openDropdown();
            return;
        }
        
        const dropdownItems = Array.from(this.statesDropdown.querySelectorAll('.dropdown-item'));
        
        // Create array of items with their match priority
        const matchedItems = [];
        
        dropdownItems.forEach(item => {
            const stateName = item.textContent.toLowerCase();
            const stateCode = item.dataset.value.toLowerCase();
            
            let matchPriority = -1; // -1 means no match
            
            // Priority 1: State name starts with search term
            if (stateName.startsWith(searchTerm)) {
                matchPriority = 1;
            }
            // Priority 2: State code starts with search term
            else if (stateCode.startsWith(searchTerm)) {
                matchPriority = 2;
            }
            // Priority 3: State name contains search term
            else if (stateName.includes(searchTerm)) {
                matchPriority = 3;
            }
            // Priority 4: State code contains search term
            else if (stateCode.includes(searchTerm)) {
                matchPriority = 4;
            }
            
            if (matchPriority > 0) {
                matchedItems.push({
                    element: item,
                    priority: matchPriority,
                    name: stateName
                });
            }
        });
        
        // Sort by priority, then alphabetically by name
        matchedItems.sort((a, b) => {
            if (a.priority !== b.priority) {
                return a.priority - b.priority; // Lower number = higher priority
            }
            return a.name.localeCompare(b.name); // Alphabetical within same priority
        });
        
        // Hide all items first
        dropdownItems.forEach(item => {
            item.classList.add('hidden');
            item.classList.remove('highlighted');
        });
        
        // Show matched items in order and reorder them in the DOM
        matchedItems.forEach((matchedItem, index) => {
            matchedItem.element.classList.remove('hidden');
            // Move element to correct position in DOM for proper order
            this.statesDropdown.appendChild(matchedItem.element);
        });
        
        // Reset highlighted index when filtering
        this.highlightedIndex = -1;
        
        // Open dropdown if there are visible items
        if (matchedItems.length > 0) {
            this.openDropdown();
        } else {
            this.closeDropdown();
        }
    }
    
    handleKeyNavigation(e) {
        const visibleItems = Array.from(this.statesDropdown.querySelectorAll('.dropdown-item:not(.hidden)'));
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.highlightedIndex = Math.min(this.highlightedIndex + 1, visibleItems.length - 1);
                this.updateHighlight(visibleItems);
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                this.highlightedIndex = Math.max(this.highlightedIndex - 1, -1);
                this.updateHighlight(visibleItems);
                break;
                
            case 'Enter':
                e.preventDefault();
                if (this.highlightedIndex >= 0 && visibleItems[this.highlightedIndex]) {
                    this.selectState(visibleItems[this.highlightedIndex]);
                }
                break;
                
            case 'Escape':
                this.closeDropdown();
                this.statesInput.blur();
                break;
        }
    }
    
    updateHighlight(visibleItems) {
        // Remove all highlights
        visibleItems.forEach(item => item.classList.remove('highlighted'));
        
        // Add highlight to current item
        if (this.highlightedIndex >= 0 && visibleItems[this.highlightedIndex]) {
            visibleItems[this.highlightedIndex].classList.add('highlighted');
            
            // Scroll into view if needed
            visibleItems[this.highlightedIndex].scrollIntoView({
                block: 'nearest',
                behavior: 'smooth'
            });
        }
    }
    
    selectState(item) {
        const stateName = item.textContent;
        const stateCode = item.dataset.value;
        
        this.selectedStateData = { name: stateName, code: stateCode };
        this.statesInput.value = stateName;
        this.selectedStateValue.textContent = `${stateName} (${stateCode})`;
        this.selectedState.style.display = 'flex';
        
        this.closeDropdown();
        
        // Visual feedback
        item.classList.add('selected');
        setTimeout(() => item.classList.remove('selected'), 300);
    }
    
    clearStateSelection() {
        this.selectedStateData = null;
        this.statesInput.value = '';
        this.selectedState.style.display = 'none';
        this.highlightedIndex = -1;
        
        // Restore original alphabetical order and show all items
        this.restoreOriginalOrder();
        
        this.statesInput.focus();
    }
    
    restoreOriginalOrder() {
        const dropdownItems = Array.from(this.statesDropdown.querySelectorAll('.dropdown-item'));
        
        // Sort items alphabetically by state name
        dropdownItems.sort((a, b) => {
            return a.textContent.localeCompare(b.textContent);
        });
        
        // Clear the dropdown and re-append items in correct order
        this.statesDropdown.innerHTML = '';
        dropdownItems.forEach(item => {
            item.classList.remove('hidden', 'highlighted', 'selected');
            this.statesDropdown.appendChild(item);
        });
    }
    
    openDropdown() {
        const dropdownContainer = this.statesInput.parentElement;
        dropdownContainer.classList.add('open');
        
        // Ensure input border radius is updated
        this.statesInput.style.borderRadius = '8px 8px 0 0';
    }
    
    closeDropdown() {
        const dropdownContainer = this.statesInput.parentElement;
        dropdownContainer.classList.remove('open');
        this.highlightedIndex = -1;
        
        // Reset input border radius
        this.statesInput.style.borderRadius = '8px';
        
        // Remove all highlights
        const dropdownItems = this.statesDropdown.querySelectorAll('.dropdown-item');
        dropdownItems.forEach(item => item.classList.remove('highlighted'));
    }
}

// Initialize the JSON viewer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new JSONViewer();
});