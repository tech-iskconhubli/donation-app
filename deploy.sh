#!/bin/bash

# Build and deployment script for Donation Campaign App

echo "🚀 Starting deployment process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🏗️  Building application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "🎉 Deployment ready!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Set up your Razorpay account and get API keys"
    echo "2. Update .env.local with your actual keys"
    echo "3. Deploy to your preferred platform (Vercel, Netlify, etc.)"
    echo "4. Test the payment flow with test keys first"
    echo ""
    echo "🔧 To run locally:"
    echo "npm run dev"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi
