import {
  boolean,
  integer,
  jsonb,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  referenceNumber: varchar("reference_number", { length: 100 }).unique(),
  description: text("description").notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  category: varchar("category", { length: 100 }),
  location: varchar("location", { length: 255 }).notNull(),
  landmarks: text("landmarks"),
  price: numeric("price", { precision: 15, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("GHS"),
  landSize: varchar("land_size", { length: 100 }),
  floorArea: varchar("floor_area", { length: 100 }),
  bedrooms: integer("bedrooms"),
  bathrooms: integer("bathrooms"),
  parking: integer("parking"),
  amenities: text("amenities"),
  status: varchar("status", { length: 20 }).default("available"),
  isFeatured: boolean("is_featured").default(false),
  images: jsonb("images").$type<string[]>().default([]),
  videoUrl: text("video_url"),
  sitePlanUrl: text("site_plan_url"),
  projectName: varchar("project_name", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  icon: varchar("icon", { length: 50 }).notNull().default("ShoppingBag"),
  order: integer("order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  position: varchar("position", { length: 255 }).notNull(),
  bio: text("bio"),
  photoUrl: text("photo_url"),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  order: integer("order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const partners = pgTable("partners", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  description: text("description").notNull(),
  logoUrl: text("logo_url"),
  website: text("website"),
  contactPerson: varchar("contact_person", { length: 255 }),
  contactEmail: varchar("contact_email", { length: 255 }),
  contactPhone: varchar("contact_phone", { length: 50 }),
  isActive: boolean("is_active").default(true),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const enquiries = pgTable("enquiries", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  telephone: varchar("telephone", { length: 50 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  propertyOrService: text("property_or_service").notNull(),
  preferredLocation: text("preferred_location"),
  budgetRange: varchar("budget_range", { length: 100 }),
  purpose: varchar("purpose", { length: 50 }),
  preferredDate: timestamp("preferred_date"),
  additionalInfo: text("additional_info"),
  status: varchar("status", { length: 20 }).default("new"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const propertyListings = pgTable("property_listings", {
  id: serial("id").primaryKey(),
  ownerName: varchar("owner_name", { length: 255 }).notNull(),
  ownerEmail: varchar("owner_email", { length: 255 }).notNull(),
  ownerPhone: varchar("owner_phone", { length: 50 }).notNull(),
  propertyType: varchar("property_type", { length: 50 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  landSize: varchar("land_size", { length: 100 }),
  floorArea: varchar("floor_area", { length: 100 }),
  askingPrice: numeric("asking_price", { precision: 15, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("GHS"),
  ownershipDetails: text("ownership_details"),
  description: text("description").notNull(),
  keyFeatures: text("key_features"),
  photographs: jsonb("photographs").$type<string[]>().default([]),
  videoUrl: text("video_url"),
  sitePlanUrl: text("site_plan_url"),
  knownDisputes: text("known_disputes"),
  encumbrances: text("encumbrances"),
  preferredMarketing: text("preferred_marketing"),
  status: varchar("status", { length: 20 }).default("pending"),
  isAgent: boolean("is_agent").default(false),
  agentAuthority: text("agent_authority"),
  commissionAgreement: text("commission_agreement"),
  inspectionFeePaid: boolean("inspection_fee_paid").default(false),
  convertedPropertyId: integer("converted_property_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const partnerEnquiries = pgTable("partner_enquiries", {
  id: serial("id").primaryKey(),
  organizationName: varchar("organization_name", { length: 255 }).notNull(),
  contactPerson: varchar("contact_person", { length: 255 }).notNull(),
  businessCategory: varchar("business_category", { length: 100 }).notNull(),
  location: varchar("location", { length: 255 }),
  website: text("website"),
  proposedCollaboration: text("proposed_collaboration").notNull(),
  companyProfile: text("company_profile"),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  status: varchar("status", { length: 20 }).default("new"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const inspectionRequests = pgTable("inspection_requests", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  telephone: varchar("telephone", { length: 50 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  propertyId: integer("property_id").references(() => properties.id),
  preferredDate: timestamp("preferred_date").notNull(),
  preferredTime: varchar("preferred_time", { length: 50 }),
  additionalInfo: text("additional_info"),
  status: varchar("status", { length: 20 }).default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 100 }).unique(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  passwordHash: text("password_hash").notNull(),
  role: varchar("role", { length: 30 }).notNull().default("admin"),
  isActive: boolean("is_active").default(true),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const siteSettings = pgTable("site_settings", {
  id: integer("id").primaryKey().default(1),
  siteName: varchar("site_name", { length: 255 }).notNull().default("GRANDIOSE REAL ESTATE LTD"),
  siteSubtitle: varchar("site_subtitle", { length: 255 }).notNull().default("Real Estate Ltd"),
  tagline: varchar("tagline", { length: 255 }).notNull().default("Building Communities. Creating Value. Delivering Excellence."),
  countryYear: varchar("country_year", { length: 100 }).notNull().default("Ghana | 2026"),
  website: varchar("website", { length: 255 }).notNull().default("www.grandiosegh.com"),
  officeAddress: text("office_address").notNull(),
  postalAddress: text("postal_address").notNull(),
  contactEmail: varchar("contact_email", { length: 255 }).notNull(),
  contactPhone: varchar("contact_phone", { length: 100 }).notNull(),
  whatsappNumber: varchar("whatsapp_number", { length: 50 }).notNull().default("+233249488135"),
  heroEyebrow: varchar("hero_eyebrow", { length: 255 }).notNull(),
  heroHeadline: text("hero_headline").notNull(),
  heroSubcopy: text("hero_subcopy").notNull(),
  heroImageUrl: text("hero_image_url"),
  ctaPrimaryLabel: varchar("cta_primary_label", { length: 100 }).notNull().default("Explore Properties"),
  ctaPrimaryHref: varchar("cta_primary_href", { length: 255 }).notNull().default("/properties"),
  ctaSecondaryLabel: varchar("cta_secondary_label", { length: 100 }).notNull().default("List Your Property"),
  ctaSecondaryHref: varchar("cta_secondary_href", { length: 255 }).notNull().default("/list-property"),
  ctaTertiaryLabel: varchar("cta_tertiary_label", { length: 100 }).notNull().default("Speak With Grandiose"),
  ctaTertiaryHref: varchar("cta_tertiary_href", { length: 255 }).notNull().default("/contact"),
  statsProperties: varchar("stats_properties", { length: 50 }).notNull().default("49+"),
  statsPortfolioValue: varchar("stats_portfolio_value", { length: 50 }).notNull().default("GHS 38.55m+"),
  statsSatisfaction: varchar("stats_satisfaction", { length: 50 }).notNull().default("90%+"),
  statsQuality: varchar("stats_quality", { length: 50 }).notNull().default("100%"),
  inspectionFee: varchar("inspection_fee", { length: 50 }).notNull().default("GHS 300"),
  salesCommission: varchar("sales_commission", { length: 50 }).notNull().default("5% of final agreed sale price"),
  rentalCommission: varchar("rental_commission", { length: 50 }).notNull().default("10%"),
  footerBlurb: text("footer_blurb").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Property = typeof properties.$inferSelect;
export type NewProperty = typeof properties.$inferInsert;
export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;
export type TeamMember = typeof teamMembers.$inferSelect;
export type NewTeamMember = typeof teamMembers.$inferInsert;
export type Partner = typeof partners.$inferSelect;
export type NewPartner = typeof partners.$inferInsert;
export type Enquiry = typeof enquiries.$inferSelect;
export type NewEnquiry = typeof enquiries.$inferInsert;
export type PropertyListing = typeof propertyListings.$inferSelect;
export type NewPropertyListing = typeof propertyListings.$inferInsert;
export type PartnerEnquiry = typeof partnerEnquiries.$inferSelect;
export type NewPartnerEnquiry = typeof partnerEnquiries.$inferInsert;
export type InspectionRequest = typeof inspectionRequests.$inferSelect;
export type NewInspectionRequest = typeof inspectionRequests.$inferInsert;
export type Admin = typeof admins.$inferSelect;
export type NewAdmin = typeof admins.$inferInsert;
export type SiteSettings = typeof siteSettings.$inferSelect;
export type NewSiteSettings = typeof siteSettings.$inferInsert;
