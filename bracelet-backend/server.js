import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import admin from "firebase-admin";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// --------------------- FIREBASE ADMIN SETUP ---------------------
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
}

const db = admin.firestore();

// --------------------- ROUTES ---------------------

app.get("/", (req, res) => {
  res.send("Bracelet API is running! ✨");
});

// 🩷 Fetch all products
app.get("/products", async (req, res) => {
  try {
    const snapshot = await db.collection("products").get();
    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// 🩷 Add a new product (for later admin use)
app.post("/add-product", async (req, res) => {
  try {
    const { name, price, image, category, description } = req.body;
    if (!name || !price || !image)
      return res.status(400).json({ error: "Missing fields" });

    const docRef = await db.collection("products").add({
      name,
      price,
      image,
      category: category || "Uncategorized",
      description: description || "",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ success: true, id: docRef.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add product" });
  }
});

// 🩷 Contact form
app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    await db.collection("messages").add({
      name,
      email,
      message,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save message" });
  }
});

// 🩷 Root test
app.get("/", (req, res) => {
  res.send("✨ Enchanting Wraps Backend is live!");
});

// --------------------- START SERVER ---------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

