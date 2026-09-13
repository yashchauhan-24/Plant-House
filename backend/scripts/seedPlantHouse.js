import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../model/product.models.js";
import Category from "../model/category.models.js";
import User from "../model/user.models.js";

dotenv.config({ path: "./config/config.env" });

const categoryNames = [
  "Indoor Plants",
  "Outdoor Plants",
  "Flowering Plants",
  "Succulents",
  "Air Purifying Plants",
  "Pots & Planters",
  "Plant Care",
];

const imageFor = (query) => ({
  public_id: `plant-house/${query.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
  url: `https://images.unsplash.com/${query}`,
});

const imageUrls = [
  "photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=900&q=85",
  "photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=85",
  "photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=85",
  "photo-1459156212016-c812468e2115?auto=format&fit=crop&w=900&q=85",
];

const products = [
  ["Snake Plant", "Low-maintenance indoor plant with tall upright leaves, ideal for bedrooms and offices.", 299, 499, 4.8, "Indoor Plants"],
  ["Peace Lily", "Elegant flowering indoor plant known for lush foliage and beautiful white flowers.", 349, 549, 4.7, "Indoor Plants"],
  ["Monstera Deliciosa", "Tropical indoor plant with large split leaves that brings a bold green look to interiors.", 599, 899, 4.8, "Indoor Plants"],
  ["Areca Palm", "A tropical palm perfect for balconies, patios and outdoor spaces.", 549, 799, 4.7, "Outdoor Plants"],
  ["Hibiscus Plant", "Vibrant flowering outdoor plant that adds bright natural color to sunny spaces.", 299, 449, 4.6, "Outdoor Plants"],
  ["Bougainvillea Plant", "Hardy outdoor flowering plant known for colorful blooms and easy maintenance.", 349, 499, 4.7, "Outdoor Plants"],
  ["Anthurium Red", "Beautiful flowering plant with glossy green leaves and bright red flowers.", 599, 899, 4.8, "Flowering Plants"],
  ["Rose Plant", "Classic flowering plant with beautiful blooms, ideal for balconies and gardens.", 299, 449, 4.6, "Flowering Plants"],
  ["African Violet", "Compact houseplant with attractive green foliage and delicate purple flowers.", 399, 599, 4.5, "Flowering Plants"],
  ["Jade Plant", "Hardy succulent with thick green leaves that is easy to maintain indoors.", 199, 349, 4.8, "Succulents"],
  ["Echeveria Succulent", "Compact rosette-shaped succulent that looks beautiful on desks and windowsills.", 249, 399, 4.7, "Succulents"],
  ["Haworthia Zebra", "Small striped succulent ideal for desks, shelves and indoor plant collections.", 229, 349, 4.6, "Succulents"],
  ["Spider Plant", "Easy-care indoor plant with attractive arching leaves, suitable for homes and offices.", 299, 499, 4.8, "Air Purifying Plants"],
  ["ZZ Plant", "Tough and low-maintenance plant with glossy foliage, perfect for indoor spaces.", 449, 699, 4.9, "Air Purifying Plants"],
  ["Golden Money Plant", "Fast-growing trailing plant with attractive green and yellow leaves.", 309, 499, 4.7, "Air Purifying Plants"],
  ["Classic Ceramic Planter", "Minimal ceramic planter with a clean finish for modern home interiors.", 299, 449, 4.7, "Pots & Planters"],
  ["Self-Watering Planter", "Smart planter designed to help maintain consistent moisture for healthy plants.", 399, 599, 4.8, "Pots & Planters"],
  ["Terracotta Garden Pot", "Natural terracotta pot suitable for outdoor plants, flowers and herbs.", 199, 299, 4.6, "Pots & Planters"],
  ["Organic Plant Fertilizer", "Balanced organic fertilizer designed to support healthy plant growth.", 249, 349, 4.7, "Plant Care"],
  ["Plant Care Tool Kit", "Compact gardening kit containing essential tools for everyday plant maintenance.", 399, 599, 4.8, "Plant Care"],
  ["Neem Oil Plant Spray", "Natural plant-care spray suitable for helping manage common garden pests.", 199, 299, 4.6, "Plant Care"],
].map(([name, description, price, originalPrice, rating, category], index) => ({
  name,
  description,
  price,
  originalPrice,
  ratting: rating,
  numOfReview: 0,
  category,
  stock: "20",
  image: [imageFor(imageUrls[index % imageUrls.length])],
}));

const run = async () => {
  await mongoose.connect(process.env.DB_URI);
  const admin = await User.findOne({ role: "admin" }).select("_id").lean();
  if (!admin) throw new Error("An existing admin user is required to own the catalog");

  await Category.deleteMany({ name: { $nin: categoryNames } });
  for (const name of categoryNames) await Category.updateOne({ name }, { $set: { name } }, { upsert: true });

  const names = products.map((product) => product.name);
  await Product.deleteMany({ name: { $nin: names } });
  for (const product of products) {
    await Product.updateOne(
      { name: product.name },
      { $set: { ...product, user: admin._id } },
      { upsert: true },
    );
  }

  const [categoryCount, productCount] = await Promise.all([Category.countDocuments(), Product.countDocuments()]);
  console.log(`Plant House catalog ready: ${categoryCount} categories, ${productCount} products`);
  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exitCode = 1;
});
