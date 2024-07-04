FROM ollama/ollama

WORKDIR /root/.ollama
ENV OLLAMA_MODELS="/root/.ollama/models"

RUN ollama serve & sleep 5 ; ollama pull codellama:7b ;
RUN ps -ef | grep 'ollama serve' | grep -v grep | awk '{print $2}' | xargs -r kill -9

EXPOSE 11434