import express from "express";
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import { 
  addCart, 
  addWishlist, 
  clearCart, 
  createCategory, 
  deleteCart, 
  deleteProduct, 
  deleteWishlist, 
  getCart, 
  getCategories, 
  getCategoryBySlug, 
  getDeals, 
  getFeaturedProducts, 
  getOrder, 
  getProducts, 
  getProfile, 
  getWishlist, 
  login, 
  postProducts, 
  signup, 
  updateCart
} from "./api.js";
import { authenticateUser } from "./middleware.js";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors({ 
  origin: 'http://localhost:8080',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true 
}));

app.get('/', async (req, res) => {
  return res.json({ message: "You reached ArtisanNE Backend" });
});

// User Authentication
app.post("/signup", signup);
app.post("/login", login);
app.get("/profile", authenticateUser, getProfile);

//Categories
app.get('/categories', getCategories);
app.post('/categories', authenticateUser, createCategory); // Protected route for admins
app.get('/categories/:slug', getCategoryBySlug);
app.get('/products/featured', getFeaturedProducts);

// Products
app.post('/products', authenticateUser, postProducts); // Added authentication
app.get('/products', getProducts);
app.delete("/products", authenticateUser, deleteProduct);

// Wishlist
app.post('/wishlist/add', authenticateUser, addWishlist);
app.get("/wishlist/:userId", authenticateUser, getWishlist);
app.delete("/wishlist/:userId", authenticateUser, deleteWishlist);

// Cart
app.get('/cart/:userId', authenticateUser, getCart);
app.post('/cart/:userId', authenticateUser, updateCart);
app.delete('/cart/:userId', authenticateUser, deleteCart);
app.delete('/cart/:userId/clear', authenticateUser, clearCart); // Optional clear route

// Order
app.get("/order/:userId", authenticateUser, getOrder);

//deals
app.get('/deals', getDeals);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});