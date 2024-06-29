FROM ollama/ollama:0.1.46 as builder

RUN apt-get update && apt-get install -y netcat

COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# RUN ollama pull codegemma:2b

FROM ollama/ollama:0.1.46

WORKDIR /root/.ollama

EXPOSE 11434