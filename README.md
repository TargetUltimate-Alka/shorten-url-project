# 🔗 URL Shortener

A full-stack URL Shortener built using **Node.js, Express.js, MongoDB, Mongoose, and EJS**.

The application converts long URLs into short URLs and tracks how many times each shortened URL has been visited.

## 🚀 Features

- Create short URLs
- Redirect short URLs to the original URL
- Store URLs in MongoDB
- Track URL visit history
- Display total number of clicks
- View visit timestamps
- Server-side rendering using EJS
- Copy shortened URL
- Responsive and clean UI
- MVC-based project structure

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### Frontend
- HTML
- CSS
- EJS

### Other Tools
- Git
- GitHub
- dotenv
- nanoid
- Nodemon

## 📂 Project Structure

```text
shorten-url-project/
│
├── connection/
│   └── database.js
│
├── controller/
│   └── url.js
│
├── model/
│   └── url.js
│
├── route/
│   └── url.js
│
├── public/
│   └── style.css
│
├── views/
│   ├── home.ejs
│   ├── result.ejs
│   └── analytics.ejs
│
├── .gitignore
├── package.json
├── package-lock.json
└── server.js
```

## 🔄 Application Flow

```text
User enters long URL
        ↓
      EJS Form
        ↓
   Express.js Route
        ↓
     Controller
        ↓
      Mongoose
        ↓
      MongoDB
        ↓
   Generate Short ID
        ↓
     Result Page
        ↓
    Short URL Visit
        ↓
  Record Visit History
        ↓
 Redirect to Original URL
        ↓
    Analytics Page
```

## 🔗 Main Routes

| Method | Route | Description |
|---|---|---|
| GET | `/` | URL shortener homepage |
| POST | `/url` | Create a short URL |
| GET | `/:shortId` | Redirect to original URL |
| GET | `/url/analytics/:shortId` | View URL analytics |

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/TargetUltimate-Alka/shorten-url-project.git
```

Navigate into the project:

```bash
cd shorten-url-project
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
MONGO_URI=your_mongodb_connection_string
```

Start the application:

```bash
npm start
```

For development with Nodemon:

```bash
npm run dev
```

Open:

```text
http://localhost:8001
```

## 📊 Analytics

Each visit to a shortened URL is stored in MongoDB with a timestamp.

The analytics page displays:

- Original URL
- Short ID
- Total clicks
- Individual visit timestamps

## 🔐 Environment Variables

The MongoDB connection string is stored in `.env`.

The `.env` file is intentionally excluded from Git using `.gitignore`.

**Never commit database credentials or API keys to GitHub.**

## 🚧 Future Improvements

- User authentication
- Custom short URLs
- QR code generation
- URL expiration
- Advanced analytics dashboard
- Click statistics and charts
- Rate limiting
- URL validation
- Deployment using Render/Railway/Vercel
- REST API documentation

## 👩‍💻 Author

**Alka Jha**

GitHub: https://github.com/TargetUltimate-Alka
