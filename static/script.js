// DOM Elements
const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
const chatMessages = document.getElementById('chatMessages');
const sendBtn = document.getElementById('sendBtn');
const clearBtn = document.getElementById('clearBtn');
const topicTags = document.querySelectorAll('.topic-tag');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');

// State
let isLoading = false;

// Check Ollama health status
async function checkOllamaStatus() {
    try {
        const response = await fetch('/health', { method: 'GET' });
        const data = await response.json();
        
        const isConnected = data.ollama === 'connected';
        updateStatusIndicator(isConnected);
        
        return isConnected;
    } catch (error) {
        console.error('Health check failed:', error);
        updateStatusIndicator(false);
        return false;
    }
}

function updateStatusIndicator(isConnected) {
    if (isConnected) {
        statusDot.classList.remove('disconnected');
        statusDot.classList.add('connected');
        statusText.textContent = 'Ollama Connected';
    } else {
        statusDot.classList.remove('connected');
        statusDot.classList.add('disconnected');
        statusText.textContent = 'Ollama Disconnected';
    }
}

// Auto-resize textarea
userInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 128) + 'px';
});

// Handle form submission
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const message = userInput.value.trim();
    if (!message || isLoading) return;
    
    // Add user message to chat
    addMessage(message, 'user');
    userInput.value = '';
    userInput.style.height = 'auto';
    
    // Show loading state
    setLoading(true);
    
    try {
        // Send message to backend
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message })
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const statusCode = response.status;
            
            let errorMessage = "Sorry, I encountered an error.";
            
            if (statusCode === 503) {
                errorMessage = "⚠️ **Ollama is not running!**\n\nPlease make sure Ollama is installed and running:\n\n```bash\nollama serve\n```\n\nOnce Ollama is running, try your question again.";
            } else if (statusCode === 504) {
                errorMessage = "⏱️ **Request timed out.**\n\nThe model took too long to respond. This usually happens if:\n- Your machine is low on memory\n- The system is under heavy load\n\nTry asking a simpler question or check system resources.";
            } else if (errorData.detail) {
                errorMessage = `Error: ${errorData.detail}`;
            } else {
                errorMessage = `HTTP Error ${statusCode}: Please check that:\n1. The backend server is running\n2. Ollama is installed and running (ollama serve)\n3. The tinyllama model is downloaded (ollama pull tinyllama)`;
            }
            
            throw new Error(errorMessage);
        }
        
        const data = await response.json();
        addMessage(data.reply, 'assistant');
        
    } catch (error) {
        console.error('Error:', error);
        addMessage(error.message || error.toString(), 'assistant');
    } finally {
        setLoading(false);
        userInput.focus();
    }
});

// Handle keyboard shortcuts
userInput.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        chatForm.dispatchEvent(new Event('submit'));
    }
});

// Add message to chat
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    // Format the message (convert markdown-like syntax)
    const formattedText = formatMessage(text);
    contentDiv.innerHTML = formattedText;
    
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    
    // Auto-scroll to latest message
    scrollToBottom();
}

// Format message text (handle code blocks, bold, etc.)
function formatMessage(text) {
    // Escape HTML characters first
    let formatted = escapeHtml(text);
    
    // Handle code blocks with triple backticks
    formatted = formatted.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, language, code) => {
        return `<pre><code class="language-${language || 'text'}">${code.trim()}</code></pre>`;
    });
    
    // Handle inline code with single backticks
    formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Handle bold with **
    formatted = formatted.replace(/\*\*([^\*]+)\*\*/g, '<strong>$1</strong>');
    
    // Handle italic with *
    formatted = formatted.replace(/\*([^\*]+)\*/g, '<em>$1</em>');
    
    // Handle line breaks
    formatted = formatted.replace(/\n/g, '<br>');
    
    // Handle numbered lists
    formatted = formatted.replace(/\d+\.\s+([^\n<]+)/g, '<li>$1</li>');
    
    // Wrap consecutive li elements in ol
    formatted = formatted.replace(/(<li>.*<\/li>)/s, '<ol>$1</ol>');
    formatted = formatted.replace(/<\/li><br><li>/g, '</li><li>');
    formatted = formatted.replace(/<\/ol><br><ol>/g, '');
    
    // Handle bullet points with -
    formatted = formatted.replace(/^[-•]\s+([^\n<]+)/gm, '<li>$1</li>');
    
    // Wrap consecutive li elements in ul
    formatted = formatted.replace(/(?<!<ol>)(?<!<\/li>)<li>([^<]*)<\/li>/g, (match, content, offset, string) => {
        // Check if this is already in an ol
        if (string.lastIndexOf('<ol>', offset) > string.lastIndexOf('</ol>', offset)) {
            return match;
        }
        return match;
    });
    
    return formatted;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Scroll to bottom of chat
function scrollToBottom() {
    setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 0);
}

// Set loading state
function setLoading(loading) {
    isLoading = loading;
    sendBtn.disabled = loading;
    sendBtn.innerHTML = loading 
        ? '<span class="loading-spinner"></span>' 
        : '<span>Send</span><span class="send-icon">→</span>';
}

// Clear conversation
clearBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear the conversation?')) {
        chatMessages.innerHTML = `
            <div class="message assistant-message welcome-message">
                <div class="message-content">
                    <h3>Welcome to CodeMentor-AI! 👋</h3>
                    <p>I'm your AI programming interview assistant. I specialize in helping you master <strong>Data Structures and Algorithms</strong>.</p>
                    <p><strong>How I work:</strong></p>
                    <ul>
                        <li>💭 <strong>Hint:</strong> I'll give you a nudge in the right direction</li>
                        <li>🔍 <strong>Approach:</strong> I'll explain the strategy to solve it</li>
                        <li>💻 <strong>Code:</strong> I can provide working code examples</li>
                        <li>⏱️ <strong>Complexity:</strong> I'll always mention time and space complexity</li>
                    </ul>
                    <p>Ready? Ask me a DSA question and let's get started! 🚀</p>
                </div>
            </div>
        `;
        userInput.focus();
        
        // Notify backend to clear conversation
        fetch('/reset', { method: 'POST' }).catch(err => console.log('Reset endpoint not available yet'));
    }
});

// Topic tag interactions
topicTags.forEach(tag => {
    tag.addEventListener('click', () => {
        const topic = tag.textContent;
        userInput.value = `Can you explain ${topic} for me? `;
        userInput.focus();
        userInput.style.height = 'auto';
        userInput.style.height = userInput.scrollHeight + 'px';
    });
});

// Focus input on load
window.addEventListener('load', () => {
    userInput.focus();
    // Check Ollama status on load
    checkOllamaStatus();
    // Check every 5 seconds
    setInterval(checkOllamaStatus, 5000);
});

// Handle paste events - allow newlines but still auto-resize
userInput.addEventListener('paste', (e) => {
    setTimeout(() => {
        userInput.style.height = 'auto';
        userInput.style.height = Math.min(userInput.scrollHeight, 128) + 'px';
    }, 0);
});
