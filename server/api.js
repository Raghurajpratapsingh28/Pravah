import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const prisma = new PrismaClient();

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    res
      .status(201)
      .json({ message: "User created successfully!", userId: user.id });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
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
        createdAt: true,
      },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error fetching profile" });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { category, priceRange, sort } = req.query;

    // Build where clause
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

    // Build orderBy clause
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

export const postProducts = async (req, res) => {
  try {
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

    const newProduct = await prisma.product.create({
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
      },
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Error creating product" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    const product = await prisma.product.delete({
      where: { id },
    });

    res.json({ message: "Product deleted successfully", product });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ error: "Error deleting product" });
  }
};

export const addWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;
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
};

export const getCart = async (req, res) => {
  const { userId } = req.user; // From authenticateUser middleware
  try {
    const cart = await prisma.cart.findUnique({
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
                category: { select: { name: true } }, // Include category name
              },
            },
          },
        },
      },
    });

    if (!cart) {
      // Create an empty cart if none exists
      const newCart = await prisma.cart.create({
        data: { userId },
        include: { items: { include: { product: true } } },
      });
      return res.json(newCart);
    }

    res.json(cart);
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ error: "Error fetching cart" });
  }
};

export const updateCart = async (req, res) => {
  const { userId } = req.user;
  const { productId, quantity } = req.body;

  if (!productId || !Number.isInteger(quantity) || quantity < 1) {
    return res.status(400).json({ error: "Invalid productId or quantity" });
  }

  try {
    // Validate product and stock
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, stock: true },
    });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    if (quantity > product.stock) {
      return res
        .status(400)
        .json({ error: `Only ${product.stock} items in stock` });
    }

    // Ensure cart exists
    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } });
    }

    // Update or create cart item
    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    // Fetch updated cart
    const updatedCart = await prisma.cart.findUnique({
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

    res.json(updatedCart);
  } catch (error) {
    console.error("Update cart error:", error);
    res.status(500).json({ error: "Error updating cart" });
  }
};

export const deleteCart = async (req, res) => {
  const { userId } = req.user;
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ error: "ProductId is required" });
  }

  try {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const item = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (!item) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    await prisma.cartItem.delete({
      where: { id: item.id },
    });

    // Fetch updated cart
    const updatedCart = await prisma.cart.findUnique({
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

    res.json(updatedCart);
  } catch (error) {
    console.error("Delete cart item error:", error);
    res.status(500).json({ error: "Error removing item from cart" });
  }
};

export const clearCart = async (req, res) => {
  const { userId } = req.user;

  try {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    const clearedCart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    res.json(clearedCart);
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({ error: "Error clearing cart" });
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
