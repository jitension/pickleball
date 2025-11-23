#!/bin/bash
set -e

echo "🚀 Starting deployment..."

# Load environment variables
if [ -f .env.production ]; then
    export $(cat .env.production | grep -v '^#' | xargs)
else
    echo "❌ Error: .env.production file not found!"
    exit 1
fi

# Check if required variables are set
if [ -z "$CLOUDFLARE_TUNNEL_TOKEN" ] || [ "$CLOUDFLARE_TUNNEL_TOKEN" = "your-tunnel-token-here" ]; then
    echo "❌ Error: CLOUDFLARE_TUNNEL_TOKEN not set in .env.production"
    exit 1
fi

echo "🔐 Logging into GitHub Container Registry..."
echo "Please enter your GitHub Personal Access Token (PAT):"
read -s GITHUB_TOKEN
echo "$GITHUB_TOKEN" | docker login ghcr.io -u jitension --password-stdin

echo "📥 Pulling latest Docker images from GitHub Container Registry..."
docker-compose -f docker-compose.prod.yml pull

echo "🗄️  Running database migrations..."
docker-compose -f docker-compose.prod.yml run --rm backend python manage.py migrate

echo "📊 Collecting static files..."
docker-compose -f docker-compose.prod.yml run --rm backend python manage.py collectstatic --noinput

echo "🌱 Creating superuser (if needed)..."
docker-compose -f docker-compose.prod.yml run --rm backend python manage.py shell -c "
from django.contrib.auth import get_user_model;
User = get_user_model();
if not User.objects.filter(is_superuser=True).exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin');
    print('✅ Superuser created: admin/admin');
else:
    print('ℹ️  Superuser already exists');
"

echo "🚀 Starting services..."
docker-compose -f docker-compose.prod.yml up -d

echo "✅ Deployment complete!"
echo ""
echo "📍 Your app will be available at: https://pickleball.jitension.synology.me"
echo "🔐 Admin panel: https://pickleball.jitension.synology.me/admin/"
echo "   Username: admin"
echo "   Password: admin (CHANGE THIS IMMEDIATELY!)"
echo ""
echo "📊 Check status: docker-compose -f docker-compose.prod.yml ps"
echo "📋 View logs: docker-compose -f docker-compose.prod.yml logs -f"
