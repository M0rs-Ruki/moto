# Showroom Manager API Endpoints

## Base URL

```
http://localhost:3000/api
https://moto-theta-dusky.vercel.app/api (Production)
```

## Authentication

All endpoints (except `/auth/login` and `/auth/register`) require authentication via JWT token in cookies.

---

## 🔐 Authentication Endpoints

### 1. Register User

**POST** `/auth/register`

Create a new dealership account and user.

**Request Body:**

```json
{
  "email": "owner@dealership.com",
  "password": "securePassword123",
  "dealershipName": "Premium Motors",
  "dealershipLocation": "Mumbai, India",
  "theme": "dark",
  "accentColor": "#3b82f6"
}
```

**Response (201):**

```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "email": "owner@dealership.com",
    "dealership": {
      "id": "dealer_123",
      "name": "Premium Motors",
      "location": "Mumbai, India"
    }
  }
}
```

---

### 2. Login User

**POST** `/auth/login`

Authenticate and receive JWT token.

**Request Body:**

```json
{
  "email": "owner@dealership.com",
  "password": "securePassword123"
}
```

**Response (200):**

```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "email": "owner@dealership.com",
    "dealership": {
      "id": "dealer_123",
      "name": "Premium Motors"
    }
  }
}
```

**Note:** JWT token is set as an HTTP-only cookie automatically.

---

### 3. Get Current User

**GET** `/auth/me`

Retrieve logged-in user details.

**Response (200):**

```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "email": "owner@dealership.com",
    "theme": "dark",
    "accentColor": "#3b82f6",
    "dealership": {
      "id": "dealer_123",
      "name": "Premium Motors",
      "location": "Mumbai, India"
    }
  }
}
```

---

### 4. Logout User

**POST** `/auth/logout`

Clear authentication cookie and logout.

**Response (200):**

```json
{
  "success": true
}
```

---

## 🚗 Vehicle Management Endpoints

### 5. Get All Categories

**GET** `/categories`

Retrieve vehicle categories with their models.

**Response (200):**

```json
{
  "categories": [
    {
      "id": "cat_123",
      "name": "Sedan",
      "dealershipId": "dealer_123",
      "models": [
        {
          "id": "model_123",
          "name": "City 2024",
          "year": 2024,
          "categoryId": "cat_123"
        }
      ]
    }
  ]
}
```

---

### 6. Create Category

**POST** `/categories`

Create a new vehicle category.

**Request Body:**

```json
{
  "name": "SUV"
}
```

**Response (201):**

```json
{
  "success": true,
  "category": {
    "id": "cat_456",
    "name": "SUV",
    "dealershipId": "dealer_123"
  }
}
```

---

### 7. Create Vehicle Model

**POST** `/models`

Add a new vehicle model under a category.

**Request Body:**

```json
{
  "name": "Fortuner 2024",
  "year": 2024,
  "categoryId": "cat_456"
}
```

**Response (201):**

```json
{
  "success": true,
  "model": {
    "id": "model_456",
    "name": "Fortuner 2024",
    "year": 2024,
    "categoryId": "cat_456"
  }
}
```

---

## 👥 Visitor Management Endpoints

### 8. Create Visitor (New)

**POST** `/visitors`

Register a new visitor and send welcome WhatsApp message.

**Request Body:**

```json
{
  "firstName": "Ravi",
  "lastName": "Kumar",
  "whatsappNumber": "9876543210",
  "email": "ravi@example.com",
  "address": "123 Main St, Mumbai",
  "reason": "Looking for a sedan",
  "modelIds": ["model_123", "model_456"]
}
```

**Response (200):**

```json
{
  "success": true,
  "visitor": {
    "id": "visitor_123",
    "firstName": "Ravi",
    "lastName": "Kumar"
  },
  "session": {
    "id": "session_123",
    "status": "intake"
  },
  "message": {
    "status": "sent",
    "error": null
  }
}
```

---

### 9. Get All Visitors

**GET** `/visitors`

Retrieve all visitors for the dealership.

**Response (200):**

```json
{
  "visitors": [
    {
      "id": "visitor_123",
      "firstName": "Ravi",
      "lastName": "Kumar",
      "whatsappNumber": "9876543210",
      "email": "ravi@example.com",
      "address": "123 Main St, Mumbai",
      "whatsappContactId": "whatsapp_id_123",
      "dealershipId": "dealer_123",
      "createdAt": "2025-12-09T10:30:00Z",
      "sessions": [
        {
          "id": "session_123",
          "status": "intake",
          "createdAt": "2025-12-09T10:30:00Z"
        }
      ],
      "interests": [
        {
          "modelId": "model_123",
          "model": {
            "name": "City 2024",
            "category": {
              "name": "Sedan"
            }
          }
        }
      ]
    }
  ]
}
```

---

### 10. Create Return Visit Session

**POST** `/visitors/session`

Register a returning visitor for a new session and send return visit message.

**Request Body:**

```json
{
  "visitorId": "visitor_123",
  "reason": "Interested in test drive",
  "modelIds": ["model_456", "model_789"]
}
```

**Response (200):**

```json
{
  "success": true,
  "session": {
    "id": "session_456",
    "status": "intake",
    "visitNumber": 2
  },
  "visitor": {
    "id": "visitor_123",
    "firstName": "Ravi",
    "lastName": "Kumar"
  },
  "message": {
    "status": "sent",
    "error": null
  }
}
```

---

