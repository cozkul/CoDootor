/bin/ollama serve &
pid=$!

while ! nc -z localhost 11434; do
    echo "Waiting for Ollama service to start..."
    sleep 1
done

echo "Retrieving granite3b model..."
ollama pull granite-code:3b
echo "Done!"

wait $pid