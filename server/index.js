import express from "express";
import { PrismaClient } from '@prisma/client';
const app = express();
import cors from 'cors';
import { addCart, addWishlist, deleteCart, deleteProduct, deleteWishlist, getCart, getOrder, getProducts, getWishlist, postProducts } from "./api.js";

const prisma = new PrismaClient();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173',methods: 'GET,POST,PUT,DELETE',allowedHeaders: 'Content-Type,Authorization', credentials: true }));

app.get('/', async (req, res) => {
    return res.json({message: "Hello World"});
})


//products
app.post('/products', postProducts)
app.get('/products',getProducts)
// app.delete("/products",deleteProduct )


//wishlist
app.post('/wishlist/add',addWishlist)
app.get("/wishlist/:userId",getWishlist)
app.delete("/wishlist/:userId",deleteWishlist)

//cart

app.get("/cart/:userId",getCart)
app.post("/cart/:userId",addCart)
app.delete("/cart/:userId",deleteCart)

//order
app.get("/order/:userId",getOrder)
// app.post("/order/add",addOrder)



app.listen(3000, () => {
    console.log("Server is running at port 3000 ");})