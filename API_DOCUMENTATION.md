# Ladies Flavour Factory API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

### Login
- **URL:** `/users/login`
- **Method:** `POST`
- **Access:** Public
- **Body:**
  ```json
  {
    "email": "admin@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "_id": "...",
    "name": "User Name",
    "email": "user@example.com",
    "role": { ... },
    "token": "..."
  }
  ```

### Update Profile
- **URL:** `/users/profile`
- **Method:** `PUT`
- **Access:** Private
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "name": "Updated Name",
    "email": "updated@example.com",
    "password": "newpassword123"
  }
  ```

---

## Users

### Get All Users
- **URL:** `/users`
- **Method:** `GET`
- **Access:** Private (Permission: `view_users`)
- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:**
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `search`: Search by name or email

### Create User
- **URL:** `/users`
- **Method:** `POST`
- **Access:** Private (Permission: `create_user`)
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
- **Access:** Private (Permission: `edit_user`)
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "name": "Updated Name",
    "email": "updated@example.com",
    "role": "<roleId>"
  }
  ```

### Delete User
- **URL:** `/users/:id`
- **Method:** `DELETE`
- **Access:** Private (Permission: `delete_user`)
- **Headers:** `Authorization: Bearer <token>`

---

## Roles

### Get All Roles
- **URL:** `/roles`
- **Method:** `GET`
- **Access:** Private (Permission: `view_roles`)
- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:**
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `search`: Search by name

### Create Role
- **URL:** `/roles`
- **Method:** `POST`
- **Access:** Private (Permission: `create_role`)
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "name": "Manager",
    "permissions": ["view_products", "manage_stock", "view_reports"],
    "description": "Store Manager Role"
  }
  ```

### Update Role
- **URL:** `/roles/:id`
- **Method:** `PUT`
- **Access:** Private (Permission: `edit_role`)
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "name": "Updated Role Name",
    "permissions": ["view_products"],
    "description": "Updated description"
  }
  ```

### Delete Role
- **URL:** `/roles/:id`
- **Method:** `DELETE`
- **Access:** Private (Permission: `delete_role`)
- **Headers:** `Authorization: Bearer <token>`

---

## Catalogs

### Get All Catalogs
- **URL:** `/catalogs`
- **Method:** `GET`
- **Access:** Private (Permission: `view_catalog`)
- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:**
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `search`: Search by name or code

### Create Catalog
- **URL:** `/catalogs`
- **Method:** `POST`
- **Access:** Private (Permission: `manage_catalog`)
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "name": "Beverages",
    "code": "BEV"
  }
  ```

### Update Catalog
- **URL:** `/catalogs/:id`
- **Method:** `PUT`
- **Access:** Private (Permission: `manage_catalog`)
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "name": "Cold Beverages",
    "code": "CBEV"
  }
  ```

### Delete Catalog
- **URL:** `/catalogs/:id`
- **Method:** `DELETE`
- **Access:** Private (Permission: `manage_catalog`)
- **Headers:** `Authorization: Bearer <token>`

---

## Products

### Get All Products
- **URL:** `/products`
- **Method:** `GET`
- **Access:** Private (Permission: `view_products`)
- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:**
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `search`: Search by name or SKU
  - `catalog`: Filter by Catalog ID

### Create Product
- **URL:** `/products`
- **Method:** `POST`
- **Access:** Private (Permission: `create_product`)
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: multipart/form-data`
- **Body (Form Data):**
  - `name`: "Sample Product"
  - `sku`: "SKU-001"
  - `catalog`: "<catalogId>"
  - `description`: "Product description"
  - `unitPrice`: 100
  - `costPrice`: 80
  - `stockQuantity`: 50
  - `image`: (File)

### Get Product By ID
- **URL:** `/products/:id`
- **Method:** `GET`
- **Access:** Private (Permission: `view_products`)
- **Headers:** `Authorization: Bearer <token>`

### Update Product
- **URL:** `/products/:id`
- **Method:** `PUT`
- **Access:** Private (Permission: `edit_product`)
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: multipart/form-data`
- **Body (Form Data):**
  - `name`: "Updated Name" (optional)
  - `unitPrice`: 120 (optional)
  - `image`: (File, optional)
  - ...other fields

### Delete Product
- **URL:** `/products/:id`
- **Method:** `DELETE`
- **Access:** Private (Permission: `delete_product`)
- **Headers:** `Authorization: Bearer <token>`

---

## Stock

### Get Stock Transactions
- **URL:** `/stock`
- **Method:** `GET`
- **Access:** Private (Permission: `manage_stock`)
- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:**
  - `page`: Page number
  - `limit`: Items per page
  - `search`: Search by product name or SKU
  - `type`: 'IN', 'OUT', 'ADJUSTMENT' (optional)
  - `date`: 'today' (optional)

### Add Stock Transaction
- **URL:** `/stock`
- **Method:** `POST`
- **Access:** Private (Permission: `manage_stock`)
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
  - `type` can be: "IN", "OUT", "ADJUSTMENT"

---

## Notifications

### Get All Notifications
- **URL:** `/notifications`
- **Method:** `GET`
- **Access:** Private
- **Headers:** `Authorization: Bearer <token>`

### Create Notification
- **URL:** `/notifications`
- **Method:** `POST`
- **Access:** Private
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "title": "Low Stock Alert",
    "message": "Product X is low on stock",
    "type": "warning"
  }
  ```

### Mark All as Read
- **URL:** `/notifications/read-all`
- **Method:** `PUT`
- **Access:** Private
- **Headers:** `Authorization: Bearer <token>`

### Mark Single as Read
- **URL:** `/notifications/:id/read`
- **Method:** `PUT`
- **Access:** Private
- **Headers:** `Authorization: Bearer <token>`

### Delete Notification
- **URL:** `/notifications/:id`
- **Method:** `DELETE`
- **Access:** Private
- **Headers:** `Authorization: Bearer <token>`

### Clear All Notifications
- **URL:** `/notifications`
- **Method:** `DELETE`
- **Access:** Private
- **Headers:** `Authorization: Bearer <token>`

---

## Reports

### Get Inventory Report
- **URL:** `/reports/inventory`
- **Method:** `GET`
- **Access:** Private (Permission: `view_reports`)
- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:**
  - `page`, `limit`, `search`

### Export Inventory (Excel)
- **URL:** `/reports/inventory/excel`
- **Method:** `GET`
- **Access:** Private (Permission: `view_reports`)
- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:**
  - `search`: Filter results before export

### Export Inventory (PDF)
- **URL:** `/reports/inventory/pdf`
- **Method:** `GET`
- **Access:** Private (Permission: `view_reports`)
- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:**
  - `search`: Filter results before export

---

## Barcodes

### Get Products for Barcodes
- **URL:** `/barcodes/products`
- **Method:** `GET`
- **Access:** Private
- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:**
  - `page`: Page number
  - `limit`: Items per page
  - `search`: Search by product name or SKU
- **Note:** Returns simplified product list (`name`, `sku`, `unitPrice`, `_id`) for barcode generation.
