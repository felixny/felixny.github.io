# Portfolio Website

A modern, responsive portfolio website built with Next.js, TypeScript, and Tailwind CSS. This project is designed to run seamlessly across multiple platforms including Windows, macOS, and Linux.

## 🌟 Features

- **Cross-platform compatibility** - Runs on Windows, macOS, and Linux
- **Modern tech stack** - Next.js 14, TypeScript, Tailwind CSS
- **Responsive design** - Mobile-first approach with beautiful UI
- **Dark/Light mode** - Theme switching with system preference detection
- **Docker support** - Containerized deployment for any platform
- **CI/CD ready** - GitHub Actions workflows for automated builds
- **Performance optimized** - Static site generation with Next.js

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** 8.0.0 or higher
- **Git** (for version control)

### Platform-Specific Setup

#### 🪟 Windows

1. **Install Node.js:**
   ```powershell
   # Using Chocolatey
   choco install nodejs

   # Or download from https://nodejs.org/
   ```

2. **Clone and setup:**
   ```cmd
   git clone https://github.com/felixny/felixny.github.io.git
   cd felixny.github.io
   scripts\setup.bat
   ```

3. **Start development:**
   ```cmd
   npm run dev
   ```

#### 🍎 macOS

1. **Install Node.js:**
   ```bash
   # Using Homebrew
   brew install node

   # Or using nvm
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   nvm install 18
   nvm use 18
   ```

2. **Clone and setup:**
   ```bash
   git clone https://github.com/felixny/felixny.github.io.git
   cd felixny.github.io
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   ```

3. **Start development:**
   ```bash
   npm run dev
   ```

#### 🐧 Linux (Ubuntu/Debian)

1. **Install Node.js:**
   ```bash
   # Using NodeSource repository
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Or using snap
   sudo snap install node --classic
   ```

2. **Clone and setup:**
   ```bash
   git clone https://github.com/felixny/felixny.github.io.git
   cd felixny.github.io
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   ```

3. **Start development:**
   ```bash
   npm run dev
   ```

## 🐳 Docker Support

### Using Docker Compose (Recommended)

```bash
# Development with hot reload
npm run docker:dev

# Production build and run
docker-compose up --build
```

### Using Docker directly

```bash
# Build the image
npm run docker:build

# Run the container
npm run docker:run
```

## 📋 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run export` | Export static site |
| `npm run preview` | Preview production build |
| `npm run clean` | Clean build artifacts |
| `npm run reinstall` | Clean and reinstall dependencies |
| `npm run check` | Run type check and linting |
| `npm run format` | Format code with Prettier |
| `npm run docker:build` | Build Docker image |
| `npm run docker:run` | Run Docker container |
| `npm run docker:dev` | Run with Docker Compose |

## 🚀 Deployment

### GitHub Pages

```bash
npm run deploy:github
```

### Vercel

```bash
npm run deploy:vercel
```

### Netlify

```bash
npm run deploy:netlify
```

### Docker

```bash
# Build and push to registry
docker build -t your-username/portfolio .
docker push your-username/portfolio

# Deploy to any platform supporting Docker
```

## 🛠️ Development

### Project Structure

```
├── src/
│   ├── app/                 # Next.js app directory
│   ├── components/          # React components
│   └── lib/                 # Utility functions
├── public/                  # Static assets
├── scripts/                 # Platform-specific scripts
├── .github/workflows/       # CI/CD configurations
├── Dockerfile              # Production Docker image
├── Dockerfile.dev          # Development Docker image
├── docker-compose.yml      # Docker Compose configuration
└── README.md               # This file
```

### Environment Variables

Copy `env.example` to `.env.local` and configure:

```bash
# Application
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Analytics (Optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=your-ga-id
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=your-domain.com

# External APIs (Optional)
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your-unsplash-key
```

## 🔧 Troubleshooting

### Common Issues

#### Node.js Version Issues
```bash
# Check Node.js version
node --version

# Should be 18.0.0 or higher
# If not, update using your platform's method
```

#### Permission Issues (Linux/macOS)
```bash
# Fix script permissions
chmod +x scripts/setup.sh

# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
```

#### Windows Path Issues
```cmd
# Use Windows-style paths
npm run dev
# Instead of ./scripts/setup.sh
```

#### Docker Issues
```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker build --no-cache -t portfolio .
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Radix UI](https://www.radix-ui.com/) - UI components
- [Lucide React](https://lucide.dev/) - Icons

## 📞 Contact

- **GitHub**: [@felixny](https://github.com/felixny)
- **LinkedIn**: [Felix Ny](https://linkedin.com/in/felixny)
- **Email**: [Contact Form](https://felixny.github.io/#contact)

---

⭐ Star this repository if you found it helpful!
