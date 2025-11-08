# XeoDocs Admin Application

The XeoDocs Admin Application is a Next.js-based frontend for managing and administering the XeoDocs platform. This application provides an intuitive interface for administrators to oversee system operations, user management, and content moderation.

## Overview

XeoDocs is a comprehensive documentation platform that leverages microservices architecture for scalable API documentation management. The admin app connects to the XeoDocs API backend to provide administrative controls and insights.

For detailed API specifications and system design documentation, refer to the [xeodocs-api-docs](https://github.com/xeodocs/xeodocs-api-docs) repository, which contains:
- OpenAPI specifications in `openapi/api-design/`
- System architecture and design documents in `docs/`
- Microservices documentation in `docs/microservices/`

## Features

- **User Management**: Administer user accounts and permissions
- **Content Moderation**: Review and manage platform content
- **System Monitoring**: Real-time insights into platform performance
- **API Integration**: Seamless connection with XeoDocs backend services

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm package manager, OR
- Docker and Docker Compose

### Installation

#### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/xeodocs/xeodocs-admin-app.git
   cd xeodocs-admin-app
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Run the development server:
   ```bash
   pnpm run dev
   ```

4. Open [http://localhost:12010](http://localhost:12010) in your browser to view the application.

#### Docker Development

1. Clone the repository:
   ```bash
   git clone https://github.com/xeodocs/xeodocs-admin-app.git
   cd xeodocs-admin-app
   ```

2. Start the development environment:
   ```bash
   docker compose -f docker-compose.dev.yml up --build -d
   ```

3. Open [http://localhost:12010](http://localhost:12010) in your browser to view the application.

The Docker setup provides hot reloading and isolates the development environment, ensuring consistency across different machines.

4. To stop the development environment, run:
    ```bash
    docker compose -f docker-compose.dev.yml down --volumes --rmi local
    ```

### Build for Production

```bash
pnpm run build
pnpm run start
```

## Project Structure

```
/
├── src/
│   └── app/
│       ├── layout.tsx      # Root layout component
│       └── page.tsx        # Main page component
├── Dockerfile.dev          # Development Docker image
├── docker-compose.dev.yml  # Development Docker Compose setup
├── package.json
├── pnpm-lock.yaml
└── README.md
```

## Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run start` - Start production server
- `pnpm run lint` - Run ESLint
- `docker compose -f docker-compose.dev.yml up --build -d` - Start development environment with Docker
- `docker compose -f docker-compose.dev.yml down --volumes --rmi local` - Stop Docker development environment

## Technologies

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Package Manager**: pnpm
- **Backend**: XeoDocs API (see [xeodocs-api-docs](https://github.com/xeodocs/xeodocs-api-docs))

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Related Projects

- [XeoDocs API Documentation](https://github.com/xeodocs/xeodocs-api-docs) - Backend API specs and documentation
- [XeoDocs Website](https://xeodocs.com) - Main platform website
