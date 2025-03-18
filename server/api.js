import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import Razorpay from "razorpay";
import crypto from "crypto";


dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const prisma = new PrismaClient(); 
const razorpay = new Razorpay({
  key_id: 'rzp_test_TogtJ7wy2DO1D7', // Replace with your Razorpay Key ID
  key_secret: 'sG4C5Ryxc6ukeiBXBbwHUNLg', // Replace with your Razorpay Key Secret
});

export const signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Name, email, and password are required" });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role === "admin" ? "admin" : "user",
      },
    });

    res.json({
      message: "User created successfully",
      userId: user.id,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Error creating user" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required" });
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Error during login" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    res.json(user);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Error fetching profile" });
  }
};

// User-facing: Get all products
export const getProducts = async (req, res) => {
  try {
    const { category, priceRange, sort } = req.query;

    let where = {};
    if (category && category !== "all") {
      where.category = { name: category };
    }
    if (priceRange && priceRange !== "all") {
      const [min, max] = priceRange.split("-");
      where.price = {};
      if (min) where.price.gte = Number(min);
      if (max) where.price.lte = Number(max);
      else if (priceRange === "200+") where.price.gte = 200;
    }

    let orderBy = {};
    switch (sort) {
      case "priceLow":
        orderBy.price = "asc";
        break;
      case "priceHigh":
        orderBy.price = "desc";
        break;
      case "popular":
        orderBy.rating = "desc";
        break;
      case "latest":
      default:
        orderBy.createdAt = "desc";
        break;
    }

    const products = await prisma.product.findMany({
      where,
      include: { category: { select: { name: true } } },
      orderBy,
    });

    const formattedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      discount: product.discount || 0,
      imageUrl: product.imageUrl || null,
      rating: product.rating || 0,
      reviewCount: product.reviewCount || 0,
      category: product.category,
    }));

    res.json(formattedProducts);
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ error: "Error fetching products" });
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: { name: true },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Format the product to match getProducts output
    const formattedProduct = {
      id: product.id,
      name: product.name,
      price: Number(product.price),
      discount: product.discount || 0,
      imageUrl: product.imageUrl || null,
      rating: product.rating || 0,
      reviewCount: product.reviewCount || 0,
      category: product.category,
    };

    return res.status(200).json(formattedProduct);
  } catch (error) {
    console.error("Get product by ID error:", error);
    return res.status(500).json({ error: "Error fetching product" });
  }
};

export const getAdminProducts = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Unauthorized: Admin access required" });
    }
    const products = await prisma.product.findMany({
      where: { createdById: req.user.id },
      include: { category: { select: { name: true } } },
    });
    res.json(products);
  } catch (error) {
    console.error("Get admin products error:", error);
    res.status(500).json({ error: "Error fetching admin products" });
  }
};

export const addProduct = async (req, res) => {
  const {
    name,
    price,
    categoryId,
    description,
    imageUrl,
    images,
    stock,
    discount,
    rating,
    reviewCount,
    specifications,
    variants,
  } = req.body;

  if (!name || !price || !categoryId) {
    return res
      .status(400)
      .json({ error: "Name, price, and categoryId are required" });
  }

  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Unauthorized: Admin access required" });
    }

    const product = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        categoryId,
        description,
        imageUrl,
        images: images || [],
        stock: stock || 0,
        discount: discount || 0,
        rating: rating || 0.0,
        reviewCount: reviewCount || 0,
        specifications: specifications || {},
        variants: variants || {},
        createdById: req.user.id, // Link to the admin
      },
      include: { category: { select: { name: true } } },
    });
    res.status(201).json(product);
  } catch (error) {
    console.error("Add product error:", error);
    res.status(500).json({ error: "Error adding product" });
  }
};

export const editProduct = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    price,
    categoryId,
    description,
    imageUrl,
    images,
    stock,
    discount,
    rating,
    reviewCount,
    specifications,
    variants,
  } = req.body;

  if (!name || !price || !categoryId) {
    return res
      .status(400)
      .json({ error: "Name, price, and categoryId are required" });
  }

  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Unauthorized: Admin access required" });
    }

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product || product.createdById !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Unauthorized: You can only edit your own products" });
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        price: parseFloat(price),
        categoryId,
        description,
        imageUrl,
        images: images || product.images,
        stock: stock || product.stock,
        discount: discount || product.discount,
        rating: rating || product.rating,
        reviewCount: reviewCount || product.reviewCount,
        specifications: specifications || product.specifications,
        variants: variants || product.variants,
      },
      include: { category: { select: { name: true } } },
    });
    res.json(updatedProduct);
  } catch (error) {
    console.error("Edit product error:", error);
    res.status(500).json({ error: "Error editing product" });
  }
};


export const deleteProduct = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Product ID is required" });
  }

  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Unauthorized: Admin access required" });
    }

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product || product.createdById !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Unauthorized: You can only delete your own products" });
    }

    await prisma.product.delete({ where: { id } });
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ error: "Error deleting product" });
  }
};

