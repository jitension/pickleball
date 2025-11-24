# Community Pickleball App

A web and mobile PWA application for managing community pickleball events, scheduling polls, and challenges.

## Features

- 🎾 **Scheduling Polls**: Vote on game times and locations
- 📱 **Community Feed**: Share updates and photos
- 🏆 **Challenges**: Issue and accept competitive challenges
- 👤 **User Profiles**: Track skill levels and stats
- 📲 **PWA Support**: Install as a mobile app

## Tech Stack

**Backend:**
- Django 5.x
- Django REST Framework
- PostgreSQL
- Celery + Redis

**Frontend:**
- React 19
- TypeScript
- Material-UI (MUI)
- Redux Toolkit
- Vite

**Infrastructure:**
- Docker & Docker Compose
- GitHub Actions (CI/CD)
- Cloudflare Tunnel (SSL/Public Access)
- Deployed on Synology NAS

## Quick Start (Development)

```bash
# Clone repository
git clone https://github.com/jitension/pickleball.git
cd pickleball

# Start development environment
docker-compose up -d

# Access the app
# Frontend: http://localhost:8011
# Backend API: http://localhost:8010/api
# Admin: http://localhost:8010/admin
```

## Production Deployment

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions on deploying to Synology NAS.

### Quick Deploy (On NAS)

```bash
cd /volume1/docker/pickleball
docker-compose pull
docker-compose up -d
```

## Architecture

```
┌─────────────────┐
│   Cloudflare    │  (SSL/TLS + DDoS Protection)
│     Tunnel      │
└────────┬────────┘
         │
    ┌────▼────┐
    │  Nginx  │  (Frontend + Reverse Proxy)
    └────┬────┘
         │
    ┌────┴─────────┬──────────┐
    │              │          │
┌───▼───┐    ┌────▼───┐  ┌──▼──────┐
│ React │    │ Django │  │  Celery │
│  SPA  │    │  API   │  │ Workers │
└───────┘    └────┬───┘  └─────────┘
                  │
            ┌─────┴──────┬────────┐
            │            │        │
       ┌────▼────┐  ┌───▼───┐ ┌─▼────┐
       │Postgres │  │ Redis │ │Media │
       │   DB    │  │ Cache │ │Files │
       └─────────┘  └───────┘ └──────┘
```

## Development

### Backend
```bash
cd backend
python manage.py runserver
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Running Tests
```bash
# Backend tests
docker-compose exec backend pytest

# Frontend tests (if configured)
cd frontend && npm test
```

## Environment Variables

See `.env.production` for production configuration.

Key variables:
- `DJANGO_SECRET_KEY` - Django secret key
- `POSTGRES_PASSWORD` - Database password
- `CLOUDFLARE_TUNNEL_TOKEN` - Cloudflare tunnel token
- `ALLOWED_HOSTS` - Comma-separated list of allowed hosts

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - See LICENSE file for details

## Live App

🌐 [https://pickleball.jitension.synology.me](https://pickleball.jitension.synology.me)

---

Made with ❤️ for the pickleball community
