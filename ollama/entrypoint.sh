/bin/ollama serve &
pid=$!

while ! nc -z localhost 11434; do
  echo "Waiting for Ollama service to start..."
  sleep 1
done

ollama pull codegemma:2b

wait $pid