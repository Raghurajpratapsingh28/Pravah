
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discount: number; // percentage
  image: string;
  images: string[];
  category: string;
  categoryId: string;
  rating: number;
  reviewCount: number;
  specifications?: Record<string, string>[];
  variants?: Array<{
    id: string;
    name: string;
    options: Array<{
      id: string;
      value: string;
      available: boolean;
    }>;
  }>;
  stock: number;
  featured: boolean;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  productCount: number;
  description?: string;
}
// Categories
export const categories: Category[] = [
  {
    id: "weaving",
    name: "Weaving",
    image: "https://imgs.search.brave.com/WmSKbAeIjNLRJ8l709K25S7OciLNj2LQWkF6fR17L8k/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/c2hvcGlmeS5jb20v/cy9maWxlcy8xLzE4/MTUvMzg5My9maWxl/cy8xMy4tYmFjay13/aXRoLWhlbS1iYXN0/ZWRfMjA0OHgyMDQ4/LmpwZz92PTE2NDU4/MDM1ODc",
    productCount: 30,
    description: "Traditional silk weaving from Assam, including Muga, Pat, and Eri silk."
  },
  {
    id: "bamboo-crafts",
    name: "Bamboo & Cane Crafts",
    image: "https://imgs.search.brave.com/wtkPcgbgtwSI4bo2XB1NWiD7YPFMjL3T2gBiZ92g8NU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2RjLzQ2/L2E0L2RjNDZhNDBh/YjRiODU4ZWEzZjlk/OTMzOWMxYTM5NDNh/LmpwZw",
    productCount: 25,
    description: "Handcrafted household items, furniture, and decor made from bamboo and cane."
  },
  {
    id: "pottery",
    name: "Pottery & Terracotta",
    image: "https://imgs.search.brave.com/8fmc9V6tfssiiAtT_XdqcEtBG_wMt9qFSzLClVtkVnU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/c2hvcGlmeS5jb20v/cy9maWxlcy8xLzI2/OTAvMDEwNi9maWxl/cy9JbmRpYW4tcG90/dGVyeS1jcmFmdHMx/MS0xNjAweDkwMF80/ODB4NDgwLmpwZz92/PTE3MTA0MTIxOTk",
    productCount: 18,
    description: "Exquisite pottery and terracotta art from villages like Asharikandi."
  },
  {
    id: "wood-carving",
    name: "Wood Carving",
    image: "https://imgs.search.brave.com/2NRa7jqdXVnocQhPXIY14ulnM15PMpqhc0fJVxXhYZE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9lYWRu/LXdjMDItMTE3MDMw/ODYubnhlZGdlLmlv/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDE5/LzA0L3dvb2QtY2Fy/dmluZy01OTV4NDAw/LmpwZw",
    productCount: 22,
    description: "Intricately carved wooden artifacts showcasing the region’s rich heritage."
  },
  {
    id: "handwoven-accessories",
    name: "Handwoven Accessories",
    image: "https://imgs.search.brave.com/OFZ8tdqvlTep2D3hkvXy9wLULx5gUpFFefyBsoCV3Q4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLmV0/c3lzdGF0aWMuY29t/LzI4NjU3OTc1L2Mv/MjI1MC8yMjUwLzAv/NDAzL2lsLzI2Mjlj/MC8zMTczNjI2Mzk3/L2lsXzYwMHg2MDAu/MzE3MzYyNjM5N183/c3p6LmpwZw",
    productCount: 20,
    description: "Handcrafted accessories like scarves, shawls, and bags woven with traditional patterns."
  },
  {
    id: "traditional-furniture",
    name: "Traditional Furniture",
    image: "https://imgs.search.brave.com/eTQQdNTVwrFBFBRWWm-Nh_6YAWUVT2T5-jalUg7NR2M/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/YmhnLmNvbS90aG1i/L0pQRGFBY0V3YVpT/R0NZaE9hbFB1Ykt4/UHRBUT0vMjkwMHgw/L2ZpbHRlcnM6bm9f/dXBzY2FsZSgpOnN0/cmlwX2ljYygpLzEw/MjI3MDU4OF9wcmV2/aWV3LTVhODhkZDNk/ZWFiODRhMThhMmVk/YjU4NzQxMjZiMjMx/LmpwZw",
    productCount: 15,
    description: "Furniture inspired by Northeast India's rich artistic traditions."
  }
];

