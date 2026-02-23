FROM ubuntu:22.04

# Install dependencies (ADD zstd here 👇)
RUN apt-get update && \
    apt-get install -y curl python3 python3-pip zstd

# Install Ollama
RUN curl -fsSL https://ollama.com/install.sh | sh

# Set working directory
WORKDIR /app

# Copy files
COPY . .

# Install Python requirements
RUN pip3 install -r requirements.txt

# Pull model
RUN ollama pull tinyllama

# Expose port
EXPOSE 8000

# Start Ollama + App
CMD ollama serve & python3 main.py