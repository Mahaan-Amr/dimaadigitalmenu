#!/bin/bash

# Build the application
echo "Building the application..."
npm run build

# Create a deployment directory
echo "Creating deployment directory..."
ssh root@185.213.165.209 "mkdir -p /var/www/dimaacafe"

# Copy the files
echo "Copying files to server..."
scp -r .next package.json package-lock.json public data root@185.213.165.209:/var/www/dimaacafe/

# Install dependencies and start the application
echo "Installing dependencies and starting the application..."
ssh root@185.213.165.209 "cd /var/www/dimaacafe && npm install --production && pm2 delete dimaacafe || true && pm2 start npm --name dimaacafe -- start"

echo "Deployment completed!" 