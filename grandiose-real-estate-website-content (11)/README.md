# Grandiose Real Estate Ltd - Fullstack Web Application

A comprehensive real estate website for Grandiose Real Estate Ltd, built with Next.js (App Router), PostgreSQL, and Drizzle ORM.

## Overview

This application provides a complete digital platform for Grandiose Real Estate Ltd, including:

- **Property Listings**: Browse, search, and filter residential, commercial, and land properties
- **Company Information**: About Us, Services, Team, and Partners pages
- **User Interaction**: Contact forms, property listing submissions, partnership enquiries
- **Admin Features**: Database management for properties, team members, and partners

## Aveshost / cPanel hosting

This project is configured for Aveshost (cPanel Node.js App Selector, LiteSpeed, Phusion Passenger, PostgreSQL).

- Startup file: `server.js` (or `app.js`)
- Hosting start command: `npm run start:hosting`
- Full steps: see `AVESHOST.md`

## Tech Stack

- **Frontend**: Next.js 16 with App Router, TypeScript, Tailwind CSS
- **Database**: PostgreSQL with Drizzle ORM
- **Icons**: React Icons (Fi icons)
- **Styling**: Tailwind CSS with custom theme

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── enquiries/     # Buyer enquiry submissions
│   │   ├── listings/      # Property listing submissions
│   │   ├── partners/      # Partnership enquiry submissions
│   │   └── health/        # Health check endpoint
│   ├── about/             # About Us page
│   ├── contact/           # Contact page with forms
│   ├── list-property/     # Property listing form
│   ├── partners/          # Partners page
│   ├── properties/        # Properties page with search
│   │   └── [id]/         # Individual property detail
│   ├── services/          # Services page
│   ├── team/              # Team page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx         # Home page
├── components/           # Reusable components
│   ├── Footer.tsx        # Site footer
│   ├── Header.tsx        # Site header with navigation
│   └── PropertyCard.tsx  # Property card component
└── db/                  # Database configuration
    ├── index.ts          # Database connection
    ├── schema.ts         # Database schema definitions
    └── seed.ts           # Database seeding script
```

## Database Schema

### Tables

1. **properties**: Property listings with all details
   - id, title, referenceNumber, description, type, category
   - location, landmarks, price, currency
   - landSize, floorArea, bedrooms, bathrooms, parking
   - amenities, status, isFeatured, images, videoUrl, sitePlanUrl
   - projectName, createdAt, updatedAt

2. **team_members**: Company team members
   - id, name, position, bio, photoUrl, email, phone
   - order, isActive, createdAt

3. **partners**: Business partners
   - id, name, category, description, logoUrl, website
   - contactPerson, contactEmail, contactPhone
   - isActive, order, createdAt

4. **enquiries**: Buyer enquiries
   - id, fullName, telephone, email, propertyOrService
   - preferredLocation, budgetRange, purpose, preferredDate
   - additionalInfo, status, createdAt

5. **property_listings**: Property submissions from owners/agents
   - id, ownerName, ownerEmail, ownerPhone, isAgent
   - agentAuthority, propertyType, location, landSize, floorArea
   - askingPrice, currency, ownershipDetails, description
   - keyFeatures, photographs, videoUrl, sitePlanUrl
   - knownDisputes, encumbrances, preferredMarketing
   - commissionAgreement, status, createdAt

6. **partner_enquiries**: Partnership enquiry submissions
   - id, organizationName, contactPerson, businessCategory
   - location, website, proposedCollaboration, companyProfile
   - email, phone, status, createdAt

7. **inspection_requests**: Property inspection requests
   - id, fullName, telephone, email, propertyId
   - preferredDate, preferredTime, additionalInfo
   - status, createdAt

## Features

### Home Page
- Hero section with company tagline and quick stats
- What We Do section with service highlights
- Property Categories grid
- Featured Project: Verdant Valley
- Featured Properties showcase
- Why Clients Choose Grandiose section
- Call-to-action sections

### About Us Page
- Company profile and mission/vision
- Corporate leadership team profiles
- Core values presentation
- Professional network information
- Company approach and methodology

### Services Page
- Comprehensive service descriptions
- 8 service categories with detailed features
- Service categories summary
- Call-to-action for consultations

### Properties Page
- Property search and filtering
- Featured Project highlight (Verdant Valley)
- Properties grid with pagination
- Property categories navigation
- Disclaimer section

### Property Detail Page
- Property images gallery
- Property information and details
- Amenities and features list
- Quick actions sidebar
- Related properties
- Full property description

### List Property Page
- Complete property listing form
- Owner/Agent information section
- Property details section
- Media upload (photos, video, site plan)
- Additional information section
- Listing process explanation
- Agency terms display

### Team Page
- Corporate leadership profiles
- Professional support network
- Team values presentation

### Partners Page
- Partnership areas overview
- Partner directory grid
- Become a Partner form
- Partnership benefits

### Contact Page
- Contact information display
- Two contact forms (Buyer Enquiry & Property Owner/Agent)
- Tab-based form switching
- Office hours display

## API Endpoints

- **POST /api/enquiries**: Submit buyer enquiry
- **POST /api/listings**: Submit property listing
- **POST /api/partners**: Submit partnership enquiry
- **GET /api/health**: Health check endpoint

## Environment Variables

```env
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db
```

## Setup & Installation

1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Set up database**: Ensure PostgreSQL is running and create the `app_db` database
4. **Apply schema**: `npx drizzle-kit push`
5. **Seed database**: `DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db npx tsx src/db/seed.ts`
6. **Run development server**: `npm run dev`
7. **Build for production**: `npm run build`
8. **Start production server**: `npm run start`

## Customization

### Adding New Properties
Edit the `src/db/seed.ts` file and add new property entries to the `propertyData` array, then re-run the seed script.

### Updating Team Members
Edit the `src/db/seed.ts` file and update the `teamData` array, then re-run the seed script.

### Adding Partners
Edit the `src/db/seed.ts` file and update the `partnerData` array, then re-run the seed script.

### Styling
Customize the theme colors in `src/app/globals.css` by modifying the brand color variables:
- `--brand-color`: #1a4a3a (primary green)
- `--brand-light`: #f0f7f5 (light green background)

## Deployment

The application is ready for deployment to any platform that supports Next.js:
- Vercel (recommended)
- Netlify
- AWS
- Docker containers

## Company Information

**Grandiose Real Estate Ltd**
- **Website**: www.grandiosegh.com
- **Address**: GE-155-1898, Mensah Anteh Avenue, Kwabenya Hills, Accra, Ghana
- **Postal**: P.O. Box LT 143, Laterbiokoshie, Accra, Ghana
- **Email**: grandioseestate@gmail.com
- **Phone**: +233 24 948 8135 / 0302 918 303
- **Tagline**: Building Communities. Creating Value. Delivering Excellence.

## License

This project is proprietary to Grandiose Real Estate Ltd.
