import { db } from "./index";
import {
  partners,
  properties,
  siteSettings,
  teamMembers,
} from "./schema";
import { defaultSiteSettings } from "@/lib/site";
import { ensureDefaultAdmins } from "@/lib/auth";

async function seed() {
  console.log("Seeding database...");

  await db.delete(properties);
  await db.delete(teamMembers);
  await db.delete(partners);

  await ensureDefaultAdmins();
  await db.delete(siteSettings);
  await db.insert(siteSettings).values(defaultSiteSettings);

  await db.insert(teamMembers).values([
    {
      name: "GLADYS ABODAKPI",
      position: "Managing Director",
      bio: "Provides executive leadership and management oversight, supporting corporate growth, project delivery, stakeholder engagement and the company's commitment to quality real estate services.",
      order: 1,
      isActive: true,
    },
  ]);

  await db.insert(partners).values([
    {
      name: "Partner Company 1",
      category: "Developer",
      description: "Strategic development partner for residential and commercial projects",
      order: 1,
      isActive: true,
    },
    {
      name: "Partner Company 2",
      category: "Law Firm",
      description: "Legal due diligence, conveyancing, and regulatory compliance support",
      order: 2,
      isActive: true,
    },
    {
      name: "Partner Company 3",
      category: "Bank",
      description: "Financial partner providing development capital and financing solutions",
      order: 3,
      isActive: true,
    },
    {
      name: "Partner Company 4",
      category: "Supplier",
      description: "Building materials supplier for construction and finishing materials",
      order: 4,
      isActive: true,
    },
    {
      name: "Partner Company 5",
      category: "Construction",
      description: "Construction and infrastructure development partner",
      order: 5,
      isActive: true,
    },
    {
      name: "Partner Company 6",
      category: "Architecture",
      description: "Architectural design and planning services",
      order: 6,
      isActive: true,
    },
  ]);

  await db.insert(properties).values([
    {
      title: "Verdant Valley - Luxury Smart Home",
      referenceNumber: "GVV-001",
      description:
        "Verdant Valley is Grandiose Real Estate Ltd's flagship smart-community concept. A 20-acre community designed around innovative living, smart-home technology and sustainable practices.",
      type: "House",
      category: "Gated & Smart Communities",
      location: "Accra, Ghana",
      landmarks: "Near Kwabenya Hills, easy access to major roads",
      price: "1500000.00",
      currency: "GHS",
      landSize: "0.50 acres",
      floorArea: "350 sqm",
      bedrooms: 4,
      bathrooms: 4,
      parking: 2,
      amenities:
        "Smart home technology, Solar panels, Backup power, Water treatment, Security system, Green spaces, Community park, Walking trails",
      status: "available",
      isFeatured: true,
      projectName: "Verdant Valley",
      images: [
        "https://images.pexels.com/photos/38975398/pexels-photo-38975398.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200",
      ],
    },
    {
      title: "Modern Executive Residence",
      referenceNumber: "GRE-002",
      description:
        "Luxury executive residence with contemporary design, premium finishes, and modern amenities.",
      type: "House",
      category: "Houses for Sale",
      location: "East Legon, Accra",
      landmarks: "Close to shopping centers and international schools",
      price: "2500000.00",
      currency: "GHS",
      landSize: "0.75 acres",
      floorArea: "450 sqm",
      bedrooms: 5,
      bathrooms: 5,
      parking: 3,
      amenities: "Swimming pool, Gym, Backup generator, CCTV, Smart lighting, Air conditioning",
      status: "available",
      isFeatured: true,
      images: [
        "https://images.pexels.com/photos/8134821/pexels-photo-8134821.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200",
      ],
    },
    {
      title: "Commercial Office Space",
      referenceNumber: "GRE-003",
      description:
        "Prime commercial office space in a strategic location. Ideal for businesses looking for a professional environment with modern facilities.",
      type: "Commercial",
      category: "Commercial Properties",
      location: "Airport City, Accra",
      landmarks: "Near Kotoka International Airport",
      price: "5000000.00",
      currency: "GHS",
      floorArea: "800 sqm",
      bathrooms: 4,
      parking: 10,
      amenities: "High-speed internet, Conference rooms, 24/7 security, Backup power, Elevators, Parking",
      status: "available",
      isFeatured: true,
      images: [
        "https://images.pexels.com/photos/27604148/pexels-photo-27604148.png?auto=compress&cs=tinysrgb&fit=crop&w=1200",
      ],
    },
    {
      title: "Residential Land - Title Deed",
      referenceNumber: "GRE-004",
      description:
        "Prime residential land with clear title deed. Perfect for building your dream home or investment development.",
      type: "Land",
      category: "Residential Land",
      location: "Kwabenya, Accra",
      landmarks: "Near Mensah Anteh Avenue",
      price: "350000.00",
      currency: "GHS",
      landSize: "1.20 acres",
      amenities: "Access road, Electricity nearby, Water available",
      status: "available",
      isFeatured: false,
      images: [
        "https://images.pexels.com/photos/24419877/pexels-photo-24419877.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200",
      ],
    },
    {
      title: "Eco-Friendly Smart Home",
      referenceNumber: "GRE-009",
      description:
        "Sustainable smart home with energy-efficient systems, solar power, and eco-friendly materials.",
      type: "House",
      category: "Houses for Sale",
      location: "Haatso, Accra",
      landmarks: "Quiet residential area",
      price: "1800000.00",
      currency: "GHS",
      landSize: "0.60 acres",
      floorArea: "300 sqm",
      bedrooms: 4,
      bathrooms: 4,
      parking: 2,
      amenities:
        "Solar panels, Smart home system, Energy-efficient appliances, Water recycling, Green roof",
      status: "available",
      isFeatured: true,
      images: [
        "https://images.pexels.com/photos/28681441/pexels-photo-28681441.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200",
      ],
    },
  ]);

  console.log("Seeding complete!");
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
