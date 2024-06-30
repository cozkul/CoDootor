FROM ollama/ollama:0.1.46 AS builder

# RUN apt-get update && apt-get install -y netcat

# COPY entrypoint.sh /usr/local/bin/entrypoint.sh
# RUN chmod +x /usr/local/bin/entrypoint.sh

# ENTRYPOINT ["/usr/bin/bash", "/usr/local/bin/entrypoint.sh"]

RUN ollama serve & sleep 5 ; ollama pull codegemma:2b ;
RUN ps -ef | grep 'ollama serve' | grep -v grep | awk '{print $2}' | xargs -r kill -9

FROM ollama/ollama

COPY --from=builder /root/.ollama /root/.ollama

ENTRYPOINT ["ollama", "serve"]

WORKDIR /root/.ollama

EXPOSE 11434