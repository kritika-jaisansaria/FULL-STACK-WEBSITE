import Product from '../Models/Product.js';

// Create a new product
export const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error creating product:', err);

    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      console.error('Validation Errors:', messages); 
      return res.status(400).json({ message: 'Validation Error', errors: messages });
    }

    res.status(500).json({ message: 'Failed to create product', error: err.message });
  }
};


// controllers/productController.js

export const getAllProducts = async (req, res) => {
  try {
     console.log("Query Params:", req.query);
    const {
      category,
      style,
      gender,
      material,
      collection,
      productType,
      occasion,
      karatage,
      minPrice,
      maxPrice,
      search,
    } = req.query;

    const filter = {};
    if (search) {
  filter.$or = [
    {
      name: {
        $regex: search,
        $options: "i",
      },
    },
    {
      category: {
        $regex: search,
        $options: "i",
      },
    },
  ];
}

   // Category
if (category) {
  filter.category = new RegExp(`^${category}$`, "i");
}

// Style (Drops, Studs, etc.)
if (style) {
  filter.style = new RegExp(`^${style}$`, "i");
}

// Gender
if (gender) {
  filter["generalDetails.gender"] = new RegExp(`^${gender}$`, "i");
}

// Material
if (material) {
  filter["metalDetails.metal"] = new RegExp(`^${material}$`, "i");
}

// Collection
if (collection) {
  filter["generalDetails.collection"] = new RegExp(`^${collection}$`, "i");
}

// Product Type
if (productType) {
  filter["generalDetails.productType"] = new RegExp(`^${productType}$`, "i");
}

// Occasion
if (occasion) {
  filter["generalDetails.occasion"] = new RegExp(`^${occasion}$`, "i");
}

// Karatage
if (karatage) {
  filter["metalDetails.karatage"] = new RegExp(`^${karatage}$`, "i");
}

// Price
if (minPrice || maxPrice) {
  filter.price = {};

  if (minPrice) {
    filter.price.$gte = Number(minPrice);
  }

  if (maxPrice) {
    filter.price.$lte = Number(maxPrice);
  }
}

    const products = await Product.find(filter).sort({
      createdAt: -1,
    });
    console.log("Mongo Filter:", filter);
console.log("Products Found:", products.length);

    res.json(products);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to fetch products",
    });
  }
};


// Update a product by ID
export const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(updated);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ message: 'Failed to update product', error: err.message });
  }
};

// Delete a product by ID
export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ message: 'Failed to delete product', error: err.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ message: 'Failed to fetch product', error: err.message });
  }
};