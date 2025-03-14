import express from 'express';
import { PrismaClient } from '@prisma/client';
const app = express();
const prisma = new PrismaClient();




export const getProducts = async (req,res) => {
    try {
        const products = await prisma.product.findMany();
        return res.status(201).json(products);

    } catch (error) {
     return   res.status(500).json({error: "Something went wrong"});  
    }
 } 

 export const postProducts = async (req, res)=>{

    try {
        console.log("Posting Reached");
        const { name, price ,categoryId, description,imageUrl,stock} = req.body;
        console.log(req.body);
    
        if(!name || !price ){
            return res.status(400).json({error: "Name, price and categoryById are required"});
       }
       console.log("Posting done ");
        const newProduct = await prisma.product.create({
            data: {
                name,
                price,
                categoryId:categoryId,
                description,
                imageUrl,
                stock:stock ?? 0,
            }
        });

        console.log("Data has been stored in the database");
        console.log(newProduct);

      res.status(201).json(newProduct);
    } catch (error) {
        res.status(501).json(error.messege,"Issue to create product")
    }

 }

 export const updateProduct = async (req,res)=>{
    const {id} = req.params;
    const {name,price,categoryId,description,imageUrl,stock} = req.body;
    console.log(req.body);

    console.log("Posting done ");
    const newProduct = await prisma.product.update({
        where:{id},
        data: {
            name,
            price,
            categoryId:categoryId,
            description,
            imageUrl,
            stock:stock ?? 0,
        }
       
    });
    res.status(201).json(newProduct)

 }

 export const deleteProduct = async (req, res) => {
    try {
        console.log("Deleting product reached");

        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ error: "Product ID is required" });
        }

        console.log("Product ID:", id);

        // Delete product from the cart
        const deletedProduct = await prisma.product.delete({
            where: {
                id: id, // Ensure `id` is unique (string or number based on schema)
            }
        });

        console.log("Product removed from the website:", deletedProduct);

        res.json({ message: "Product removed successfully", deletedProduct });
    } catch (error) {
        console.error("Error in deleting product:", error);
        res.status(500).json({ error: "Error in deleting product", details: error.message });
    }
};

 export const addWishlist = async (req,res) => {

    try {
        const {userId, productId} = req.body;
    console.log(req.body);

    const wishlist = await prisma.wishlist.upsert({
        where: { userId },
        update: {
          products: {
            create: { productId }
          }
        },
        create: {
          userId,
          products: {
            create: { productId }
          }
        }
      });

      res.status(201).json({success:true,wishlist})
    } catch (error) {
        console.log(error.messege,"Error adding in Wishllist");
    }
    
 };

 export const getWishlist = async (req, res)=>{
    try {
      
        const {userId} = req.params;
        const wishlist = await prisma.wishlist.findUnique({
            where: { userId },
            include: { products: { include: { product: true } } }
          });
          res.status(201).json({status:true,wishlist});
    } catch (error) {
        return res.status(501).json("Error in getting wishlist")
    }
 }

export const deleteWishlist = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log("User ID:", userId);

        const { productId } = req.body;
        console.log("Product ID:", productId);

        // Find the wishlist for the user
        const wishlist = await prisma.wishlist.findUnique({
            where: { userId },
            select: { id: true }
        });

        if (!wishlist) {
            return res.status(404).json({ error: "Wishlist not found for user" });
        }

        // Delete product from the WishlistProduct relation table
        const deletedWishlistItem = await prisma.wishlistProduct.deleteMany({
            where: {
                wishlistId: wishlist.id,
                productId: productId
            }
        });

        if (deletedWishlistItem.count === 0) {
            return res.status(404).json({ error: "Product not found in wishlist" });
        }

        res.status(200).json({ status: true, message: "Product removed from wishlist" });

    } catch (error) {
        console.error("Error deleting wishlist item:", error);
        res.status(500).json({ error: "Error in deleting wishlist" });
    }
};


