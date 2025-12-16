#!/usr/bin/env bash
set -euo pipefail

echo ">>> Checking Ubuntu version (need 24.x)..."
if ! grep -q "Ubuntu 24" /etc/os-release; then
  echo "This script is intended for Ubuntu 24.x" >&2
fi

echo ">>> Checking Java (need 21)..."
if command -v java >/dev/null 2>&1; then
  java -version
else
  echo "Java not found. Install OpenJDK 21: sudo apt-get update && sudo apt-get install -y openjdk-21-jdk" >&2
fi

echo ">>> Checking nvm..."
if [ -z "${NVM_DIR:-}" ]; then
  export NVM_DIR="$HOME/.nvm"
fi

if [ ! -s "$NVM_DIR/nvm.sh" ]; then
  echo "nvm not installed. Installing..."
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
  # shellcheck disable=SC1090
  source "$NVM_DIR/nvm.sh"
else
  # shellcheck disable=SC1090
  source "$NVM_DIR/nvm.sh"
fi

echo ">>> Ensuring Node version from frontend/.nvmrc..."
if [ -f "./frontend/.nvmrc" ]; then
  nvm install
  nvm use
else
  echo "frontend/.nvmrc not found; please ensure Node 24 LTS" >&2
fi

echo ">>> Node version:"
node -v

echo ">>> Installing frontend dependencies..."
(cd frontend && npm install)

echo ">>> Backend: ensure Gradle wrapper is executable..."
chmod +x backend/gradlew

echo "Initialization complete. You can run ./run-checks.sh or ./run-dev.sh next."
