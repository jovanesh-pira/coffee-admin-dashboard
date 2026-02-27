import { z } from "zod";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

export const imageFileSchema = z
  .instanceof(File)
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.has(file.type),
    "Image must be JPG, PNG, or WEBP"
  )
  .refine((file) => file.size <= MAX_IMAGE_SIZE, "Image must be 5MB or smaller");

export const productSchema = z.object({
  name: z.string().trim().min(2, "Name required").max(120, "Name is too long"),
  description: z
    .string()
    .trim()
    .max(500, "Description must be 500 chars or less")
    .optional(),
  price: z.coerce.number().min(0, "Price must be >= 0"),
  discountPercent: z.coerce
    .number()
    .min(0, "Discount must be >= 0")
    .max(100, "Discount must be <= 100")
    .optional(),
  stock: z.coerce.number().int("Stock must be an integer").min(0, "Stock must be >= 0"),
  category: z.string().trim().min(2, "Category required"),
  image: imageFileSchema.optional(), // optional File input from form
  isAvailable: z.boolean().default(true),
  featured: z.boolean().default(false),
});
// this is one is get in the data from firestore and not put that on it we dont need file as 
export const productFirestoreSchema = productSchema.omit({ image: true }).extend({
  imageUrl: z.string().url("Invalid image URL").optional(), // stored in Firestore
  createdAt: z.unknown().optional(), // Firestore Timestamp/serverTimestamp
  updatedAt: z.unknown().optional(),
});

export const productWithIdSchema = productFirestoreSchema.extend({
  id: z.string().min(1),
});

export type ProductInput = z.input<typeof productSchema>;
export type ProductFormValues = z.output<typeof productSchema>;
export type ProductFirestore = z.infer<typeof productFirestoreSchema>;
export type Product = z.infer<typeof productWithIdSchema>;