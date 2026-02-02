# Ladies Flavour Factory API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

### Login
- **URL:** `/users/login`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "email": "admin@example.com",
    "password": "password123"
  }
  ```
- **Note:** Returns a JWT token and User ID. The Postman collection automatically saves these as environment variables (`token`, `userId`).

---

## Users

### Get All Users
- **URL:** `/users`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer <token>`

### Create User
- **URL:** `/users`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "name": "New User",
    "email": "newuser@example.com",
    "password": "password123",
    "role": "<roleId>"
  }
  ```

### Update User
- **URL:** `/users/:id`
- **Method:** `PUT`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "name": "Updated Name"
  }
  ```

### Delete User
- **URL:** `/users/:id`
- **Method:** `DELETE`
- **Headers:** `Authorization: Bearer <token>`

---

## Roles

### Get All Roles
- **URL:** `/roles`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer <token>`

### Create Role
- **URL:** `/roles`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "name": "Manager",
    "permissions": ["view_products", "manage_stock"],
    "description": "Store Manager Role"
  }
  ```

### Update Role
- **URL:** `/roles/:id`
- **Method:** `PUT`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "permissions": ["view_products", "manage_stock", "view_reports"]
  }
  ```

### Delete Role
- **URL:** `/roles/:id`
- **Method:** `DELETE`
- **Headers:** `Authorization: Bearer <token>`

---

## Products

### Get All Products
- **URL:** `/products`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer <token>`

### Create Product
- **URL:** `/products`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "name": "Sample Product",
    "sku": "SKU-001",
    "category": "<categoryId>",
    "description": "A sample product description",
    "unitPrice": 100,
    "costPrice": 80,
    "stockQuantity": 50
  }
  ```

### Get Product By ID
- **URL:** `/products/:id`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer <token>`

### Update Product
- **URL:** `/products/:id`
- **Method:** `PUT`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "name": "Updated Product Name",
    "unitPrice": 120
  }
  ```

### Delete Product
- **URL:** `/products/:id`
- **Method:** `DELETE`
- **Headers:** `Authorization: Bearer <token>`

---

## Categories

### Get All Categories
- **URL:** `/categories`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer <token>`

### Create Category
- **URL:** `/categories`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "name": "Beverages",
    "description": "Drinks and liquids"
  }
  ```

### Update Category
- **URL:** `/categories/:id`
- **Method:** `PUT`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "description": "Updated description"
  }
  ```

### Delete Category
- **URL:** `/categories/:id`
- **Method:** `DELETE`
- **Headers:** `Authorization: Bearer <token>`

---

## Stock

### Get Stock Transactions
- **URL:** `/stock`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer <token>`

### Add Stock Transaction
- **URL:** `/stock`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "productId": "<productId>",
    "type": "IN",
    "quantity": 10,
    "reason": "Restock"
  }
  ```