export const addWishlist = async (req, res) => {
  try {
    const {id} = req.user;
    const userId = id;
    const {  productId } = req.body;
    if (!userId || !productId) {
      return res
        .status(400)
        .json({ error: "userId and productId are required" });
    }

    const wishlist = await prisma.wishlist.upsert({
      where: { userId },
      update: {
        products: {
          create: { productId },
        },
      },
      create: {
        userId,
        products: {
          create: { productId },
        },
      },
      include: { products: { include: { product: true } } },
    });

    res.status(201).json(wishlist);
  } catch (error) {
    console.error("Add wishlist error:", error);
    res.status(500).json({ error: "Error adding to wishlist" });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const { userId } = req.params;
    const wishlist = await prisma.wishlist.findUnique({
      where: { userId },
      include: { products: { include: { product: true } } },
    });

    if (!wishlist) {
      return res.status(404).json({ error: "Wishlist not found" });
    }

    res.json(wishlist);
  } catch (error) {
    console.error("Get wishlist error:", error);
    res.status(500).json({ error: "Error fetching wishlist" });
  }
};

export const deleteWishlist = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ error: "productId is required" });
    }

    const wishlist = await prisma.wishlist.findUnique({
      where: { userId },
    });

    if (!wishlist) {
      return res.status(404).json({ error: "Wishlist not found" });
    }

    await prisma.wishlistProduct.deleteMany({
      where: {
        wishlistId: wishlist.id,
        productId,
      },
    });

    res.json({ message: "Product removed from wishlist" });
  } catch (error) {
    console.error("Delete wishlist error:", error);
    res.status(500).json({ error: "Error removing from wishlist" });
  }
};

export const addCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ error: "productId is required" });
    }

    const cart = await prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });

    const existingCartItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    let cartItem;
    if (existingCartItem) {
      cartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: { increment: quantity } },
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity },
      });
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: { include: { product: true } } },
    });

    res.json(updatedCart);
  } catch (error) {
    console.error("Add cart error:", error);
    res.status(500).json({ error: "Error adding to cart" });
  }
};

export const getOrder = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await prisma.order.findMany({
      // Fixed from wishlist to order
      where: { userId },
      include: {
        products: { include: { product: true } },
        payments: true,
      },
    });

    res.json(orders);
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
};

export const getCategories = async (req, res) => {
  try {
    const { featured } = req.query;
    const where = featured === "true" ? { isFeatured: true } : {};

    const categories = await prisma.category.findMany({
      where,
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" }, // Sort alphabetically
    });

    const formattedCategories = categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      imageUrl: category.imageUrl || null,
      bannerUrl: category.bannerUrl || null,
      description: category.description || null,
      isFeatured: category.isFeatured,
      productCount: category._count.products,
    }));

    res.json(formattedCategories);
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ error: "Error fetching categories" });
  }
};

export const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          select: {
            id: true,
            name: true,
            price: true,
            discount: true,
            imageUrl: true,
            rating: true,
            reviewCount: true,
          },
        },
        _count: { select: { products: true } },
      },
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    const formattedCategory = {
      id: category.id,
      name: category.name,
      slug: category.slug,
      imageUrl: category.imageUrl || null,
      bannerUrl: category.bannerUrl || null,
      description: category.description || null,
      isFeatured: category.isFeatured,
      productCount: category._count.products,
      products: category.products,
    };

    res.json(formattedCategory);
  } catch (error) {
    console.error("Get category by slug error:", error);
    res.status(500).json({ error: "Error fetching category" });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, imageUrl, bannerUrl, description, isFeatured } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const slug = slugify(name, { lower: true, strict: true });
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        imageUrl,
        bannerUrl,
        description,
        isFeatured: isFeatured || false,
      },
    });

    res.status(201).json(category);
  } catch (error) {
    console.error("Create category error:", error);
    res.status(500).json({ error: "Error creating category" });
  }
};export const getCart = async (req, res) => {
  const userId = req.user?.id;

  // Check authentication
  if (!userId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  try {
    // Fetch cart or create if it doesn’t exist
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                discount: true,
                imageUrl: true,
                stock: true,
                category: { select: { name: true } },
              },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  discount: true,
                  imageUrl: true,
                  stock: true,
                  category: { select: { name: true } },
                },
              },
            },
          },
        },
      });
    }

    // Normalize numeric fields and structure response
    const normalizedCart = {
      id: cart.id,
      userId: cart.userId,
      items: cart.items.map((item) => ({
        productId: item.product.id,
        quantity: Number(item.quantity),
        product: {
          id: item.product.id,
          name: item.product.name,
          price: Number(item.product.price),
          discount: Number(item.product.discount || 0),
          imageUrl: item.product.imageUrl || null,
          stock: Number(item.product.stock),
          category: item.product.category ? { name: item.product.category.name } : null,
        },
      })),
    };

    return res.status(200).json(normalizedCart);
  } catch (error) {
    console.error('Get cart error:', error.message, error.stack);
    return res.status(500).json({
      error: 'Failed to fetch cart',
      details: error.message,
    });
  } finally {
    await prisma.$disconnect(); // Ensure Prisma disconnects
  }
};

