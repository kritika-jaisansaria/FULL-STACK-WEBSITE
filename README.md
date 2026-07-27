# Full Stack Jewellery Website

A **premium** full‑stack e‑commerce application for jewellery items built with:

- **Frontend:** React (Vite) – modern UI with glassmorphism‑style design, responsive layout, and smooth micro‑animations.
- **Backend:** Node.js, Express, MongoDB – REST API handling products, cart, wishlist, and user authentication.
- **Styling:** Vanilla CSS with a curated color palette and Google Fonts for a luxurious look.

## ✨ Features
- Product catalog with filtering, search and detailed view.
- Cart and wishlist management (React Context).
- Admin panel for product CRUD.
- Dynamic routing using **react‑router‑dom**.
- Gross weight handling, karatage display, and clean metal‑details rendering (no empty fields, IDs hidden).
- Clickable logo that navigates back to the home page.

## 🚀 Getting Started
### Prerequisites
- Node.js (>=18)
- npm (>=9)
- MongoDB instance (local or Atlas) – set `MONGO_URI` in `.env`.

### Installation
```bash
# Clone the repository
git clone https://github.com/kritika-jaisansaria/FULL-STACK-WEBSITE.git
cd FULL-STACK-WEBSITE

# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### Run the application
```bash
# Start backend (http://localhost:8080)
npm start

# In a separate terminal, start the frontend (http://localhost:5173)
cd frontend && npm run dev
```
Open the URL in your browser.

## 🛠️ Development Scripts
| Script | Description |
|--------|-------------|
| `npm start` (backend) | Starts the Express server with nodemon. |
| `npm run dev` (frontend) | Starts the Vite dev server. |
| `npm run build` (frontend) | Builds a production bundle. |
| `npm test` (backend) | Runs backend tests (if any). |

## 📦 Project Structure
```
FULL-STACK-WEBSITE/
├─ backend/               # Express API
│   ├─ Controllers/      # Request handlers
│   ├─ Models/           # Mongoose schemas
│   └─ ...
├─ frontend/              # React UI
│   ├─ src/
│   │   ├─ Components/   # Reusable UI components
│   │   ├─ Pages/        # Page views
│   │   ├─ context/      # Cart & wishlist contexts
│   │   └─ assets/       # Images, icons
│   └─ index.html
└─ README.md              # Project documentation
```

## 📝 Notes on Recent Fixes
- **Gross weight**: Fixed case mismatch (`grossWeight` vs `GrossWeight`) and now shows the value with a "g" unit.
- **Logo navigation**: Logo is now clickable and redirects to `/` (home).
- **Metal details**: Empty fields are filtered out, field names are formatted (e.g., `grossWeight` → **Gross Weight**), and the MongoDB `_id` is hidden.

## 🙏 Contributing
Feel free to open issues or submit pull requests. Follow the existing code style and run linting before committing.

## 📄 License
MIT License.