// Products
export const products: Product[] = [
  {
    id: "premium-headphones",
    name: "Premium Noise-Cancelling Headphones",
    description: "Experience unparalleled sound quality with our premium noise-cancelling headphones. Designed for audiophiles and casual listeners alike, these headphones deliver crystal-clear audio while blocking out ambient noise. The ergonomic design ensures comfort during extended listening sessions, and the long-lasting battery means you can enjoy your favorite music, podcasts, or calls for hours on end.",
    price: 349.99,
    discount: 10,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=768&q=80",
      "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=768&q=80"
    ],
    category: "Traditional Furniture",
    categoryId: "traditional-furniture",
    rating: 4.8,
    reviewCount: 324,
    specifications: [
      { "Driver Size": "40mm" },
      { "Battery Life": "30 hours" },
      { "Bluetooth Version": "5.2" },
      { "Weight": "250g" }
    ],
    variants: [
      {
        id: "color",
        name: "Color",
        options: [
          { id: "black", value: "Black", available: true },
          { id: "white", value: "White", available: true },
          { id: "blue", value: "Navy Blue", available: true }
        ]
      }
    ],
    stock: 45,
    featured: true
  },
  {
    id: "minimalist-watch",
    name: "Minimalist Automatic Watch",
    description: "A perfect blend of elegance and function. This minimalist automatic watch features a clean dial, premium materials, and precision movement. The sapphire crystal ensures durability, while the interchangeable straps allow for versatile styling. Water-resistant and built to last, it's the perfect accessory for any occasion.",
    price: 299.99,
    discount: 0,
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1476&q=80",
    images: [
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1476&q=80",
      "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=768&q=80",
      "https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=768&q=80"
    ],
    category: "Accessories",
    categoryId: "accessories",
    rating: 4.9,
    reviewCount: 187,
    specifications: [
      { "Case Diameter": "40mm" },
      { "Movement": "Automatic" },
      { "Water Resistance": "50m" },
      { "Case Material": "Stainless Steel" }
    ],
    variants: [
      {
        id: "case",
        name: "Case Color",
        options: [
          { id: "silver", value: "Silver", available: true },
          { id: "gold", value: "Gold", available: true },
          { id: "rose-gold", value: "Rose Gold", available: true }
        ]
      },
      {
        id: "strap",
        name: "Strap Material",
        options: [
          { id: "leather", value: "Leather", available: true },
          { id: "steel", value: "Steel Mesh", available: true }
        ]
      }
    ],
    stock: 22,
    featured: true
  },
  {
    id: "ceramic-vase",
    name: "Handcrafted Ceramic Vase",
    description: "Add an artisanal touch to your home with this handcrafted ceramic vase. Each piece is unique, featuring subtle variations in texture and glaze. Perfect for displaying fresh flowers or as a standalone decorative item, this vase brings warmth and character to any space.",
    price: 89.99,
    discount: 15,
    image: "https://images.unsplash.com/photo-1612196808214-b7e239e5f6a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1364&q=80",
    images: [
      "https://images.unsplash.com/photo-1612196808214-b7e239e5f6a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1364&q=80",
      "https://images.unsplash.com/photo-1589461207517-aaad5fd85a5a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=768&q=80",
      "https://images.unsplash.com/photo-1605883705077-8d3d848f8a9f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=768&q=80"
    ],
    category: "Home Decor",
    categoryId: "home-decor",
    rating: 4.7,
    reviewCount: 113,
    specifications: [
      { "Material": "Ceramic" },
      { "Height": "25cm" },
      { "Diameter": "15cm" },
      { "Weight": "1.2kg" }
    ],
    variants: [
      {
        id: "color",
        name: "Color",
        options: [
          { id: "white", value: "White", available: true },
          { id: "terracotta", value: "Terracotta", available: true },
          { id: "blue", value: "Blue", available: false }
        ]
      }
    ],
    stock: 18,
    featured: true
  },
  {
    id: "premium-coffee-maker",
    name: "Precision Pour-Over Coffee Maker",
    description: "Elevate your morning ritual with this precision pour-over coffee maker. Crafted from heat-resistant borosilicate glass and sustainable bamboo, it combines function and beauty. The stainless steel filter eliminates the need for paper filters, resulting in a purer, more flavorful brew while being environmentally friendly.",
    price: 79.99,
    discount: 0,
    image: "https://images.unsplash.com/photo-1570087935869-51d239c1a5b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    images: [
      "https://images.unsplash.com/photo-1570087935869-51d239c1a5b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      "https://images.unsplash.com/photo-1606791422814-b32c705e3e2e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=768&q=80",
      "https://images.unsplash.com/photo-1610632380989-680fe40816c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=768&q=80"
    ],
    category: "Kitchen",
    categoryId: "kitchen",
    rating: 4.6,
    reviewCount: 92,
    specifications: [
      { "Capacity": "600ml" },
      { "Material": "Borosilicate Glass, Bamboo, Stainless Steel" },
      { "Dishwasher Safe": "Yes (Glass Components)" },
      { "Dimensions": "13cm x 13cm x 20cm" }
    ],
    variants: [],
    stock: 34,
    featured: true
  },
  {
    id: "wireless-earbuds",
    name: "Wireless Bluetooth Earbuds",
    description: "Experience true wireless freedom with these premium Bluetooth earbuds. Featuring exceptional sound quality, active noise cancellation, and a comfortable fit, they're perfect for workouts, commutes, or all-day wear. The compact charging case provides extended battery life, so your music never has to stop.",
    price: 129.99,
    discount: 20,
    image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    images: [
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      "https://images.unsplash.com/photo-1631176093617-63490a3d785a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=768&q=80",
      "https://images.unsplash.com/photo-1590658268037-7101d6eb5a8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=768&q=80"
    ],
    category: "Electronics",
    categoryId: "electronics",
    rating: 4.5,
    reviewCount: 217,
    specifications: [
      { "Battery Life": "8 hours (30 with case)" },
      { "Bluetooth Version": "5.2" },
      { "Water Resistance": "IPX7" },
      { "Noise Cancellation": "Active" }
    ],
    variants: [
      {
        id: "color",
        name: "Color",
        options: [
          { id: "black", value: "Black", available: true },
          { id: "white", value: "White", available: true },
          { id: "blue", value: "Blue", available: true }
        ]
      }
    ],
    stock: 42,
    featured: true
  },
  {
    id: "merino-wool-sweater",
    name: "Premium Merino Wool Sweater",
    description: "Crafted from the finest merino wool, this sweater combines luxury with practicality. Naturally temperature-regulating, it keeps you warm in winter and cool in milder weather. The versatile design transitions seamlessly from casual to formal settings, while the durable construction ensures this piece will be part of your wardrobe for years to come.",
    price: 149.99,
    discount: 0,
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1372&q=80",
    images: [
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1372&q=80",
      "https://images.unsplash.com/photo-1624134303363-28e377ee25d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=768&q=80",
      "https://images.unsplash.com/photo-1609357603884-0ead4848cea7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=768&q=80"
    ],
    category: "Fashion",
    categoryId: "fashion",
    rating: 4.7,
    reviewCount: 76,
    specifications: [
      { "Material": "100% Merino Wool" },
      { "Care": "Hand Wash Cold" },
      { "Fit": "Regular" },
      { "Origin": "Ethically Sourced" }
    ],
    variants: [
      {
        id: "color",
        name: "Color",
        options: [
          { id: "charcoal", value: "Charcoal", available: true },
          { id: "navy", value: "Navy", available: true },
          { id: "burgundy", value: "Burgundy", available: true }
        ]
      },
      {
        id: "size",
        name: "Size",
        options: [
          { id: "s", value: "S", available: true },
          { id: "m", value: "M", available: true },
          { id: "l", value: "L", available: true },
          { id: "xl", value: "XL", available: true }
        ]
      }
    ],
    stock: 29,
    featured: true
  },
  {
    id: "smart-desk-lamp",
    name: "Adaptive Smart Desk Lamp",
    description: "Transform your workspace with this intelligent desk lamp. The adaptive lighting automatically adjusts based on the time of day and ambient light conditions to reduce eye strain and boost productivity. Control brightness, color temperature, and lighting modes via the companion app or voice commands. The minimal design and premium materials complement any decor.",
    price: 119.99,
    discount: 5,
    image: "https://images.unsplash.com/photo-1573432637301-6e540a2a1699?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    images: [
      "https://images.unsplash.com/photo-1573432637301-6e540a2a1699?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
      "https://images.unsplash.com/photo-1534281352209-8d1b1803f6e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=768&q=80",
      "https://images.unsplash.com/photo-1574386150968-7598a29bba72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=768&q=80"
    ],
    category: "Home Decor",
    categoryId: "home-decor",
    rating: 4.6,
    reviewCount: 132,
    specifications: [
      { "Power": "12W" },
      { "Color Temperature": "2700K-6500K" },
      { "Smart Assistant": "Works with Google, Alexa, HomeKit" },
      { "Material": "Aluminum, Silicone" }
    ],
    variants: [
      {
        id: "color",
        name: "Color",
        options: [
          { id: "silver", value: "Silver", available: true },
          { id: "black", value: "Black", available: true }
        ]
      }
    ],
    stock: 34,
    featured: true
  },
  {
    id: "minimalist-wallet",
    name: "Slim Card Wallet",
    description: "Streamline your everyday carry with this minimalist wallet. Crafted from premium full-grain leather, it develops a beautiful patina over time. Despite its slim profile, it comfortably holds cards and cash while fitting easily in your front pocket. RFID blocking technology protects your personal information from electronic theft.",
    price: 59.99,
    discount: 0,
    image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    images: [
      "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=768&q=80",
      "https://images.unsplash.com/photo-1575602647968-5937be428936?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=768&q=80"
    ],
    category: "Accessories",
    categoryId: "accessories",
    rating: 4.8,
    reviewCount: 204,
    specifications: [
      { "Material": "Full-Grain Leather" },
      { "Capacity": "8-10 Cards" },
      { "RFID Protection": "Yes" },
      { "Dimensions": "9.5cm x 7cm x 0.8cm" }
    ],
    variants: [
      {
        id: "color",
        name: "Color",
        options: [
          { id: "brown", value: "Chestnut Brown", available: true },
          { id: "black", value: "Midnight Black", available: true },
          { id: "navy", value: "Navy Blue", available: true }
        ]
      }
    ],
    stock: 51,
    featured: true
  }
];

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured);
};

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (categoryId: string): Product[] => {
  return products.filter(product => product.categoryId === categoryId);
};

export const getCategoryById = (id: string): Category | undefined => {
  return categories.find(category => category.id === id);
};