export const updateCart = async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  if (!productId || quantity === undefined) {
    return res.status(400).json({ error: "productId and quantity are required" });
  }

  try {
    // First, ensure a cart exists
    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } });
    }

    const cartItem = await prisma.cartItem.upsert({
      where: {
        cartId_productId: { cartId: cart.id, productId },
      },
      update: { quantity },
      create: { cartId: cart.id, productId, quantity },
      include: { product: true },
    });

    // Fetch updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    return res.status(200).json(updatedCart);
  } catch (error) {
    console.error("Update cart error:", error.message, error.stack);
    return res.status(500).json({ error: "Failed to update cart", details: error.message });
  }
};

export const deleteCart = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ error: "productId is required" });
  }

  try {
    await prisma.cartItem.deleteMany({
      where: { cart: { userId }, productId },
    });
    return res.status(200).json({ message: "Item removed" });
  } catch (error) {
    console.error("Delete cart error:", error.message, error.stack);
    return res.status(500).json({ error: "Failed to remove item", details: error.message });
  }
};

export const clearCart = async (req, res) => {
  const userId = req.user.id;
  try {
    await prisma.cart.update({
      where: { userId },
      data: { items: { deleteMany: {} } },
    });
    return res.status(200).json({ message: "Cart cleared" });
  } catch (error) {
    console.error("Clear cart error:", error.message, error.stack);
    return res.status(500).json({ error: "Failed to clear cart", details: error.message });
  }
};


export const getDeals = async (req, res) => {
  try {
    const { sortBy = "discount-desc" } = req.query;

    // Map sortBy to Prisma orderBy
    let orderBy;
    switch (sortBy) {
      case "discount-asc":
        orderBy = { discount: "asc" };
        break;
      case "discount-desc":
        orderBy = { discount: "desc" };
        break;
      case "price-asc":
        orderBy = { price: "asc" };
        break;
      case "price-desc":
        orderBy = { price: "desc" };
        break;
      default:
        orderBy = { discount: "desc" };
    }

    const products = await prisma.product.findMany({
      where: {
        discount: { gt: 0 }, // Only products with discount > 0
        stock: { gt: 0 }, // Only in-stock products
      },
      include: {
        category: { select: { name: true } },
      },
      orderBy,
    });

    // Convert Decimal to number for JSON serialization
    const formattedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      discount: Number(product.discount),
      imageUrl: product.imageUrl || null,
      stock: product.stock,
      category: product.category,
    }));

    res.json(formattedProducts);
  } catch (error) {
    console.error("Get deals error:", error);
    res.status(500).json({ error: "Error fetching deals" });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    const featuredProducts = await prisma.product.findMany({
      where: {
        OR: [{ rating: { gte: 4.0 } }, { discount: { gt: 0 } }],
      },
      include: {
        category: { select: { name: true } },
      },
      orderBy: { rating: "desc" },
      take: 10,
    });

    const formattedProducts = featuredProducts.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: Number(product.price),
      discount: product.discount,
      imageUrl: product.imageUrl || null,
      stock: product.stock,
      rating: product.rating,
      reviewCount: product.reviewCount,
      category: product.category,
    }));

    res.json(formattedProducts);
  } catch (error) {
    console.error("Get featured products error:", error);
    res.status(500).json({ error: "Error fetching featured products" });
  }
};

export const getUserAddresses = async (req, res) => {
  const userId = req.user?.id; // Assuming middleware sets req.user from token

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const addresses = await prisma.address.findMany({
      where: { userId },
    });

    const formattedAddresses = addresses.map(addr => ({
      id: addr.id,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      country: addr.country,
    }));

    return res.status(200).json(formattedAddresses);
  } catch (error) {
    console.error('Get addresses error:', error);
    return res.status(500).json({ error: 'Failed to fetch addresses' });
  }
};



export const createOrder = async (req, res) => {
  const { userId, items, total, shippingAddress } = req.body;

  try {
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(total * 100), // Convert to paise
      currency: 'INR',
      receipt: `receipt_${userId}_${Date.now()}`,
    });

    const order = await prisma.order.create({
      data: {
        userId: userId || 'guest', // Allow guest orders
        total,
        status: 'PENDING',
        razorpayOrderId: razorpayOrder.id,
        shippingAddress: {
          create: shippingAddress,
        },
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    return res.status(200).json({ orderId: razorpayOrder.id, amount: total });
  } catch (error) {
    console.error('Create order error:', error);
    return res.status(500).json({ error: 'Failed to create order' });
  }
};

export const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const generatedSignature = crypto
    .createHmac('sha256', 'YOUR_RAZORPAY_KEY_SECRET')
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (generatedSignature === razorpay_signature) {
    try {
      await prisma.order.update({
        where: { razorpayOrderId: razorpay_order_id },
        data: {
          status: 'PAID',
          razorpayPaymentId: razorpay_payment_id,
        },
      });
      return res.status(200).json({ message: 'Payment verified' });
    } catch (error) {
      console.error('Verify payment error:', error);
      return res.status(500).json({ error: 'Failed to update order' });
    }
  } else {
    return res.status(400).json({ error: 'Invalid payment signature' });
  }
};