export const getCart = async (req,res)=>{
    try {
        console.log("Getting cart reached");
        const { userId } = req.params;
        console.log(userId);
    
        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {  // Include CartItem model
                    include: {
                        product: true  // Include Product model inside CartItem
                    }
                }
            }
        });
    
        console.log("Cart has been fetched", cart);
        res.json(cart);
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json("Error in getting cart");
    }
    
}

export const addCart = async (req,res)=>{
    try {
        const { userId } = req.params;
        const { productId } = req.body;
        console.log(req.body);
    
        // Cart exist or not
        let cart = await prisma.cart.upsert({
            where: { userId },
            update: {}, 
            create: { userId }
        });
    
        // Check product is in cart
        const existingCartItem = await prisma.cartItem.findFirst({
            where: {
                cartId: cart.id,
                productId: productId
            }
        });
    
        let cartItem;
        if (existingCartItem) {
            //if it exist then it increased by 1
            cartItem = await prisma.cartItem.update({
                where: { id: existingCartItem.id }, // Use `id` as unique identifier
                data: { quantity: { increment: 1 } }
            });
        } else {
          //if doesnt then add to cart
            cartItem = await prisma.cartItem.create({
                data: { cartId: cart.id, productId: productId, quantity: 1 }
            });
        }
    
        res.json({ cart, cartItem });
    
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ error: "Error in adding to cart" });
    }
    
}

export const deleteCart = async (req,res)=>{
    try {
        console.log("Deleting cart reached");
    
        const { userId } = req.params;
        const { productId } = req.body;
        
        console.log("User ID:", userId);
        console.log("Product ID:", productId);
    
        // Find the user's cart
        const cart = await prisma.cart.findUnique({
            where: { userId },
            select: { id: true } 
        });
    
        if (!cart) {
            return res.status(404).json({ error: "Cart not found for user" });
        }
    
        // Delete product from the cart
        await prisma.cartItem.deleteMany({
            where: {
                cartId: cart.id,
                productId: productId
            }
        });
    
        console.log("Product removed from cart",cart);
    
        res.json({ message: "Product removed from cart",cart });
    
    } catch (error) {
        console.error("Error deleting cart:", error);
        res.status(500).json({ error: "Error in deleting cart" });
    }
}

export const getOrder = async (req,res)=>{
    try {
        const { userId } = req.params;
        console.log(userId);
    
        const orders = await prisma.wishlist.findUnique({
            where: { userId },
            include: { products: { include: { product: true } } }
          });
        
      
    
        res.json(orders);
    } catch (error) {
        console.error("Error in fetching orders:", error);
        res.status(500).json({ error: "Error in fetching orders" });
    }
}

// export const addOrder = async (req,res)=>{
//     try {
//         const { userId } = req.params;
//         const { productId } = req.body;
//         console.log(req.body);
    
//         // Cart exist or not
//         let cart = await prisma.cart.upsert({
//             where: { userId },
//             update: {}, 
//             create: { userId }
//         });
    
//         // Check product is in cart
//         const existingCartItem = await prisma.cartItem.findFirst({
//             where: {
//                 cartId: cart.id,
//                 productId: productId
//             }
//         });
    
//         let cartItem;
//         if (existingCartItem) {
//             //if it exist then it increased by 1
//             cartItem = await prisma.cartItem.update({
//                 where: { id: existingCartItem.id }, // Use `id` as unique identifier
//                 data: { quantity: { increment: 1 } }
//             });
//         } else {
//           //if doesnt then add to cart
//             cartItem = await prisma.cartItem.create({
//                 data: { cartId: cart.id, productId: productId, quantity: 1 }
//             });
//         }
    
//         res.json({ cart, cartItem });
    
//     } catch (error) {
//         console.error("Error adding to cart:", error);
//         res.status(500).json({ error: "Error in adding to cart" });
//     }
// }