## 📋 Session Management Endpoints

### 11. Get All Sessions

**GET** `/sessions`

Retrieve all visitor sessions.

**Response (200):**

```json
{
  "sessions": [
    {
      "id": "session_123",
      "status": "intake",
      "createdAt": "2025-12-09T10:30:00Z",
      "visitor": {
        "id": "visitor_123",
        "firstName": "Ravi",
        "lastName": "Kumar",
        "whatsappNumber": "9876543210"
      },
      "testDrives": [
        {
          "id": "td_123",
          "outcome": "interested",
          "feedback": "Good performance",
          "model": {
            "name": "City 2024",
            "category": {
              "name": "Sedan"
            }
          }
        }
      ],
      "visitorInterests": [
        {
          "model": {
            "name": "City 2024"
          }
        }
      ]
    }
  ]
}
```

---

### 12. Create Test Drive

**POST** `/test-drives`

Schedule and record a test drive for a visitor. Sends WhatsApp message with test drive template.

**Request Body:**

```json
{
  "sessionId": "session_123",
  "modelId": "model_123",
  "outcome": "interested",
  "feedback": "Smooth driving experience"
}
```

**Response (200):**

```json
{
  "success": true,
  "testDrive": {
    "id": "td_123",
    "sessionId": "session_123",
    "modelId": "model_123",
    "outcome": "interested",
    "feedback": "Smooth driving experience"
  },
  "message": {
    "status": "sent",
    "error": null
  }
}
```

---

### 13. Exit Session

**POST** `/sessions/exit`

Mark session as exited and send exit/thank you WhatsApp message.

**Request Body:**

```json
{
  "sessionId": "session_123",
  "exitFeedback": "Visitor will consider the offer",
  "exitRating": 4
}
```

**Response (200):**

```json
{
  "success": true,
  "session": {
    "id": "session_123",
    "status": "exited",
    "exitFeedback": "Visitor will consider the offer",
    "exitRating": 4
  },
  "message": {
    "status": "sent",
    "error": null
  }
}
```

---

## 📝 WhatsApp Template Management Endpoints

### 14. Get All Templates

**GET** `/templates`

Retrieve all WhatsApp message templates for the dealership.

**Response (200):**

```json
{
  "templates": [
    {
      "id": "tpl_123",
      "name": "Welcome",
      "type": "welcome",
      "templateName": "welcome_msgg",
      "templateId": "876359745081049",
      "language": "en_US",
      "dealershipId": "dealer_123"
    },
    {
      "id": "tpl_456",
      "name": "Test Drive",
      "type": "test_drive",
      "templateName": "service_reminder",
      "templateId": "788018717207249",
      "language": "en_US"
    },
    {
      "id": "tpl_789",
      "name": "Exit",
      "type": "exit",
      "templateName": "thanks_msg",
      "templateId": "728805729727726",
      "language": "en_US"
    }
  ]
}
```

---

### 15. Update Template

**PUT** `/templates`

Update WhatsApp template mappings.

**Request Body:**

```json
{
  "id": "tpl_123",
  "name": "Welcome Message",
  "templateId": "876359745081049",
  "templateName": "welcome_msgg",
  "language": "en_US"
}
```

**Response (200):**

```json
{
  "success": true,
  "template": {
    "id": "tpl_123",
    "name": "Welcome Message",
    "type": "welcome",
    "templateName": "welcome_msgg",
    "templateId": "876359745081049",
    "language": "en_US"
  }
}
```

---

## ❌ Error Responses

All endpoints return error responses in this format:

**400 Bad Request:**

```json
{
  "error": "Missing required fields"
}
```

**401 Unauthorized:**

```json
{
  "error": "Not authenticated"
}
```

**404 Not Found:**

```json
{
  "error": "Resource not found"
}
```

**500 Internal Server Error:**

```json
{
  "error": "Internal server error"
}
```

---

## 📌 WhatsApp Message Templates

The system automatically sends WhatsApp messages at key points using configured templates:

| Trigger              | Template Type  | Parameters                 | Example                                            |
| -------------------- | -------------- | -------------------------- | -------------------------------------------------- |
| New Visitor Created  | `welcome`      | `[firstName, date]`        | "Hi Ravi, Welcome to Premium Motors! 12/9/2025"    |
| Test Drive Scheduled | `test_drive`   | `[firstName, date]`        | "Ravi, Your test drive is scheduled for 12/9/2025" |
| Session Exited       | `exit`         | `[firstName]`              | "Thank you Ravi for visiting Premium Motors!"      |
| Return Visit         | `return_visit` | `[firstName, visitNumber]` | "Welcome back Ravi! This is your 2nd visit."       |

**Note:** Parameter counts must match template definitions in your WhatsApp account.

---

## 🔄 Authentication Flow

1. User registers: **POST** `/auth/register`
2. User receives JWT token (stored as HTTP-only cookie)
3. User makes authenticated requests with JWT cookie
4. User logs out: **POST** `/auth/logout`

---

## 📱 WhatsApp Integration

The system integrates with chati.ai WhatsApp Business API:

- **Base URL:** `https://api.chati.ai/v1/public/api`
- **Authentication:** Bearer token + x-access-key header
- **Messages:** Sent automatically when visitors are created, test drives scheduled, or sessions exit

---

## Rate Limiting & Quotas

Currently no rate limiting implemented. Add as needed for production.

---

## Version

**API Version:** 1.0.0  
**Last Updated:** December 9, 2025
