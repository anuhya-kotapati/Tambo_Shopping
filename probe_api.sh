#!/bin/bash
source .env.local

# Try the most popular Amazon API on RapidAPI
HOST="real-time-amazon-data.p.rapidapi.com"
KEY="$NEXT_PUBLIC_RAPID_API_KEY"

echo "Probing $HOST..."

endpoints=(
  "/search?query=mouse"
  "/product-search?query=mouse"
  "/products/search?query=mouse"
)

for path in "${endpoints[@]}"; do
  url="https://$HOST$path"
  echo "Trying $url..."
  status=$(curl -o /dev/null -s -w "%{http_code}\n" -H "x-rapidapi-key: $KEY" -H "x-rapidapi-host: $HOST" "$url")
  echo "Status: $status"
  if [ "$status" == "200" ]; then
    echo "SUCCESS: $path"
    curl -s -H "x-rapidapi-key: $KEY" -H "x-rapidapi-host: $HOST" "$url" | head -c 200
    echo ""
    # Don't break immediately, try others to see which is best? 
    # Actually break is fine if we find one.
    break
  fi
done
