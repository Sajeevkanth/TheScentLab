# The Scent Lab

The Scent Lab is a modern MERN stack application designed to solve the blind buy problem when buying fragrances. By using visual data representation (Radar Charts) and similarity algorithms, it provides users with insights into fragrance notes, allowing for more informed purchasing decisions. It features a full-featured e-commerce platform for purchasing decants (samples) and full bottles.
![](https://github.com/Sajeevkanth/TheScentLab/blob/main/Homepage.png?raw=true)

## Live Demo
Website link: [https://thescentlab.netlify.app/](https://thescentlab.netlify.app/)

---

## Key Features

### Client / Marketplace
- **Smart Decant Inventory**: Browse and purchase fragrances in various sizes (decants vs. full bottles).
- **Visual Scent Search**: Interactive Radar Charts (Recharts) visualizing scent profiles (e.g., Woody, Floral, Spicy).
- **Note Similarity Engine**: Recommendation system using Jaccard similarity to suggest perfumes based on note overlap.
- **User Authentication**: Secure Login/Register using JWT.
- **Profile Management**: User dashboards to track order history and preferences.

### Admin Dashboard
- **Product Management**: CRUD operations for inventory.
- **Order Tracking**: Monitor and update order status.
- **Analytics**: Basic insights into sales and inventory levels.

---

## Tech Stack

- **Frontend**: React.js, Context API, CSS3, Recharts.
- **Backend**: Node.js, Express.js, RESTful API architecture.
- **Database**: MongoDB (Mongoose ODM).
- **Authentication**: JSON Web Tokens (JWT), Bcrypt.js.
- **Code Quality**: ESLint, Prettier (enforced style guide for clean, consistent code).

---

## Installation

Follow these steps to set up the project locally.

### Prerequisites
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)

### 1. Clone the Repository
```bash
git clone https://github.com/Sajeevkanth/TheScentLab
cd thescentlab
```

### 2. Backend Setup
Navigate to the server directory and install dependencies.
```bash
cd server
npm install
```

**Environment Variables:**
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### 3. Frontend Setup
Open a new terminal, navigate to the client directory, and install dependencies.
```bash
cd client
npm install
```

### 4. Running the Application

**Run backend (Terminal 1):**
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

**Run frontend (Terminal 2):**
```bash
cd client
npm start
# Client runs on http://localhost:3000
```
### 5. Accessing the Admin Dashboard
Log in with the default admin:
- **Email**: `admin@thescentlab.com`
- **Password**: `admin123`

---

## Roadmap

- [ ] **Community Reviews**: Social features for sharing fragrance reviews.

---
