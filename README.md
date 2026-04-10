# Coffee Admin Dashboard

A full-stack coffee shop admin dashboard built with React, TypeScript, Tailwind CSS, and Firebase. Includes a customer-facing storefront and a protected admin panel.

---

## Features

### Storefront
- Browse products with images, prices, and discounts
- Add to cart and checkout
- Order tracking

### Admin Panel
- Product management — create, delete, toggle availability
- Image upload to Firebase Storage
- Orders management
- Customer list
- Dashboard with sales stats

### Auth
- Register and login with Firebase Auth
- Role-based access — admin routes protected
- Persistent session

---

## Tech Stack

| Area | Tech |
|---|---|
| Framework | React 18 + TypeScript |
| Styling | Tailwind CSS |
| Routing | React Router v6 |
| Forms | React Hook Form + Zod |
| State | Redux Toolkit |
| Backend | Firebase (Firestore + Storage + Auth) |
| Charts | Recharts |
| Build | Vite |

---

## Project Structure

```
src/
├── app/              # Layouts, routing, providers
├── features/
│   ├── admin/        # Admin pages, hooks, components
│   ├── auth/         # Auth context, pages, services
│   ├── cart/         # Cart state, drawer, checkout
│   └── products/     # Product pages, hooks, services
└── shared/           # Shared UI components
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

> You need to add your own Firebase config in `src/app/firebase/firebase.ts`

---

## Environment

Create a `.env` file in the root:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```
