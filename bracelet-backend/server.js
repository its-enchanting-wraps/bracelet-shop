import express from "express";
import cors from "cors";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const app = express();
app.use(cors());

const firebaseConfig = {
  apiKey: "AIzaSyAzQyqTfLq4g0BnvahrWOoBs6GVWZZShb8",
  authDomain: "enchanting-wraps-92c04.firebaseapp.com",
  projectId: "enchanting-wraps-92c04"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

app.get("/", (req, res) => {
  res.send("Bracelet API is running!");
});

app.get("/products", async (req, res) => {
  const snapshot = await getDocs(collection(db, "products"));
  const products = snapshot.docs.map(doc => doc.data());
  res.json(products);
});

app.listen(3000, () => console.log("Server running on port 3000"));
