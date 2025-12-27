export const AVAILABLE_UOMS = [
  // --- GENERAL / COUNTING ---
  { code: "each", label_vi: "Cái", label_en: "Each", type: "count" },
  { code: "piece", label_vi: "Chiếc", label_en: "Piece", type: "count" },
  { code: "set", label_vi: "Bộ", label_en: "Set", type: "count" },
  { code: "pair", label_vi: "Đôi/Cặp", label_en: "Pair", type: "count" },
  { code: "doz", label_vi: "Tá", label_en: "Dozen", type: "count" },

  // --- PACKAGING / CONTAINERS (Crucial for Inventory) ---
  { code: "box", label_vi: "Hộp", label_en: "Box", type: "pack" }, // Small consumer box
  { code: "carton", label_vi: "Thùng", label_en: "Carton", type: "pack" }, // Big shipping box
  { code: "pack", label_vi: "Gói", label_en: "Pack", type: "pack" },
  { code: "bag", label_vi: "Bao/Túi", label_en: "Bag", type: "pack" }, // e.g., Rice, Flour
  { code: "roll", label_vi: "Cuộn", label_en: "Roll", type: "pack" }, // e.g., Tape, Fabric
  { code: "bundle", label_vi: "Bó", label_en: "Bundle", type: "pack" }, // e.g., Vegetables, Pipes
  { code: "can", label_vi: "Lon", label_en: "Can", type: "pack" }, // e.g., Soda, Paint
  { code: "bottle", label_vi: "Chai", label_en: "Bottle", type: "pack" },
  { code: "jar", label_vi: "Hũ/Lọ", label_en: "Jar", type: "pack" }, // e.g., Cosmetics, Jam
  { code: "tray", label_vi: "Khay", label_en: "Tray", type: "pack" }, // e.g., Eggs, Meat
  { code: "pallet", label_vi: "Pallet", label_en: "Pallet", type: "pack" },

  // --- WEIGHT / MASS ---
  { code: "mg", label_vi: "mg", label_en: "Milligram", type: "weight" },
  { code: "g", label_vi: "g (Gam)", label_en: "Gram", type: "weight" },
  { code: "kg", label_vi: "kg", label_en: "Kilogram", type: "weight" },
  { code: "ton", label_vi: "Tấn", label_en: "Ton", type: "weight" },

  // --- VOLUME / LIQUID ---
  { code: "ml", label_vi: "ml", label_en: "Milliliter", type: "volume" },
  { code: "l", label_vi: "Lít", label_en: "Liter", type: "volume" },
  { code: "gal", label_vi: "Galông", label_en: "Gallon", type: "volume" }, // US/UK specific

  // --- LENGTH / AREA (Construction/Textile) ---
  { code: "mm", label_vi: "mm", label_en: "Millimeter", type: "length" },
  { code: "cm", label_vi: "cm", label_en: "Centimeter", type: "length" },
  { code: "m", label_vi: "Mét", label_en: "Meter", type: "length" },
  { code: "m2", label_vi: "m²", label_en: "Square Meter", type: "area" },

  // --- PHARMACEUTICAL / MEDICAL (Specific context) ---
  { code: "tablet", label_vi: "Viên", label_en: "Tablet", type: "count" },
  { code: "capsule", label_vi: "Viên nang", label_en: "Capsule", type: "count" },
  { code: "blister", label_vi: "Vỉ", label_en: "Blister", type: "pack" },
  { code: "ampoule", label_vi: "Ống", label_en: "Ampoule", type: "volume" }, // Injection liquid
  { code: "vial", label_vi: "Lọ", label_en: "Vial", type: "pack" }, 
] as const;

// Optional: Helper types for TypeScript usage
export type UnitOfMeasure = typeof AVAILABLE_UOMS[number];
export type UnitCode = UnitOfMeasure['code'];