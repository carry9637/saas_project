require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MONGO_URI = process.env.MONGO_URI;

const userSchema = new mongoose.Schema({
  name: String, email: String, password: String, role: String,
});
const User = mongoose.model("User", userSchema);

(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");

    const exists = await User.findOne({ email: "admin@saas.com" });
    if (exists) {
      console.log("Admin already exists. Login: admin@saas.com / admin123");
      process.exit(0);
    }

    const hashed = await bcrypt.hash("admin123", 12);
    await User.create({ name: "Admin", email: "admin@saas.com", password: hashed, role: "admin" });
    console.log("Admin created:");
    console.log("   Email   : admin@saas.com");
    console.log("   Password: admin123");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err.message);
    process.exit(1);
  }
})();
