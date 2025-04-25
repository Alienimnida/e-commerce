
# 🛒 GadgetNest – E-commerce Platform

GadgetNest is a full-stack e-commerce platform where sellers can register and manage their products, and admins can monitor seller activity. The application supports user authentication, role-based access (admin/seller), product management, dashboards, and more.

## 👥 Team Members

- Ankita Chakraborty (22CS011019)  
- Arnab Kumar Mondal (22CS011036)  
- Arkajyoti Ghosh (22CS011032)  
- Arkodeep Das (22CS011034)  
- Akash Kumar Sadhukhan (22CS011012)

---

## 📁 Project Structure

```
gadgetnest/
├── client/            # React Frontend
├── server/            # Express Backend
└── README.md
```

---

## 🚀 Features

### 🔐 Authentication
- Sign up & sign in for sellers and admins
- Role-based redirection to dashboards
- Token-based login (JWT)

### 🧑‍💼 Admin Features
- View pending seller applications
- Approve or suspend sellers
- Email notifications on status change

### 🛍️ Seller Features
- Dashboard with navigation
- Add/edit/delete products
- Batch-based stock management
- Product image uploads with preview

### 🏪 Marketplace Features
- Homepage with hero banner carousel
- Product categories and featured listings
- Newsletter subscription (UI only)
- Search bar & user dropdown (UI only)

---

## 🛠️ Tech Stack

| Layer      | Tech Used                     |
|------------|-------------------------------|
| Frontend   | React, React Router, Axios    |
| Backend    | Node.js, Express.js           |
| Database   | MongoDB                       |
| Auth       | JWT (Token-based Auth)        |
| Styling    | Inline CSS-in-JS + Flexbox    |
| Emailing   | Nodemailer                    |
| File Upload| Multer / AWS S3 (optional)    |

---

## 📸 Screenshots

- Sign Up & Login Forms with Conditional Rendering  
- Seller Dashboard  
- Product Management Interface  
- Homepage with Carousel, Categories, and Products  

(Figma designs available [here](https://www.figma.com/design/zcBmBwAFb63kl6eBdd74kt/Untitled?node-id=0-1&t=LrKrwEypyi4P4GfU-1))

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Alienimnida/e-commerce.git
cd e-commerce
```

### 2. Set Up the Backend

```bash
cd server
npm install
# Add your MongoDB URI and secret keys to .env
npm start
```

### 3. Set Up the Frontend

```bash
cd client
npm install
npm start
```

---

## 🔑 Environment Variables

Create a `.env` file in `/server` with the following:

```
PORT=8000
MONGO_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

---

## 🧪 API Highlights

- `POST /api/auth/register` – User Signup  
- `POST /api/auth/login` – User Login  
- `GET /api/admin/pending-sellers` – View pending sellers  
- `PUT /api/admin/approve/:userId` – Approve seller  
- `PUT /api/admin/suspend/:userId` – Suspend seller  
- `POST /api/seller/products` – Add product (with image)  
- `GET /api/seller/products` – Get seller’s products  
- `PUT /api/seller/products/:id` – Update product  
- `DELETE /api/seller/products/:id` – Delete product  

---

## 📎 Resources

- 🔗 [GitHub Repository](https://github.com/Alienimnida/e-commerce.git)  
- 🎨 [Figma Design](https://www.figma.com/design/zcBmBwAFb63kl6eBdd74kt/Untitled?node-id=0-1&t=LrKrwEypyi4P4GfU-1)

---

