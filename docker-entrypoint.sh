#!/bin/sh

# Start Spring Boot in the background
pm2 start "java -jar /app/app.jar --spring.profiles.active=production" --name recipe-app-back-end

# Start Next.js in the background
cd /frontend && pm2 start "npm run start" --name recipe-app-front-end


# Keep the container running
tail -f /dev/null
