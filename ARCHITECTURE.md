
# 🏗️ HRGF E-Commerce – Architecture Overview

This document outlines the architecture, technology stack, system flow, and key components of the **HRGF E-Commerce** full-stack project.

---

## ⚙️ Tech Stack

| Layer      | Stack                                     |
|------------|-------------------------------------------|
| Frontend   | React.js, React Router, React-Bootstrap   |
| Backend    | Django REST Framework (DRF)               |
| Auth       | JWT (via SimpleJWT)                       |
| Database   | SQLite (can upgrade to PostgreSQL)        |
| Styling    | Bootstrap / React-Bootstrap               |
| Payments   | Mock Razorpay integration                 |
| State Mgmt | React Context (for Auth and Theme)        |

---

## 🧱 System Architecture

```bash
+----------------------------+
|     React Frontend        |
|  - Pages: Home, Login     |
|  - Product UI, Cart UI    |
|  - Admin Dashboard        |
+-------------|-------------+
              |
       (Axios HTTP + JWT)
              |
+-------------v-------------+
|   Django REST Framework   |
|  - JWT Auth (Login/Register) |
|  - Products API (CRUD)    |
|  - Cart API               |
|  - Orders API             |
|  - Admin Views            |
+-------------|-------------+
              |
              v
+----------------------------+
|     SQLite Database        |
|  - Users, Products         |
|  - Cart Items, Orders      |
+----------------------------+
```

---

## 📂 Folder Structure

```
HRGF-E-Commerce-Django/
├── backend/
│   ├── accounts/       # JWT auth
│   ├── products/       # Product model & views
│   ├── cart/           # Cart logic
│   ├── orders/         # Order model, views
│   └── media/          # Poster image uploads
│
├── frontend/
│   ├── components/     # Navbar, cards, etc.
│   ├── pages/          # Home, Login, Cart, etc.
│   ├── context/        # Auth + ThemeContext
│   └── index.css
```

---

## 🔐 Authentication Flow

* On login/register → backend issues JWT (`access` + `refresh`)
* Tokens are stored in `localStorage`
* Every Axios request sends:
  `Authorization: Bearer <access_token>`
* Admin user is identified via `is_superuser`

---

## 📦 Product Management

* Authenticated users can create products
* Each product has:

  * `title`, `description`, `price`, `stock`, `poster_image`
* Only the creator or admin can edit/delete a product
* Public users can view & search products

---

## 🔍 Search Functionality

* `/products/?search=laptop`
* DRF `SearchFilter` used with `search_fields = ['title']`
* Live search handled via React `onChange` + Axios

---

## 🛒 Cart & Checkout Flow

* Authenticated user has their own cart
* Users can:

  * Add, update, or remove cart items
* On checkout:

  * Checks stock
  * Mock payment is made (`calling_razorpay()` always returns `True`)
  * Order is created, stock reduced
  * Cart is cleared

---

## 🧾 Orders

* Users can view their order history
* Admins can:

  * View all orders
  * (Future Scope) Update status: `shipped`, `cancelled`, etc.

---

## 🧑‍💻 Admin Panel Features

Accessible only to `is_superuser`:

* Add/edit/delete products
* View all orders
* Manage product inventory
* Basic dashboard UI with protected routes

---

## 🌐 Routes Overview

### Public Routes

* `/` → Home (product list + search)
* `/product/:id` → Product detail
* `/login`, `/register`

### User Routes

* `/cart`
* `/checkout`
* `/orders`

### Admin Routes

* `/admin`
* `/admin/products`
* `/admin/orders`

---


## 👤 Maintainer

**Shivam Kuite**
📫 [shivamkuite77@gmail.com](mailto:shivamkuite77@gmail.com)
🌐 [http://portfolio.cosmicai.in](http://portfolio.cosmicai.in)


