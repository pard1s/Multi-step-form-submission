# Multi-Step Form Application

This repository hosts a robust multi-step form application designed to efficiently collect and process user data through a guided, interactive interface. The application features dynamic step transitions, comprehensive client-side and server-side validation, persistent data storage, and automated email confirmations upon submission. This project demonstrates a modern web development approach leveraging a powerful combination of contemporary frameworks, libraries, and tools.

## Core Features & Technical Implementation

- **Animated Multi-Step Navigation:** Implemented using `framer-motion`'s `AnimatePresence` and `motion.div` components, providing smooth and directional transitions between form steps. The `x` property of the `motion.div` is dynamically adjusted based on navigation direction (forward/backward) to create an intuitive user experience.
- **Client-Side Form Management & Validation:** Utilizes `react-hook-form` for efficient form state management, submission handling, and integration with `Zod` for schema-based validation. This ensures real-time feedback to the user and maintains data integrity.
- **Server-Side Data Persistence:** Form submissions are handled by a Next.js API route (`/api/form`) that performs server-side `Zod` validation and persists data to a PostgreSQL database via `Prisma` ORM. The `Submission` model in `prisma/schema.prisma` is designed to store all collected data, including nested JSON fields for dynamic arrays like skills and education.
- **Email Confirmation System:** Integrates with the `Resend` API to dispatch automated email confirmations to users upon successful form submission. The email content is dynamically generated, providing a summary of the submitted data.
- **Modern User Interface:** Built with `shadcn/ui` components, which are highly customizable and accessibility-focused, underpinned by `Tailwind CSS` for utility-first styling. This ensures a responsive and visually consistent design across the application.
- **Global State Management:** Employs `Zustand` for a lightweight and performant global state management solution, specifically for handling the multi-step form's progress, data, and navigation logic.

## Technology Stack

This project is built upon a carefully selected set of modern web technologies:

- **Next.js:** Chosen for its powerful server-side rendering (SSR), API routes, and optimized build features, providing a solid foundation for a performant React application.
- **TypeScript:** Essential for type safety across the entire codebase, reducing runtime errors and improving code maintainability and developer experience.
- **Tailwind CSS:** A utility-first CSS framework enabling rapid UI development and highly customizable designs, integrated seamlessly with `shadcn/ui`.
- **shadcn/ui:** Provides a set of pre-built, accessible, and customizable UI components, accelerating development while maintaining design consistency and adherence to best practices.
- **Framer Motion:** A production-ready animation library for React, used here for declarative and performant UI animations, particularly for transitions between form steps.
- **Prisma:** A next-generation ORM simplifying database access with type-safe queries and an intuitive schema definition language, connected to a PostgreSQL database for robust data storage.
- **PostgreSQL:** A powerful, open-source relational database, selected for its reliability, extensive feature set, and strong support for structured data.
- **Zustand:** A minimalist state management library, ideal for managing complex form state across multiple components without excessive boilerplate.
- **React Hook Form & Zod:** These libraries work in conjunction to provide a robust solution for form validation. `React Hook Form` optimizes re-renders and provides a flexible API, while `Zod` offers powerful schema validation with TypeScript inference.
- **Resend:** An API-first platform for sending transactional emails, chosen for its developer-friendly API and reliability in delivering email confirmations.

## Getting Started

To set up and run this project locally, follow these instructions:

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd multi-step-form
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Configuration

Create a `.env` file in the project root with the following variables:

```
DATABASE_URL="YOUR_DATABASE_CONNECTION_STRING"
RESEND_API_KEY="YOUR_RESEND_API_KEY"
```

- `DATABASE_URL`: Connection string for your PostgreSQL database (e.g., `postgresql://user:password@host:port/database`).
- `RESEND_API_KEY`: Your API key obtained from the [Resend dashboard](https://resend.com/).

### 4. Database Initialization

Apply the Prisma schema to your database:

```bash
npx prisma db push
```

For subsequent schema modifications, use Prisma Migrations:

```bash
npx prisma migrate dev --name <migration-name>
```

### 5. Local Development Server

Start the Next.js development server:

```bash
npm run dev
# or
yarn dev
```

The application will be accessible at [http://localhost:3000](http://localhost:3000).

### 6. Production Build

Generate an optimized production build:

```bash
npm run build
# or
yarn build
```

This command compiles and optimizes the application for deployment.
