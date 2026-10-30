This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Square booking setup

The booking form loads services and availability from Square and submits bookings
through server-side API routes. Card details are tokenized by Square's Web
Payments SDK; the access token stays on the server.

For local development, create `.env.local` in the project root:

```dotenv
SQUARE_ENVIRONMENT=production
SQUARE_ACCESS_TOKEN=your_private_square_access_token
NEXT_PUBLIC_SQUARE_APPLICATION_ID=your_square_application_id
NEXT_PUBLIC_SQUARE_LOCATION_ID=your_square_location_id
```

Never commit `.env.local` or expose `SQUARE_ACCESS_TOKEN` in browser code. For
Hostinger, deploy this project as a Node.js/Next.js application rather than a
static export, and configure the same variables in the server-side environment.
The production domain must use HTTPS and be allowed for Web Payments in the
Square Developer Dashboard.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
