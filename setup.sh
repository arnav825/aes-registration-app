#!/bin/bash
echo "============================================"
echo "  AES Registration App - Auto Setup"
echo "============================================"
echo ""

echo "[1/4] Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
  echo "ERROR: npm install failed. Make sure Node.js is installed."
  exit 1
fi

echo ""
echo "[2/4] Checking for .env file..."
if [ ! -f ".env" ]; then
  cp .env.example .env
  echo ".env file created from template."
  echo ""
  echo "============================================"
  echo " ACTION REQUIRED:"
  echo " Open .env in a text editor and paste"
  echo " your Firebase keys, then run this"
  echo " script again."
  echo "============================================"
  open .env 2>/dev/null || nano .env
  exit 0
fi

echo ".env file found."

echo ""
echo "[3/4] Building the app..."
npm run build
if [ $? -ne 0 ]; then
  echo "ERROR: Build failed. Check your .env file has correct Firebase keys."
  exit 1
fi

echo ""
echo "[4/4] Done!"
echo "============================================"
echo " BUILD SUCCESSFUL!"
echo " Your app is in the 'dist' folder."
echo ""
echo " To run locally:"
echo "   npm run dev"
echo " Then open: http://localhost:5173"
echo "============================================"
