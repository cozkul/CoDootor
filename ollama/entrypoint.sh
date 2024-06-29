/bin/ollama serve &
pid=$!

while ! nc -z localhost 11434; do
  echo "Waiting for Ollama service to start..."
  sleep 1
done

echo "🔴 Retrieve codegemma:2b model..."
ollama pull codegemma:2b > /dev/null 2>&1
echo "🟢 Done!"

wait $pid