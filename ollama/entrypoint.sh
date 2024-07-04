/bin/ollama serve &
pid=$!

while ! nc -z localhost 11434; do
    echo "Waiting for Ollama service to start..."
    sleep 1
done

echo "Retrieving codellama model..."
ollama pull codellama:7b
echo "Done!"

wait $pid