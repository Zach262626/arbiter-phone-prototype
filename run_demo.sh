#!/bin/bash

echo "========================================"
echo "   ArbiterMobile App Demo Launcher"
echo "========================================"
echo ""
echo "Starting the demo application..."
echo ""
echo "This will:"
echo "1. Install dependencies (first time only)"
echo "2. Launch the web version in your browser"
echo ""
echo "Please wait..."
echo ""

# Check if node_modules exists, if not run npm install
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies (this may take a few minutes)..."
    npm install
    if [ $? -ne 0 ]; then
        echo ""
        echo "ERROR: Failed to install dependencies."
        echo "Please make sure Node.js is installed from https://nodejs.org/"
        echo ""
        read -p "Press Enter to continue..."
        exit 1
    fi
    echo "Dependencies installed successfully!"
    echo ""
fi

echo "Starting the web demo..."
echo ""
echo "The app will open in your default browser shortly."
echo "If it doesn't open automatically, go to: http://localhost:8081"
echo ""
echo "To stop the demo, press Ctrl+C in this terminal."
echo ""

npm run web
