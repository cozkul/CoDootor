ollama serve &
pid=$!
sleep 5
echo "RETRIEVE codegemma model..."
ollama pull codegemma:2b
echo "DONE!"
wait $pid