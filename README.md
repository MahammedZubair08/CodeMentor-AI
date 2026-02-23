# CodeMentor-AI - Programming Interview Assistant

A modern AI-powered web application for mastering **Data Structures and Algorithms** through interactive interview practice. Get hints, explanations, code examples, and complexity analysis all in one place.

## Features

✨ **Smart Interview Assistant**
- Provides hints on how to solve problems
- Explains approaches step by step
- Shares optimized code solutions
- Analyzes time and space complexity
- Maintains conversation context

🎨 **Modern Web UI**
- Clean, responsive chat interface
- Dark mode support
- Syntax-highlighted code blocks
- Beautiful gradient design
- Mobile-friendly layout

🚀 **Easy to Use**
- Type your DSA questions naturally
- Get instant feedback
- Clear button to reset conversations
- Quick topic suggestions
- Keyboard shortcuts (Ctrl+Enter to send)

## Tech Stack

**Backend:**
- FastAPI - Modern Python web framework
- Ollama - Local LLM inference
- Uvicorn - ASGI server

**Frontend:**
- HTML5 & CSS3 - Semantic markup and styling
- Vanilla JavaScript - Interactive UI
- No framework dependencies - Lightweight and fast

**AI Model:**
- TinyLLaMA - Efficient local language model

## Prerequisites

Before you start, ensure you have:

1. **Python 3.8+** - [Download here](https://www.python.org/downloads/)
2. **Ollama** - [Download here](https://ollama.ai/)
3. **TinyLLaMA model** - Will be auto-downloaded by Ollama

## Installation

### Step 1: Install Ollama

Download and install Ollama from [https://ollama.ai/](https://ollama.ai/)

### Step 2: Pull the TinyLLaMA Model

Open a terminal and run:

```bash
ollama pull tinyllama
```

This downloads the tinyllama model (~0.6GB).

### Step 3: Start Ollama Server

Keep Ollama running in the background. It will be available at `http://localhost:11434`

```bash
# On macOS or Linux, Ollama starts automatically
# On Windows, the application handles this

# You can verify it's running with:
curl http://localhost:11434/api/tags
```

### Step 4: Install Python Dependencies

```bash
cd /workspaces/sml
pip install -r requirements.txt
```

## Usage

### Start the Application

```bash
python main.py
```

The server will start at `http://localhost:8000`

### Open in Browser

1. Open your web browser
2. Navigate to `http://localhost:8000`
3. Start asking DSA questions!

### Example Questions

- "How do I solve the Two Sum problem?"
- "Explain binary search with an example"
- "What's the best way to reverse a linked list?"
- "How do I detect cycles in a graph?"
- "Explain dynamic programming with a Fibonacci example"

## Directory Structure

```
sml/
├── main.py                 # FastAPI backend application
├── requirements.txt        # Python dependencies
├── README.md              # This file
└── static/
    ├── index.html         # Main HTML interface
    ├── style.css          # Styling (light/dark mode)
    └── script.js          # Frontend JavaScript logic
```

## Features in Detail

### Chat Interface
- **User Messages** - Appears on the right in blue
- **AI Responses** - Appears on the left with markdown support
- **Code Blocks** - Syntax-highlighted with language detection
- **Auto-scrolling** - New messages automatically scroll into view

### Sidebar
- **Instructions** - Quick reference for using the app
- **Topic Tags** - Click to ask about specific DSA topics
- **Clear Button** - Reset the conversation history

### Keyboard Shortcuts
- **Ctrl+Enter** (Windows/Linux) or **Cmd+Enter** (Mac) - Send message
- **Tab** - Navigate between input and other elements

## Customization

### Change the Model

Edit `main.py` and update:
```python
MODEL_NAME = "neural-chat"  # or any other Ollama model
```

Available models: https://ollama.ai/library

### Modify System Prompt

Edit the `SYSTEM_PROMPT` in `main.py` to customize AI behavior.

### Adjust UI Colors

Edit the CSS variables in `static/style.css`:
```css
:root {
    --primary-color: #6366f1;
    --accent-color: #ec4899;
    /* ... more colors ... */
}
```

## Troubleshooting

### Ollama Connection Error
```
Error: Connection refused to localhost:11434
```
**Solution:** Make sure Ollama is running:
```bash
ollama serve
```

### Model Not Found
```
Error: Model 'tinyllama' not found
```
**Solution:** Pull the model:
```bash
ollama pull tinyllama
```

### Port Already in Use
```
Address already in use
```
**Solution:** Change the port in `main.py`:
```python
uvicorn.run(app, host="0.0.0.0", port=8001)
```

### Slow Responses
- TinyLLaMA is optimized for speed but may still take a few seconds
- For faster responses on GPU, try `ollama pull neural-chat`
- Ensure your system has adequate free RAM

## Performance Tips

1. **GPU Acceleration** - If you have an NVIDIA GPU, Ollama will use it automatically
2. **Memory** - Try to have at least 4GB RAM available
3. **Model Size** - TinyLLaMA is optimized for resource-constrained systems
4. **Network** - API calls are local, so internet speed doesn't matter

## Development

### Adding Features

To add new features:

1. **Backend** - Modify `main.py` to add new endpoints
2. **Frontend** - Update `static/script.js` for new interactions
3. **Styling** - Enhance `static/style.css` with new designs

### API Endpoints

- `GET /` - Serves the HTML interface
- `POST /chat` - Send a message to the AI
- `POST /reset` - Clear conversation history
- `GET /static/{filename}` - Serve static assets

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT License - Feel free to use and modify!

## Contributing

Found a bug? Have a feature idea? Feel free to contribute!

## Support

If you encounter issues:

1. Check the Troubleshooting section above
2. Ensure Ollama and the model are properly installed
3. Check browser console for JavaScript errors (F12 → Console)
4. Verify Python dependencies are installed correctly

---

**Happy learning! Master DSA with CodeMentor-AI! 🚀**