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
    // --- NICHE FRAGRANCES ---
    {
        name: "Aventus",
        brand: "Creed",
        description: "A bold, masculine fragrance opening with blackcurrant and Italian bergamot, evolving into a heart of pink peppers and birch. A modern classic that exudes confidence and success.",
        imageUrl: "https://fimgs.net/mdimg/perfume/375x500.9828.jpg",
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
        imageUrl: "https://fimgs.net/mdimg/perfume/375x500.33519.jpg",
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
        name: "Oud Wood",
        brand: "Tom Ford",
        description: "A composition of rare oud wood, sandalwood, and vetiver. Exotic rosewood and cardamom add warmth to this sophisticated scent.",
        imageUrl: "https://fimgs.net/mdimg/perfume-thumbs/375x500.1826.avif",
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
        name: "Tobacco Vanille",
        brand: "Tom Ford",
        description: "An opulent, spicy oriental that captures the essence of a gentlemen's club. Tobacco leaf meets aromatic spices and rich vanilla.",
        imageUrl: "https://fimgs.net/mdimg/perfume/375x500.1825.jpg",
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
        name: "Layton",
        brand: "Parfums de Marly",
        description: "A distinct, addictive scent combining spicy and fruity notes with hints of vanilla and cardamom.",
        imageUrl: "https://fimgs.net/mdimg/perfume/375x500.39314.jpg",
        price: { bottle: 250, perMl: 4.80 },
        scentProfile: { citrus: 40, floral: 40, woody: 60, spicy: 70, fresh: 50, musky: 30, sweet: 65, oriental: 55 },
        notes: {
            top: ["apple", "lavender", "mandarin", "bergamot"],
            middle: ["geranium", "violet", "jasmine"],
            base: ["vanilla", "cardamom", "sandalwood", "pepper", "guaiac wood"]
        },
        inventory: { sealedBottles: 4, bottleSize: 125, openDecantMl: 60 },
        gender: "masculine",
        concentration: "EDP",
        year: 2016
    },
    {
        name: "Herod",
        brand: "Parfums de Marly",
        description: "A luxurious tobacco-vanilla blend with cinnamon warmth, perfect for cold weather.",
        imageUrl: "https://fimgs.net/mdimg/perfume-thumbs/375x500.16939.avif",
        price: { bottle: 330, perMl: 5.20 },
        scentProfile: { citrus: 5, floral: 10, woody: 70, spicy: 80, fresh: 5, musky: 40, sweet: 75, oriental: 90 },
        notes: {
            top: ["cinnamon", "pepper"],
            middle: ["tobacco leaf", "incense", "labdanum", "osmanthus"],
            base: ["vanilla", "cedar", "vetiver", "iso e super", "musk"]
        },
        inventory: { sealedBottles: 3, bottleSize: 125, openDecantMl: 40 },
        gender: "masculine",
        concentration: "EDP",
        year: 2012
    },
    {
        name: "Delina",
        brand: "Parfums de Marly",
        description: "A charming and firmly modern floral bouquet. A highly nuanced fragrance which is both sweet and sensual.",
        imageUrl: "https://fimgs.net/mdimg/perfume/375x500.43871.jpg",
        price: { bottle: 295, perMl: 5.10 },
        scentProfile: { citrus: 35, floral: 95, woody: 30, spicy: 25, fresh: 45, musky: 40, sweet: 70, oriental: 20 },
        notes: {
            top: ["litchi", "rhubarb", "bergamot", "nutmeg"],
            middle: ["turkish rose", "peony", "musk", "petalia", "vanilla"],
            base: ["cashmeran", "cedar", "vetiver", "incense"]
        },
        inventory: { sealedBottles: 5, bottleSize: 75, openDecantMl: 80 },
        gender: "feminine",
        concentration: "EDP",
        year: 2017
    },
    {
        name: "Santal 33",
        brand: "Le Labo",
        description: "An iconic scent that intoxicates a man as much as a woman, introducing the extensive use of cardamom, iris, violet, and ambrox which crackle in the formula and bring to this smoking wood alloy.",
        imageUrl: "https://fimgs.net/mdimg/perfume/375x500.12201.jpg",
        price: { bottle: 310, perMl: 5.40 },
        scentProfile: { citrus: 10, floral: 30, woody: 90, spicy: 60, fresh: 20, musky: 50, sweet: 10, oriental: 40 },
        notes: {
            top: ["violet accord", "cardamom"],
            middle: ["iris", "papyrus", "ambrox"],
            base: ["cedarwood", "leather", "sandalwood"]
        },
        inventory: { sealedBottles: 8, bottleSize: 100, openDecantMl: 100 },
        gender: "unisex",
        concentration: "EDP",
        year: 2011
    },
    {
        name: "Reflection Man",
        brand: "Amouage",
        description: "A sophisticated and distinctive floral woody musk fragrance with a fresh, spicy, and slightly powdery character.",
        imageUrl: "https://fimgs.net/mdimg/perfume/375x500.920.jpg",
        price: { bottle: 360, perMl: 5.80 },
        scentProfile: { citrus: 15, floral: 75, woody: 50, spicy: 40, fresh: 60, musky: 40, sweet: 35, oriental: 20 },
        notes: {
            top: ["rosemary", "red pepper berries", "bitter orange leaves"],
            middle: ["neroli", "orris", "jasmine", "ylang-ylang"],
            base: ["vetiver", "patchouli", "sandalwood", "cedarwood"]
        },
        inventory: { sealedBottles: 2, bottleSize: 100, openDecantMl: 20 },
        gender: "masculine",
        concentration: "EDP",
        year: 2007
    },
    {
        name: "Interlude Man",
        brand: "Amouage",
        description: "Known as the 'Blue Beast', this is a spicy-woody fragrance that opens with zesty bergamot, oregano and pimento berry oil.",
        imageUrl: "https://fimgs.net/mdimg/perfume/375x500.15294.jpg",
        price: { bottle: 360, perMl: 5.80 },
        scentProfile: { citrus: 15, floral: 10, woody: 80, spicy: 90, fresh: 5, musky: 40, sweet: 45, oriental: 95 },
        notes: {
            top: ["bergamot", "oregano", "pimento berry oil"],
            middle: ["amber", "frankincense", "cistus", "opoponax"],
            base: ["leather", "agarwood smoke", "patchouli", "sandalwood"]
        },
        inventory: { sealedBottles: 3, bottleSize: 100, openDecantMl: 50 },
        gender: "masculine",
        concentration: "EDP",
        year: 2012
    },
    {
        name: "Grand Soir",
        brand: "Maison Francis Kurkdjian",
        description: "A magnificent amber fragrance that evokes the brilliance of a night in Paris. Warm, sweet, and resinous.",
        imageUrl: "https://fimgs.net/mdimg/perfume/375x500.40816.jpg",
        price: { bottle: 235, perMl: 4.50 },
        scentProfile: { citrus: 5, floral: 10, woody: 40, spicy: 35, fresh: 5, musky: 25, sweet: 85, oriental: 95 },
        notes: {
            top: ["cistus labdanum"],
            middle: ["benzoin"],
            base: ["tonka bean", "vanilla", "amber"]
        },
        inventory: { sealedBottles: 4, bottleSize: 70, openDecantMl: 35 },
        gender: "unisex",
        concentration: "EDP",
        year: 2016
    },
    {
        name: "Naxos",
        brand: "Xerjoff",
        description: "A tribute to Sicily, sparkling with citrus, lavender and jasmine, contrasting with precious spices, tobacco and honey.",
        imageUrl: "https://fimgs.net/mdimg/perfume-thumbs/375x500.30529.avif",
        price: { bottle: 250, perMl: 4.20 },
        scentProfile: { citrus: 35, floral: 40, woody: 30, spicy: 50, fresh: 30, musky: 20, sweet: 80, oriental: 60 },
        notes: {
            top: ["bergamot", "lemon", "lavender"],
            middle: ["jasmine", "cinnamon", "honey", "cashmeran"],
            base: ["tobacco leaf", "tonka bean", "vanilla"]
        },
        inventory: { sealedBottles: 6, bottleSize: 100, openDecantMl: 90 },
        gender: "unisex",
        concentration: "EDP",
        year: 2015
    },
    // --- DESIGNER FRAGRANCES ---
    {
        name: "Bleu de Chanel",
        brand: "Chanel",
        description: "A woody, aromatic fragrance for the man who defies convention. Fresh citrus and mint meet earthy cedar and sandalwood in perfect harmony.",
        imageUrl: "https://fimgs.net/mdimg/perfume/375x500.25967.jpg",
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
        name: "Sauvage",
        brand: "Dior",
        description: "A bold, juicy freshness with a raw masculine edge. Calabrian bergamot and Ambroxan create a magnetic, instantly captivating trail.",
        imageUrl: "https://fimgs.net/mdimg/perfume/375x500.48100.jpg",
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
        name: "Miss Dior",
        brand: "Dior",
        description: "A fresh chypre floral with a modern edge. Grasse rose and rosewood meet patchouli in this elegant, feminine composition.",
        imageUrl: "https://fimgs.net/mdimg/perfume-thumbs/375x500.68905.avif",
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
    },
    {
        name: "La Vie Est Belle",
        brand: "Lancôme",
        description: "A gourmand floral expressing the joy of living. Iris and patchouli meet praline and vanilla in a declaration of happiness.",
        imageUrl: "https://fimgs.net/mdimg/perfume/375x500.14982.jpg",
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
        name: "Black Orchid",
        brand: "Tom Ford",
        description: "A luxurious, sensual fragrance of rich, dark florals and spicy notes. Black truffle and ylang ylang create an intoxicating, mysterious aura.",
        imageUrl: "https://fimgs.net/mdimg/perfume/375x500.1018.jpg",
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
        name: "Light Blue",
        brand: "Dolce & Gabbana",
        description: "A timeless Mediterranean fragrance capturing the essence of a Sicilian summer. Crisp apple and cedar blend with jasmine and bamboo.",
        imageUrl: "https://fimgs.net/mdimg/perfume-thumbs/375x500.485.avif",
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
        name: "Acqua di Gio Profumo",
        brand: "Giorgio Armani",
        description: "A sophisticated, aquatic aromatic scent that blends fresh notes with woody and spicy undertones. Notes of incense give it a mysterious depth.",
        imageUrl: "https://fimgs.net/mdimg/perfume/375x500.29727.jpg",
        price: { bottle: 145, perMl: 2.10 },
        scentProfile: { citrus: 60, floral: 20, woody: 55, spicy: 40, fresh: 85, musky: 30, sweet: 10, oriental: 25 },
        notes: {
            top: ["bergamot", "sea notes"],
            middle: ["geranium", "rosemary", "sage"],
            base: ["patchouli", "incense"]
        },
        inventory: { sealedBottles: 6, bottleSize: 125, openDecantMl: 75 },
        gender: "masculine",
        concentration: "Parfum",
        year: 2015
    },
    {
        name: "Eros",
        brand: "Versace",
        description: "A fresh, woody and slightly oriental fragrance. Mint oil combined with green apple and Italian lemon. Warm glowing warmth.",
        imageUrl: "https://fimgs.net/mdimg/perfume-thumbs/375x500.16657.avif",
        price: { bottle: 95, perMl: 1.80 },
        scentProfile: { citrus: 50, floral: 15, woody: 45, spicy: 35, fresh: 60, musky: 20, sweet: 70, oriental: 40 },
        notes: {
            top: ["mint", "green apple", "lemon"],
            middle: ["tonka bean", "geranium", "ambroxan"],
            base: ["vanilla", "vetiver", "oakmoss", "cedar"]
        },
        inventory: { sealedBottles: 15, bottleSize: 100, openDecantMl: 200 },
        gender: "masculine",
        concentration: "EDT",
        year: 2012
    },
    {
        name: "Y EDP",
        brand: "Yves Saint Laurent",
        description: "An authentic fragrance expression capturing the essence of modern men. Fresh and woody, sensual and masculine.",
        imageUrl: "https://fimgs.net/mdimg/perfume-thumbs/375x500.50757.avif",
        price: { bottle: 130, perMl: 2.30 },
        scentProfile: { citrus: 40, floral: 20, woody: 60, spicy: 50, fresh: 70, musky: 30, sweet: 45, oriental: 25 },
        notes: {
            top: ["apple", "ginger", "bergamot"],
            middle: ["sage", "juniper berries", "geranium"],
            base: ["amberwood", "tonka bean", "cedar", "vetiver", "olibanum"]
        },
        inventory: { sealedBottles: 9, bottleSize: 100, openDecantMl: 110 },
        gender: "masculine",
        concentration: "EDP",
        year: 2018
    },
    {
        name: "The One",
        brand: "Dolce & Gabbana",
        description: "An elegant, sensual perfume that is decidedly modern but also a unique, timeless classic. Warm, spicy and tobacco-driven.",
        imageUrl: "https://fimgs.net/mdimg/perfume/375x500.31909.jpg",
        price: { bottle: 90, perMl: 1.50 },
        scentProfile: { citrus: 25, floral: 15, woody: 55, spicy: 65, fresh: 10, musky: 20, sweet: 40, oriental: 70 },
        notes: {
            top: ["grapefruit", "coriander", "basil"],
            middle: ["orange blossom", "ginger", "cardamom"],
            base: ["tobacco", "amber", "cedar"]
        },
        inventory: { sealedBottles: 8, bottleSize: 100, openDecantMl: 65 },
        gender: "masculine",
        concentration: "EDP",
        year: 2015
    },
    {
        name: "L'Interdit",
        brand: "Givenchy",
        description: "A tribute to bold femininity. A white floral cut with dark notes unleashing a bold luminosity that flirts with obscurity.",
        imageUrl: "https://fimgs.net/mdimg/perfume-thumbs/375x500.51488.avif",
        price: { bottle: 115, perMl: 2.20 },
        scentProfile: { citrus: 20, floral: 85, woody: 30, spicy: 20, fresh: 25, musky: 15, sweet: 55, oriental: 40 },
        notes: {
            top: ["pear", "bergamot"],
            middle: ["tuberose", "orange blossom", "jasmine"],
            base: ["patchouli", "vanilla", "ambroxan", "vetiver"]
        },
        inventory: { sealedBottles: 6, bottleSize: 80, openDecantMl: 55 },
        gender: "feminine",
        concentration: "EDP",
        year: 2018
    },
    {
        name: "Libre",
        brand: "Yves Saint Laurent",
        description: "The scent of freedom. A statement fragrance for those who live by their own rules. Lavender essence from France combines with the sensuality of Moroccan orange blossom.",
        imageUrl: "https://fimgs.net/mdimg/perfume/375x500.56077.jpg",
        price: { bottle: 135, perMl: 2.50 },
        scentProfile: { citrus: 45, floral: 70, woody: 25, spicy: 20, fresh: 55, musky: 30, sweet: 40, oriental: 30 },
        notes: {
            top: ["lavender", "mandarin orange", "black currant", "petitgrain"],
            middle: ["lavender", "orange blossom", "jasmine"],
            base: ["madagascar vanilla", "musk", "cedar", "ambergris"]
        },
        inventory: { sealedBottles: 10, bottleSize: 90, openDecantMl: 85 },
        gender: "feminine",
        concentration: "EDP",
        year: 2019
    },
    {
        name: "Spicebomb Extreme",
        brand: "Viktor&Rolf",
        description: "An explosion of heat. A longer lasting, deeper, and more extreme fragrance than the original Spicebomb, utilizing notes of tobacco and black pepper.",
        imageUrl: "https://fimgs.net/mdimg/perfume/375x500.30499.jpg",
        price: { bottle: 125, perMl: 2.80 },
        scentProfile: { citrus: 10, floral: 5, woody: 45, spicy: 95, fresh: 10, musky: 25, sweet: 50, oriental: 80 },
        notes: {
            top: ["grapefruit", "pimento", "black pepper"],
            middle: ["cinnamon", "cumin", "saffron"],
            base: ["tobacco", "amber", "black vanilla", "cistus"]
        },
        inventory: { sealedBottles: 5, bottleSize: 90, openDecantMl: 40 },
        gender: "masculine",
        concentration: "EDP",
        year: 2015
    },

    // --- CLONE FRAGRANCES (Lattafa, Armaf, Afnan) ---
    {
        name: "Club de Nuit Intense Man",
        brand: "Armaf",
        description: "A provocative woody spicy scent that opens with fresh fruity notes of lemon, apple and blackcurrant. Famous for being a high-quality alternative to Creed Aventus.",
        imageUrl: "https://fimgs.net/mdimg/perfume/375x500.34696.jpg",
        price: { bottle: 45, perMl: 0.80 },
        scentProfile: { citrus: 80, floral: 15, woody: 60, spicy: 40, fresh: 70, musky: 50, sweet: 30, oriental: 20 },
        notes: {
            top: ["lemon", "blackcurrant", "apple", "bergamot", "pineapple"],
            middle: ["rose", "jasmine", "birch"],
            base: ["vanilla", "ambergris", "musk", "patchouli"]
        },
        inventory: { sealedBottles: 25, bottleSize: 105, openDecantMl: 300 },
        gender: "masculine",
        concentration: "EDT",
        year: 2015
    },
    {
        name: "Khamrah",
        brand: "Lattafa",
        description: "A luxurious oriental-spicy fragrance that smells like warm apple pie with cinnamon and dates. A sophisticated alternative often compared to Angels' Share.",
        imageUrl: "https://fimgs.net/mdimg/perfume/375x500.75805.jpg",
        price: { bottle: 55, perMl: 1.00 },
        scentProfile: { citrus: 5, floral: 10, woody: 55, spicy: 85, fresh: 0, musky: 20, sweet: 90, oriental: 95 },
        notes: {
            top: ["cinnamon", "nutmeg", "bergamot"],
            middle: ["dates", "praline", "tuberose", "mahonial"],
            base: ["vanilla", "tonka bean", "benzoin", "myrrh", "amberwood", "akigalawood"]
        },
        inventory: { sealedBottles: 20, bottleSize: 100, openDecantMl: 150 },
        gender: "unisex",
        concentration: "EDP",
        year: 2022
    },
    {
        name: "Asad",
        brand: "Lattafa",
        description: "A spicy, powdery, and woody fragrance for men. Rich and sophisticated, often compared to Dior Sauvage Elixir.",
        imageUrl: "https://fimgs.net/mdimg/perfume-thumbs/375x500.72821.avif",
        price: { bottle: 35, perMl: 0.70 },
        scentProfile: { citrus: 10, floral: 10, woody: 75, spicy: 90, fresh: 20, musky: 30, sweet: 40, oriental: 80 },
        notes: {
            top: ["black pepper", "tobacco", "pineapple"],
            middle: ["patchouli", "coffee", "iris"],
            base: ["vanilla", "amber", "dry wood", "benzoin", "labdanum"]
        },
        inventory: { sealedBottles: 18, bottleSize: 100, openDecantMl: 120 },
        gender: "masculine",
        concentration: "EDP",
        year: 2021
    },
    {
        name: "9pm",
        brand: "Afnan",
        description: "A sweet, fruity, and spicy fragrance with vanilla undertones. A playful evening scent broadly resembling Ultra Male.",
        imageUrl: "https://fimgs.net/mdimg/perfume/375x500.65414.jpg",
        price: { bottle: 40, perMl: 0.75 },
        scentProfile: { citrus: 30, floral: 20, woody: 30, spicy: 60, fresh: 40, musky: 20, sweet: 85, oriental: 50 },
        notes: {
            top: ["apple", "cinnamon", "wild lavender", "bergamot"],
            middle: ["orange blossom", "lily-of-the-valley"],
            base: ["vanilla", "tonka bean", "amber", "patchouli"]
        },
        inventory: { sealedBottles: 15, bottleSize: 100, openDecantMl: 100 },
        gender: "masculine",
        concentration: "EDP",
        year: 2020
    },
    {
        name: "Supremacy Not Only Intense",
        brand: "Afnan",
        description: "A fruity chypre fragrance that opens with blackcurrant and apple, drying down to oakmoss and musk. An excellent, long-lasting alternative to Aventus style scents.",
        imageUrl: "https://fimgs.net/mdimg/perfume-thumbs/375x500.68271.avif",
        price: { bottle: 55, perMl: 0.90 },
        scentProfile: { citrus: 60, floral: 15, woody: 60, spicy: 35, fresh: 50, musky: 65, sweet: 25, oriental: 20 },
        notes: {
            top: ["black currant", "bergamot", "apple"],
            middle: ["oakmoss", "patchouli", "lavender"],
            base: ["ambergris", "musk", "saffron"]
        },
        inventory: { sealedBottles: 12, bottleSize: 100, openDecantMl: 80 },
        gender: "masculine",
        concentration: "Extrait",
        year: 2021
    },
    {
        name: "Tres Nuit",
        brand: "Armaf",
        description: "An aromatic spicy fragrance. Fresh lemon and verbena with a heart of violet and lavender. Similar vibe to Green Irish Tweed.",
        imageUrl: "https://fimgs.net/mdimg/perfume/375x500.27711.jpg",
        price: { bottle: 30, perMl: 0.60 },
        scentProfile: { citrus: 55, floral: 65, woody: 30, spicy: 25, fresh: 80, musky: 20, sweet: 25, oriental: 10 },
        notes: {
            top: ["lemon", "lemon verbena", "iris"],
            middle: ["lavender", "violet", "spicy notes"],
            base: ["ambergris", "sandalwood"]
        },
        inventory: { sealedBottles: 10, bottleSize: 100, openDecantMl: 60 },
        gender: "masculine",
        concentration: "EDT",
        year: 2015
    },
    {
        name: "Club de Nuit Milestone",
        brand: "Armaf",
        description: "A woody floral musk fragrance. Salty, fruity, and marine. Often compared to Millesime Imperial.",
        imageUrl: "https://fimgs.net/mdimg/perfume-thumbs/375x500.64104.avif",
        price: { bottle: 45, perMl: 0.85 },
        scentProfile: { citrus: 60, floral: 30, woody: 35, spicy: 10, fresh: 85, musky: 45, sweet: 45, oriental: 15 },
        notes: {
            top: ["sea notes", "red fruits", "bergamot"],
            middle: ["violet", "white woods", "sandalwood"],
            base: ["musk", "ambroxan", "vetiver"]
        },
        inventory: { sealedBottles: 14, bottleSize: 105, openDecantMl: 95 },
        gender: "unisex",
        concentration: "EDP",
        year: 2019
    },
    {
        name: "Turathi Blue",
        brand: "Afnan",
        description: "A citrus aromatic fragrance using substantial grapefruit and woody notes. A dense, blue fragrance often compared to Tygar.",
        imageUrl: "https://fimgs.net/mdimg/perfume-thumbs/375x500.70839.avif",
        price: { bottle: 40, perMl: 0.80 },
        scentProfile: { citrus: 85, floral: 10, woody: 55, spicy: 40, fresh: 75, musky: 50, sweet: 20, oriental: 30 },
        notes: {
            top: ["citrus"],
            middle: ["amber", "woodsy notes"],
            base: ["musk", "patchouli", "spices"]
        },
        inventory: { sealedBottles: 16, bottleSize: 90, openDecantMl: 100 },
        gender: "masculine",
        concentration: "EDP",
        year: 2021
    },
    {
        name: "Fakhar Black",
        brand: "Lattafa",
        description: "An amber fragrance for men. A fresh, sweet, and aromatic scent often cited as a twist on Y EDP.",
        imageUrl: "https://fimgs.net/mdimg/perfume-thumbs/375x500.70465.avif",
        price: { bottle: 30, perMl: 0.60 },
        scentProfile: { citrus: 50, floral: 30, woody: 40, spicy: 45, fresh: 65, musky: 25, sweet: 50, oriental: 20 },
        notes: {
            top: ["apple", "bergamot", "ginger"],
            middle: ["lavender", "sage", "juniper berries", "geranium"],
            base: ["tonka bean", "amberwood", "cedar", "vetiver"]
        },
        inventory: { sealedBottles: 12, bottleSize: 100, openDecantMl: 55 },
        gender: "masculine",
        concentration: "EDP",
        year: 2021
    },
    {
        name: "Ameer Al Oudh Intense Oud",
        brand: "Lattafa",
        description: "A warm, woody, sugary oud fragrance. Cozy and inviting, sharing similarities with By the Fireplace.",
        imageUrl: "https://fimgs.net/mdimg/perfume-thumbs/375x500.64947.avif",
        price: { bottle: 25, perMl: 0.50 },
        scentProfile: { citrus: 0, floral: 5, woody: 80, spicy: 50, fresh: 0, musky: 30, sweet: 85, oriental: 90 },
        notes: {
            top: ["woodsy notes", "oud"],
            middle: ["vanilla", "sugar"],
            base: ["oud", "sandalwood", "herbal notes"]
        },
        inventory: { sealedBottles: 20, bottleSize: 100, openDecantMl: 110 },
        gender: "unisex",
        concentration: "EDP",
        year: 2021
    },
    {
        name: "Coco Mademoiselle",
        brand: "Chanel",
        description: "The essence of a bold, free woman. An oriental fragrance with a strong personality, yet surprisingly fresh.",
        imageUrl: "https://fimgs.net/mdimg/perfume/375x500.611.jpg",
        price: { bottle: 160, perMl: 3.20 },
        scentProfile: { citrus: 60, floral: 70, woody: 40, spicy: 30, fresh: 50, musky: 35, sweet: 45, oriental: 40 },
        notes: {
            top: ["orange", "mandarin orange", "bergamot", "orange blossom"],
            middle: ["turkish rose", "jasmine", "mimosa", "ylang-ylang"],
            base: ["patchouli", "white musk", "vanilla", "vetiver", "tonka bean", "opoponax"]
        },
        inventory: { sealedBottles: 8, bottleSize: 100, openDecantMl: 60 },
        gender: "feminine",
        concentration: "EDP",
        year: 2001
    },
    {
        name: "Alien",
        brand: "Mugler",
        description: "A rich floral woody amber fragrance containing jasmine sambac, cashmeran wood and white amber. It is a fragrance whose trail expresses a benevolent force.",
        imageUrl: "https://fimgs.net/mdimg/perfume/375x500.707.jpg",
        price: { bottle: 120, perMl: 2.40 },
        scentProfile: { citrus: 5, floral: 90, woody: 60, spicy: 20, fresh: 10, musky: 30, sweet: 40, oriental: 75 },
        notes: {
            top: ["jasmine sambac"],
            middle: ["cashmeran wood"],
            base: ["white amber"]
        },
        inventory: { sealedBottles: 5, bottleSize: 60, openDecantMl: 40 },
        gender: "feminine",
        concentration: "EDP",
        year: 2005
    },
    {
        name: "Angel",
        brand: "Mugler",
        description: "The first gourmand perfume in the history of perfumery. A blend of patchouli, praline, red berries and vanilla.",
        imageUrl: "https://fimgs.net/mdimg/perfume/375x500.704.jpg",
        price: { bottle: 130, perMl: 2.60 },
        scentProfile: { citrus: 20, floral: 15, woody: 45, spicy: 30, fresh: 10, musky: 35, sweet: 95, oriental: 80 },
        notes: {
            top: ["cotton candy", "coconut", "cassis", "melon", "jasmine", "bergamot"],
            middle: ["honey", "red berries", "blackberry", "plum", "apricot", "jasmine", "peach", "orchid"],
            base: ["patchouli", "chocolate", "caramel", "vanilla", "tonka bean", "amber", "musk"]
        },
        inventory: { sealedBottles: 4, bottleSize: 50, openDecantMl: 30 },
        gender: "feminine",
        concentration: "EDP",
        year: 1992
    },
    {
        name: "Good Girl",
        brand: "Carolina Herrera",
        description: "A floral oriental fragrance that reveals the duality of the modern woman. Tuberose and roasted tonka bean create a mysterious and deep scent.",
        imageUrl: "https://fimgs.net/mdimg/perfume/375x500.39681.jpg",
        price: { bottle: 135, perMl: 2.70 },
        scentProfile: { citrus: 10, floral: 75, woody: 30, spicy: 40, fresh: 10, musky: 25, sweet: 80, oriental: 60 },
        notes: {
            top: ["almond", "coffee", "bergamot", "lemon"],
            middle: ["tuberose", "jasmine sambac", "orange blossom", "orris", "bulgarian rose"],
            base: ["tonka bean", "cacao", "vanilla", "praline", "sandalwood", "musk", "amber", "cashmere wood"]
        },
        inventory: { sealedBottles: 12, bottleSize: 80, openDecantMl: 65 },
        gender: "feminine",
        concentration: "EDP",
        year: 2016
    },
    {
        name: "Pure XS",
        brand: "Paco Rabanne",
        description: "A vibrant, magnetic and fresh oriental with a permanent in-and-out between cold and hot, gentle and intense. Ginger, vanilla and myrrh.",
        imageUrl: "https://fimgs.net/mdimg/perfume-thumbs/375x500.46038.avif",
        price: { bottle: 95, perMl: 1.90 },
        scentProfile: { citrus: 35, floral: 10, woody: 40, spicy: 75, fresh: 45, musky: 30, sweet: 65, oriental: 50 },
        notes: {
            top: ["ginger", "green accord", "thyme", "bergamot", "grapefruit"],
            middle: ["vanilla", "cinnamon", "leather", "liquor", "apple"],
            base: ["cedar", "myrrh", "sugar", "cashmeran", "patchouli", "woody notes"]
        },
        inventory: { sealedBottles: 8, bottleSize: 100, openDecantMl: 70 },
        gender: "masculine",
        concentration: "EDT",
        year: 2017
    },
    {
        name: "Jazz Club",
        brand: "Maison Margiela",
        description: "A woody and spicy fragrance that reminisces of an anthology of classic cocktails and coppery tones through balmy notes of rich tobacco and vanilla.",
        imageUrl: "https://fimgs.net/mdimg/perfume/375x500.20541.jpg",
        price: { bottle: 160, perMl: 3.20 },
        scentProfile: { citrus: 15, floral: 5, woody: 55, spicy: 60, fresh: 10, musky: 25, sweet: 50, oriental: 65 },
        notes: {
            top: ["pink pepper", "lemon", "neroli"],
            middle: ["rum", "clary sage", "java vetiver oil"],
            base: ["tobacco leaf", "vanilla bean", "styrax"]
        },
        inventory: { sealedBottles: 10, bottleSize: 100, openDecantMl: 120 },
        gender: "unisex",
        concentration: "EDT",
        year: 2013
    },
    {
        name: "By the Fireplace",
        brand: "Maison Margiela",
        description: "A warm and spicy fragrance aimed to evoke the feeling of sitting by a fireplace. Chestnuts and woody notes dominate.",
        imageUrl: "https://fimgs.net/mdimg/perfume/375x500.31623.jpg",
        price: { bottle: 160, perMl: 3.20 },
        scentProfile: { citrus: 5, floral: 5, woody: 85, spicy: 40, fresh: 0, musky: 20, sweet: 60, oriental: 70 },
        notes: {
            top: ["cloves", "pink pepper", "orange blossom"],
            middle: ["chestnut", "guaiac wood", "juniper"],
            base: ["vanilla", "peru balsam", "cashmeran"]
        },
        inventory: { sealedBottles: 8, bottleSize: 100, openDecantMl: 90 },
        gender: "unisex",
        concentration: "EDT",
        year: 2015
    },
    {
        name: "Ombre Leather",
        brand: "Tom Ford",
        description: "A deep textural scent that imprints you with a tactile sensuality. It feels different, beautiful and captivating. Leather and florals.",
        imageUrl: "https://fimgs.net/mdimg/perfume/375x500.50239.jpg",
        price: { bottle: 205, perMl: 4.10 },
        scentProfile: { citrus: 5, floral: 30, woody: 40, spicy: 50, fresh: 10, musky: 40, sweet: 15, oriental: 70 },
        notes: {
            top: ["cardamom"],
            middle: ["leather", "jasmine sambac"],
            base: ["amber", "moss", "patchouli"]
        },
        inventory: { sealedBottles: 6, bottleSize: 100, openDecantMl: 55 },
        gender: "unisex",
        concentration: "EDP",
        year: 2018
    },
    {
        name: "Dior Homme Intense",
        brand: "Dior",
        description: "A powdery, woody, floral musk fragrance. Iris is the main star here, giving it a lipsticky, luxurious vibe. Sophisticated and sexy.",
        imageUrl: "https://fimgs.net/mdimg/perfume/375x500.13016.jpg",
        price: { bottle: 140, perMl: 2.80 },
        scentProfile: { citrus: 5, floral: 75, woody: 60, spicy: 25, fresh: 10, musky: 50, sweet: 45, oriental: 40 },
        notes: {
            top: ["lavender"],
            middle: ["iris", "ambrette", "pear"],
            base: ["virginia cedar", "vetiver"]
        },
        inventory: { sealedBottles: 5, bottleSize: 100, openDecantMl: 70 },
        gender: "masculine",
        concentration: "EDP",
        year: 2011
    },
    {
        name: "Ultra Male",
        brand: "Jean Paul Gaultier",
        description: "An intense, spicy, and fruity fragrance. Known for its 'bubblegum' sweetness from pear and vanilla. A clubbing king.",
        imageUrl: "https://fimgs.net/mdimg/perfume/375x500.30947.jpg",
        price: { bottle: 120, perMl: 2.40 },
        scentProfile: { citrus: 25, floral: 15, woody: 20, spicy: 55, fresh: 40, musky: 25, sweet: 90, oriental: 50 },
        notes: {
            top: ["pear", "lavender", "mint", "bergamot", "lemon"],
            middle: ["cinnamon", "sage", "caraway"],
            base: ["black vanilla husk", "amber", "patchouli", "cedar"]
        },
        inventory: { sealedBottles: 10, bottleSize: 125, openDecantMl: 150 },
        gender: "masculine",
        concentration: "EDT",
        year: 2015
    },
    {
        name: "Erba Pura",
        brand: "Xerjoff",
        description: "A delicious and modern blend of Mediterranean citrus and sweet fruits layered over a warm and sensual amber oriental base.",
        imageUrl: "https://fimgs.net/mdimg/perfume-thumbs/375x500.55157.avif",
        price: { bottle: 250, perMl: 4.20 },
        scentProfile: { citrus: 60, floral: 20, woody: 10, spicy: 10, fresh: 50, musky: 60, sweet: 85, oriental: 30 },
        notes: {
            top: ["sicilian orange", "calabrian bergamot", "sicilian lemon"],
            middle: ["fruits"],
            base: ["white musk", "madagascar vanilla", "amber"]
        },
        inventory: { sealedBottles: 5, bottleSize: 100, openDecantMl: 80 },
        gender: "unisex",
        concentration: "EDP",
        year: 2019
    },
    {
        name: "Cedrat Boise",
        brand: "Mancera",
        description: "A vibrant citrus aromatic fragrance with woody and fruity undertones. Often compared to Aventus but with its own distinct character.",
        imageUrl: "https://fimgs.net/mdimg/perfume/375x500.15211.jpg",
        price: { bottle: 120, perMl: 2.00 },
        scentProfile: { citrus: 70, floral: 10, woody: 65, spicy: 30, fresh: 60, musky: 30, sweet: 25, oriental: 15 },
        notes: {
            top: ["sicilian lemon", "black currant", "bergamot", "spicy notes"],
            middle: ["fruity notes", "patchouli leaf", "water jasmine"],
            base: ["cedar", "leather", "sandalwood", "vanilla", "white musk", "moss"]
        },
        inventory: { sealedBottles: 8, bottleSize: 120, openDecantMl: 140 },
        gender: "unisex",
        concentration: "EDP",
        year: 2011
    },
    {
        name: "Red Tobacco",
        brand: "Mancera",
        description: "An incredibly potent woody-spicy fragrance. Dominant tobacco and oud notes with spices. Not for the faint of heart.",
        imageUrl: "https://fimgs.net/mdimg/perfume/375x500.46663.jpg",
        price: { bottle: 140, perMl: 2.40 },
        scentProfile: { citrus: 5, floral: 5, woody: 75, spicy: 90, fresh: 0, musky: 25, sweet: 45, oriental: 95 },
        notes: {
            top: ["cinnamon", "agarwood (oud)", "saffron", "incense", "nutmeg", "green apple", "white pear"],
            middle: ["patchouli", "jasmine"],
            base: ["tobacco", "madagascar vanilla", "amber", "guaiac wood", "sandalwood", "white musk", "haitian vetiver"]
        },
        inventory: { sealedBottles: 4, bottleSize: 120, openDecantMl: 55 },
        gender: "unisex",
        concentration: "EDP",
        year: 2017
    },
    {
        name: "Explorer",
        brand: "Montblanc",
        description: "An unconventional woody-aromatic-leather scent. A very popular and safer alternative to Aventus.",
        imageUrl: "https://fimgs.net/mdimg/perfume/375x500.52002.jpg",
        price: { bottle: 80, perMl: 1.60 },
        scentProfile: { citrus: 65, floral: 10, woody: 55, spicy: 35, fresh: 70, musky: 45, sweet: 15, oriental: 20 },
        notes: {
            top: ["bergamot", "pink pepper", "clary sage"],
            middle: ["haitian vetiver", "leather"],
            base: ["ambroxan", "akigalawood", "indonesian patchouli leaf", "cacao pod"]
        },
        inventory: { sealedBottles: 15, bottleSize: 100, openDecantMl: 180 },
        gender: "masculine",
        concentration: "EDP",
        year: 2019
    },
    {
        name: "Versace Pour Homme",
        brand: "Versace",
        description: "A classic fougere fragrance. Clean, fresh, and citrusy. Perfect for everyday wear or office.",
        imageUrl: "https://fimgs.net/mdimg/perfume/375x500.2318.jpg",
        price: { bottle: 75, perMl: 1.50 },
        scentProfile: { citrus: 80, floral: 35, woody: 20, spicy: 20, fresh: 90, musky: 30, sweet: 10, oriental: 5 },
        notes: {
            top: ["lemon", "bergamot", "neroli", "rose de mai"],
            middle: ["hyacinth", "cedar", "clary sage", "geranium"],
            base: ["tonka bean", "musk", "amber"]
        },
        inventory: { sealedBottles: 12, bottleSize: 100, openDecantMl: 130 },
        gender: "masculine",
        concentration: "EDT",
        year: 2008
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

        console.log('\nDatabase seeded successfully!');

        // Seed Admin User
        const adminEmail = 'admin@thescentlab.com';
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await User.create({
                name: 'Admin User',
                email: adminEmail,
                password: hashedPassword,
            });
            console.log('Admin user created (admin@thescentlab.com / admin123)');
        } else {
            console.log('Admin user already exists');
        }

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\nDatabase connection closed');
    }
}

seedDatabase();
