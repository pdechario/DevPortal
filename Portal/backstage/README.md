# DevPortal

A [Backstage](https://backstage.io) instance serving as a unified developer portal for managing the software catalog, platform entities, and developer infrastructure.

## Overview

DevPortal is a centralized platform that provides visibility and management of:

- **Software Catalog**: Browse and manage all services, libraries, and tools
- **Organization Structure**: View users, teams, and organizational hierarchy
- **Kubernetes Resources**: Manage and monitor Kubernetes deployments
- **Technical Documentation**: Host and discover technical docs for components
- **Scaffolder Templates**: Standardized templates for creating new services and components
- **Search**: Unified search across the entire catalog
- **Notifications**: Stay updated on catalog events and changes

## Key Features

- **Catalog Management**: Register and track platform entities with consistent naming conventions
- **User & Group Management**: Organize teams and users within the organization
- **Tech Stack Documentation**: Auto-generated technical documentation for registered components
- **Service Templates**: Standardized scaffolder templates for creating new platform entities
- **Component Discovery**: Browse available services, libraries, and infrastructure components
- **Kubernetes Integration**: View and manage Kubernetes workloads

## Getting Started

### Prerequisites

- Node.js 22 or 24
- Yarn 4.13.0+

### Running the Service

```sh
yarn install
yarn start
```

The application will be available at `http://localhost:3000` and displays the software catalog as the landing page.

### Available Commands

- `yarn start` - Start both frontend and backend in development mode
- `yarn build:all` - Build all packages
- `yarn build:backend` - Build the backend service
- `yarn test` - Run tests
- `yarn lint` - Lint code
- `yarn fix` - Apply automatic fixes

## Project Structure

- `packages/app/` - Frontend React application and UI configuration
- `packages/backend/` - Backend API and plugin integrations
- `plugins/` - Custom Backstage plugins and extensions
- `examples/` - Example entities and configurations
- `catalog-info.yaml` - DevPortal's own component registration

## Architecture

DevPortal is built on the Backstage open-source platform with the following core plugins:

- **Catalog Plugin** - Central registry for all platform entities
- **Organization Plugin** - User and group management
- **Home Plugin** - Customizable dashboard landing page
- **Kubernetes Plugin** - Kubernetes cluster integration
- **TechDocs Plugin** - Markdown-based documentation discovery
- **Scaffolder Plugin** - Template-driven entity creation
- **Search Plugin** - Unified search across all entities
- **Notifications Plugin** - Event notifications and updates

## Configuration

Configuration is handled through `app-config.yaml` and `app-config.production.yaml`. Key configuration includes:

- Backend and plugin configuration
- Catalog locations (where entity definitions are loaded from)
- Organization structure and team definitions
- UI extensions and plugins to enable

## Development

This is a monorepo managed with Yarn workspaces. Each package and plugin is independently buildable and testable.
