# Backend Integration Guide

## Setup CORS di Backend

Backend harus mengizinkan request dari frontend. Contoh konfigurasi CORS:

### Express.js (Node.js)
```javascript
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173', // URL frontend Vite
  credentials: true
}));
```

### FastAPI (Python)
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Laravel (PHP)
```php
// config/cors.php
'allowed_origins' => ['http://localhost:5173'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
'supports_credentials' => true,
```

## API Endpoint yang Dibutuhkan

### Authentication
- `POST /api/auth/login` - Login user
  ```json
  Request:
  {
    "email": "admin@hakuubakery.com",
    "password": "password123"
  }
  
  Response:
  {
    "token": "jwt-token-here",
    "user": {
      "id": 1,
      "name": "Admin",
      "email": "admin@hakuubakery.com"
    }
  }
  ```

- `POST /api/auth/register` - Register user baru
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info

### Orders
- `GET /api/orders` - Get all orders
  ```json
  Response:
  [
    {
      "id": "PO-001",
      "pembeli": "Ibu Rina",
      "namaProduk": "Roti Cokelat",
      "qty": 10,
      "tanggalPesan": "2026-10-10T10:00:00Z",
      "tanggalKirim": "2026-10-15T08:00:00Z",
      "statusPesanan": "Diterima",
      "catatan": "Kirim pagi hari"
    }
  ]
  ```

- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order
- `PATCH /api/orders/:id/status` - Update order status only
- `DELETE /api/orders/:id` - Delete order

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Schedule
- `GET /api/schedule` - Get production schedule
- `POST /api/schedule` - Create schedule entry

## Format Data Order yang Diharapkan

```typescript
interface Order {
  id: string;              // "PO-001"
  pembeli: string;         // "Ibu Rina"
  namaProduk: string;      // "Roti Cokelat"
  qty: number;             // 10
  tanggalPesan: string;    // ISO 8601: "2026-10-10T10:00:00Z"
  tanggalKirim: string;    // ISO 8601: "2026-10-15T08:00:00Z"
  statusPesanan: 'Diterima' | 'Dijadwalkan' | 'Diproduksi' | 'Selesai' | 'Dibatalkan';
  catatan?: string;        // Optional notes
}
```

## Authentication Flow

1. User login → Backend returns JWT token
2. Token disimpan di `localStorage`
3. Setiap API request include header: `Authorization: Bearer <token>`
4. Backend verify token dan return data
5. Jika token invalid/expired, redirect ke login

## Environment Variables

File `.env` untuk development:
```
VITE_API_BASE_URL=http://localhost:8000/api
```

File `.env.production` untuk production:
```
VITE_API_BASE_URL=https://api.hakuubakery.com/api
```

## Testing Backend Connection

Gunakan tools seperti:
- **Postman** - GUI untuk testing API
- **Thunder Client** - VS Code extension
- **curl** - Command line

Contoh test dengan curl:
```bash
# Test login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hakuubakery.com","password":"password123"}'

# Test get orders (dengan token)
curl http://localhost:8000/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Error Handling

Backend harus return error dengan format:
```json
{
  "message": "Error message here",
  "code": "ERROR_CODE",
  "status": 400
}
```

Frontend akan menampilkan `message` ke user.

## Status Codes yang Digunakan
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized (token invalid/missing)
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error
