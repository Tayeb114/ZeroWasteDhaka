const mongoose = require("mongoose");
const User = require("./models/User");
const Listing = require("./models/Listing");
const WasteLog = require("./models/WasteLog");
require("dotenv").config();

const volunteersData = [
  { name: "Asif Rahman", email: "asif@example.com", password: "password123", role: "volunteer", points: 400, rescuesCompleted: 4 },
  { name: "Farzana Yesmin", email: "farzana@example.com", password: "password123", role: "volunteer", points: 300, rescuesCompleted: 3 },
  { name: "Tanvir Ahmed", email: "tanvir@example.com", password: "password123", role: "volunteer", points: 100, rescuesCompleted: 1 },
];

const managersData = [
  { name: "Kacchi Bhai (Dhanmondi)", email: "kacchi@example.com", password: "password123", role: "manager", points: 500, donationsCompleted: 5 },
  { name: "Rahim Uddin", email: "rahim@example.com", password: "password123", role: "manager", points: 200, donationsCompleted: 2 },
  { name: "Sultans Dine", email: "sultans@example.com", password: "password123", role: "manager", points: 100, donationsCompleted: 1 },
];

const seedDatabase = async () => {
  try {
    // Connect to database
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/zerowastedhaka"
    );
    console.log("Database connected for seeding...");

    // Clear existing data
    await User.deleteMany();
    await Listing.deleteMany();
    await WasteLog.deleteMany();
    console.log("Cleared existing data.");

    // Seed Users (Pre-save hook will hash passwords automatically)
    const volunteers = await User.create(volunteersData);
    const managers = await User.create(managersData);
    console.log(`Seeded ${volunteers.length} volunteers and ${managers.length} managers.`);

    const rahim = managers.find((m) => m.email === "rahim@example.com");
    const kacchi = managers.find((m) => m.email === "kacchi@example.com");

    // Seed food listings
    const sampleListings = [
      {
        title: "Mutton Biryani - 5kg",
        category: "Rice/Biryani",
        weightKg: 5,
        location: "Dhanmondi",
        imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80",
        status: "available",
        postedBy: rahim._id,
      },
      {
        title: "Chicken Curry & Roti",
        category: "Curries",
        weightKg: 3,
        location: "Gulshan",
        imageUrl: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80",
        status: "available",
        postedBy: kacchi._id,
      },
    ];

    const listings = await Listing.create(sampleListings);
    console.log(`Seeded ${listings.length} available food listings.`);

    console.log("Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding Error:", error.message);
    process.exit(1);
  }
};

seedDatabase();
