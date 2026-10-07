import dotenv from 'dotenv';
dotenv.config()
import express from 'express';
import mongoose from 'mongoose';


const app = express()
const PORT = process.env.PORT || 5000

// MIDDLEWARE
app.use(express.json())

// DATABASE CONNECTION
mongoose.connect(process.env.MONGODB_URI, {
  dbName: 'my-store'
})
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch((err) => {
    console.error('Failed to connect to the database', err.message);
  });


// SCHEMA
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  quantity: Number
},
{
  collection: 'products',
  versionKey: false
}
);

// MODEL
const Product = mongoose.model('Product', productSchema);

// CRUD API ENDPOINTS
/** ================================= */

// CREATE PRODUCT
app.post("/api/v1/product/create", async (req, res) => {
    const data = req.body;
    const product = await Product.create(data);

    console.log("Product Data Created", data)
   
    res.json({
        message: "Create Product Successfully",
        data: product
    })
});

// GET ALL Products
app.get("/api/v1/products", async (req, res) => {
    const products = await Product.find();

    res.json({
        message: "Get All Products Successfully",
        data: products
    })
});

// Update Multiple Data by User ID 
app.put("/api/v1/product/:id", async (req, res) => {
    const product = await Product.findById(req.params.id);

    product.name = req.body.name;
    product.price = req.body.price;
    product.description = req.body.description;
    product.quantity = req.body.quantity;

    await product.save();

     res.json({
        message: "Update Product Successfully",
        data: product
    })
});

// Update Single Data by User ID
app.patch("/api/v1/product/:id", async (req, res) => {
    const product = await Product.findById(req.params.id);

    // Update only the fields that are provided in the request body
    if (req.body.name !== undefined) product.name = req.body.name;
    if (req.body.price !== undefined) product.price = req.body.price;
    if (req.body.description !== undefined) product.description = req.body.description;
    if (req.body.quantity !== undefined) product.quantity = req.body.quantity;

    await product.save();

    res.json({
        message: "Update Product Successfully",
        data: product
    })
});

// DELETE USER BY ID
app.delete("/api/v1/product/:id", async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);

    res.json({
        message: "Delete Product Successfully"
    })
});




// SERVER RESPONSE
app.get('/', (req, res) => {
  res.send('Hey! Buddy, This Product CRUD SERVER.')
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

