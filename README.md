# FabricHub - eCommerce Shop

A modern eCommerce application built with Next.js, TypeScript, and Redux Toolkit. Features product listing, search, favorites, and full CRUD operations with a clean, responsive UI.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI
- **State Management:** Redux Toolkit with Redux Persist
- **API Client:** Axios
- **Authentication:** NextAuth.js
- **Form Management:** Formik with Zod validation
- **Notifications:** Sonner

## Features

### Product Listing Page (/)

- Fetch and display products from DummyJSON API
- Product cards showing title, price, rating, category, and image
- Add to favorites functionality with Redux persistence
- Infinite scroll pagination
- Real-time search with debouncing
- Category and price filtering
- Sort by price, rating, or title

### Product Details Page (/product/[id])

- Detailed product information
- Image gallery
- Brand, stock, and rating display
- Edit and delete functionality (authenticated users)
- Add to favorites

### Favorites Page (/favorites)

- View all favorited products
- Remove from favorites
- Protected route (requires authentication)

### Product Management

- **Create:** Add new products with form validation
- **Edit:** Update existing products with pre-filled forms
- **Delete:** Remove products with confirmation dialog

### Additional Features

- Dark mode toggle with Redux persistence
- Toast notifications for user feedback
- Loading states with skeleton components
- Error handling with user-friendly messages
- Responsive design for all screen sizes
- Mock authentication system

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd fabric-hub
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory:

```env
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Create a `.env.local` file with the following variables:

- `NEXTAUTH_SECRET` - Secret key for NextAuth.js JWT encryption (required)
- `NEXTAUTH_URL` - Base URL of your application (optional, defaults to http://localhost:3000 in development)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page (product listing)
│   ├── product/[id]/      # Product detail page
│   ├── favorites/         # Favorites page
│   └── login/             # Login page
├── components/             # React components
│   ├── common/            # Shared components
│   ├── layout/            # Layout components
│   ├── pages/             # Page-specific components
│   ├── states/            # Loading, error, empty states
│   └── ui/                # Shadcn UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and API client
│   ├── api/               # API functions
│   └── utils/             # Helper functions
├── providers/             # React context providers
├── schemas/               # Zod validation schemas
├── store/                 # Redux store configuration
│   ├── slices/            # Redux slices
│   └── selectors/         # Redux selectors
├── types/                 # TypeScript type definitions
└── utils/                 # Utility functions
```

## API Integration

The application uses [DummyJSON](https://dummyjson.com/docs/products) as the API provider. All product data is fetched from their endpoints:

- `GET /products` - List all products
- `GET /products/search?q=query` - Search products
- `GET /products/:id` - Get product by ID
- `GET /products/categories` - Get all categories
- `GET /products/category/:category` - Get products by category
- `POST /products/add` - Create product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

Note: DummyJSON is a mock API and does not persist data. Local products created, edited, or deleted are persisted using Redux Persist.

## Authentication

The application includes a mock authentication system for demonstration purposes.

**Test Credentials:**

- Email: `admin@nati.com`
- Password: `password123`

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Key Implementation Details

- **State Persistence:** Redux Persist stores favorites, theme, and local products in localStorage
- **Infinite Scroll:** Card-based intersection observer for smooth pagination
- **Form Validation:** Zod schemas with Formik integration
- **Error Handling:** Centralized error utilities with type-safe error messages
- **Type Safety:** Full TypeScript coverage with strict type checking
- **Component Architecture:** Separation of concerns with page components and UI components
- **Performance:** Memoization, code splitting, and optimized re-renders
