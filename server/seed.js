/**
 * Seed script for The Scent Lab database
 * Run with: node seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Fragrance = require('./models/Fragrance');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const fragrances = [
    {
        name: "Aventus",
        brand: "Creed",
        description: "A bold, masculine fragrance opening with blackcurrant and Italian bergamot, evolving into a heart of pink peppers and birch. A modern classic that exudes confidence and success.",
        imageUrl: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400",
        price: { bottle: 435, perMl: 5.50 },
        scentProfile: { citrus: 75, floral: 20, woody: 60, spicy: 40, fresh: 65, musky: 50, sweet: 35, oriental: 25 },
        notes: {
            top: ["bergamot", "blackcurrant", "apple", "pineapple"],
            middle: ["pink pepper", "birch", "jasmine", "rose"],
            base: ["musk", "oakmoss", "ambergris", "vanilla"]
        },
        inventory: { sealedBottles: 5, bottleSize: 100, openDecantMl: 75 },
        gender: "masculine",
        concentration: "EDP",
        year: 2010
    },
    {
        name: "Baccarat Rouge 540",
        brand: "Maison Francis Kurkdjian",
        description: "An ethereal, crystalline fragrance built around saffron and jasmine, layered with a unique ambergris mineral accord. Instantly recognizable and utterly luxurious.",
        imageUrl: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400",
        price: { bottle: 325, perMl: 6.50 },
        scentProfile: { citrus: 15, floral: 45, woody: 55, spicy: 30, fresh: 25, musky: 40, sweet: 85, oriental: 70 },
        notes: {
            top: ["saffron", "jasmine"],
            middle: ["ambergris", "cedar"],
            base: ["fir resin", "cedar"]
        },
        inventory: { sealedBottles: 3, bottleSize: 70, openDecantMl: 45 },
        gender: "unisex",
        concentration: "EDP",
        year: 2015
    },
    {
        name: "Bleu de Chanel",
        brand: "Chanel",
        description: "A woody, aromatic fragrance for the man who defies convention. Fresh citrus and mint meet earthy cedar and sandalwood in perfect harmony.",
        imageUrl: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400",
        price: { bottle: 150, perMl: 2.50 },
        scentProfile: { citrus: 70, floral: 15, woody: 75, spicy: 45, fresh: 80, musky: 35, sweet: 20, oriental: 30 },
        notes: {
            top: ["lemon", "mint", "grapefruit", "pink pepper"],
            middle: ["ginger", "jasmine", "nutmeg", "iso e super"],
            base: ["cedar", "sandalwood", "labdanum", "incense"]
        },
        inventory: { sealedBottles: 8, bottleSize: 100, openDecantMl: 120 },
        gender: "masculine",
        concentration: "EDP",
        year: 2010
    },
    {
        name: "Black Orchid",
        brand: "Tom Ford",
        description: "A luxurious, sensual fragrance of rich, dark florals and spicy notes. Black truffle and ylang ylang create an intoxicating, mysterious aura.",
        imageUrl: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400",
        price: { bottle: 180, perMl: 3.60 },
        scentProfile: { citrus: 20, floral: 70, woody: 45, spicy: 65, fresh: 10, musky: 55, sweet: 60, oriental: 85 },
        notes: {
            top: ["truffle", "gardenia", "black currant", "ylang ylang"],
            middle: ["orchid", "spicy notes", "lotus wood", "fruit notes"],
            base: ["patchouli", "sandalwood", "dark chocolate", "incense", "amber", "vanilla", "vetiver", "balsam"]
        },
        inventory: { sealedBottles: 4, bottleSize: 100, openDecantMl: 55 },
        gender: "unisex",
        concentration: "EDP",
        year: 2006
    },
    {
        name: "La Vie Est Belle",
        brand: "Lancôme",
        description: "A gourmand floral expressing the joy of living. Iris and patchouli meet praline and vanilla in a declaration of happiness.",
        imageUrl: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400",
        price: { bottle: 135, perMl: 2.70 },
        scentProfile: { citrus: 25, floral: 65, woody: 30, spicy: 20, fresh: 35, musky: 40, sweet: 90, oriental: 45 },
        notes: {
            top: ["black currant", "pear"],
            middle: ["iris", "jasmine", "orange blossom"],
            base: ["praline", "vanilla", "patchouli", "tonka bean"]
        },
        inventory: { sealedBottles: 6, bottleSize: 75, openDecantMl: 90 },
        gender: "feminine",
        concentration: "EDP",
        year: 2012
    },
    {
        name: "Tobacco Vanille",
        brand: "Tom Ford",
        description: "An opulent, spicy oriental that captures the essence of a gentlemen's club. Tobacco leaf meets aromatic spices and rich vanilla.",
        imageUrl: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=400",
        price: { bottle: 275, perMl: 5.50 },
        scentProfile: { citrus: 10, floral: 15, woody: 50, spicy: 80, fresh: 5, musky: 35, sweet: 75, oriental: 95 },
        notes: {
            top: ["tobacco leaf", "spicy notes"],
            middle: ["vanilla", "tonka bean", "tobacco blossom", "cacao"],
            base: ["dried fruits", "wood sap"]
        },
        inventory: { sealedBottles: 2, bottleSize: 50, openDecantMl: 30 },
        gender: "unisex",
        concentration: "EDP",
        year: 2007
    },
    {
        name: "Light Blue",
        brand: "Dolce & Gabbana",
        description: "A timeless Mediterranean fragrance capturing the essence of a Sicilian summer. Crisp apple and cedar blend with jasmine and bamboo.",
        imageUrl: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=400",
        price: { bottle: 98, perMl: 1.96 },
        scentProfile: { citrus: 90, floral: 45, woody: 35, spicy: 15, fresh: 95, musky: 25, sweet: 30, oriental: 10 },
        notes: {
            top: ["sicilian lemon", "apple", "cedar", "bellflower"],
            middle: ["bamboo", "jasmine", "white rose"],
            base: ["cedar", "musk", "amber"]
        },
        inventory: { sealedBottles: 10, bottleSize: 100, openDecantMl: 150 },
        gender: "feminine",
        concentration: "EDT",
        year: 2001
    },
    {
        name: "Sauvage",
        brand: "Dior",
        description: "A bold, juicy freshness with a raw masculine edge. Calabrian bergamot and Ambroxan create a magnetic, instantly captivating trail.",
        imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400",
        price: { bottle: 160, perMl: 2.67 },
        scentProfile: { citrus: 80, floral: 10, woody: 55, spicy: 70, fresh: 75, musky: 45, sweet: 25, oriental: 35 },
        notes: {
            top: ["calabrian bergamot", "pepper"],
            middle: ["lavender", "pink pepper", "vetiver", "patchouli", "geranium", "elemi"],
            base: ["ambroxan", "cedar", "labdanum"]
        },
        inventory: { sealedBottles: 7, bottleSize: 100, openDecantMl: 85 },
        gender: "masculine",
        concentration: "EDP",
        year: 2015
    },
    {
        name: "Oud Wood",
        brand: "Tom Ford",
        description: "A composition of rare oud wood, sandalwood, and vetiver. Exotic rosewood and cardamom add warmth to this sophisticated scent.",
        imageUrl: "https://images.unsplash.com/photo-1619994403073-2cec844b8e63?w=400",
        price: { bottle: 280, perMl: 5.60 },
        scentProfile: { citrus: 15, floral: 20, woody: 95, spicy: 55, fresh: 20, musky: 40, sweet: 30, oriental: 75 },
        notes: {
            top: ["oud", "rosewood", "cardamom"],
            middle: ["sandalwood", "vetiver", "tonka bean"],
            base: ["amber"]
        },
        inventory: { sealedBottles: 3, bottleSize: 50, openDecantMl: 25 },
        gender: "unisex",
        concentration: "EDP",
        year: 2007
    },
    {
        name: "Miss Dior",
        brand: "Dior",
        description: "A fresh chypre floral with a modern edge. Grasse rose and rosewood meet patchouli in this elegant, feminine composition.",
        imageUrl: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400",
        price: { bottle: 155, perMl: 3.10 },
        scentProfile: { citrus: 40, floral: 85, woody: 40, spicy: 25, fresh: 55, musky: 30, sweet: 45, oriental: 35 },
        notes: {
            top: ["mandarin orange", "rose"],
            middle: ["grasse rose", "rosewood", "violet"],
            base: ["patchouli", "musk"]
        },
        inventory: { sealedBottles: 5, bottleSize: 100, openDecantMl: 65 },
        gender: "feminine",
        concentration: "EDP",
        year: 2017
    }
];

async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/thescentlab');
        console.log('Connected to MongoDB');

        // Clear existing data
        await Fragrance.deleteMany({});
        console.log('Cleared existing fragrances');

        // Insert seed data
        const result = await Fragrance.insertMany(fragrances);
        console.log(`Seeded ${result.length} fragrances`);

        console.log('\n✅ Database seeded successfully!');
        console.log('Sample fragrances added:');
        result.forEach(f => console.log(`  - ${f.brand} ${f.name}`));

        // Seed Admin User
        const adminEmail = 'admin@thescentlab.com';
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await User.create({
                name: 'Admin User',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin'
            });
            console.log('✅ Admin user created (admin@thescentlab.com / admin123)');
        } else {
            console.log('ℹ️ Admin user already exists');
        }

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\nDatabase connection closed');
    }
}

seedDatabase();
