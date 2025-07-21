# A Pinch of AI

Transform your cooking experience with the power of AI! Generate personalized recipes from your ingredients, plan your meals, and organize your shopping - all in one beautiful, intuitive platform.

- **A Pinch of AI:** [https://my-kitchen-buddy-hnb7.vercel.app/](https://my-kitchen-buddy-hnb7.vercel.app/)
  
## ✨ Features

### 🤖 **AI-Powered Recipe Generation**
- Generate personalized recipes based on dietary preferences
- Support for various cuisines and difficulty levels
- Smart ingredient substitution suggestions

### 📱 **Meal Planning & Organization**
- Interactive weekly meal planner
- Drag-and-drop meal scheduling
- Automatic shopping list generation
- Nutrition tracking and meal prep guidance

### 🛒 **Smart Shopping Lists**
- Categorized shopping lists with price tracking
- Real-time collaboration with family members
- Integration with meal plans
- Support for multiple currencies (₹ INR supported)

### 🎨 **Beautiful, Responsive Design**
- Clean, modern interface optimized for all devices
- Mobile-first responsive design
- Intuitive navigation with progress tracking
- Customizable user preferences

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- MongoDB database
- Unsplash API key (for food images)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ubbagg/my-kitchen-buddy.git
   cd my-kitchen-buddy
   ```

2. **Install dependencies**
   ```bash
   # Backend setup
   cd backend
   npm install
   
   # Frontend setup
   cd ../frontend
   npm install
   ```

3. **Environment Configuration**
   
   Create `.env` files in both directories:
   
   **Backend (.env):**
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   UNSPLASH_ACCESS_KEY=your_unsplash_api_key
   PORT=5001
   ```
   
   **Frontend (.env):**
   ```env
   REACT_APP_API_URL=http://localhost:5001/api
   REACT_APP_UNSPLASH_ACCESS_KEY=your_unsplash_api_key
   ```

4. **Start Development Servers**
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev
   
   # Terminal 2 - Frontend
   cd frontend && npm start
   ```

5. **Visit** `http://localhost:3000` and start cooking! 🎉

## 📁 Project Structure

```
my-kitchen-buddy/
├── frontend/                 # React.js application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── contexts/        # React Context providers
│   │   ├── pages/           # Main application pages
│   │   └── assets/          # Images and static files
│   └── package.json
├── backend/                 # Node.js Express API
│   ├── controllers/         # Route handlers
│   ├── models/             # MongoDB schemas
│   ├── middleware/         # Authentication & validation
│   └── routes/             # API endpoint definitions
└── README.md
```

## 🛠️ Tech Stack

### **Frontend**
- **React 18** - Modern UI with hooks and context
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **React Icons** - Beautiful icon library
- **Axios** - HTTP client for API calls

### **Backend**
- **Node.js & Express** - Server framework
- **MongoDB & Mongoose** - Database and ODM
- **JWT** - Authentication
- **Multer** - File upload handling
- **bcryptjs** - Password hashing

### **AI & APIs**
- **OpenAI API** - Recipe generation
- **Unsplash API** - Food photography
- **Google Vision API** - Ingredient recognition

### **Deployment**
- **Vercel** - Frontend hosting and serverless functions[1]
- **MongoDB Atlas** - Cloud database
- **Cloudinary** - Image storage and optimization

## 🎯 Core Functionality

### Recipe Generation Flow
1. **Ingredient Input** - Type your ingredients
2. **AI Analysis** - Smart ingredient detection and validation
3. **Preference Setting** - Cuisine, difficulty, dietary restrictions
4. **Recipe Creation** - AI generates personalized recipes
5. **Save & Share** - Store favorites and share with others

### Meal Planning Workflow
1. **Calendar View** - Interactive weekly meal planner
2. **Recipe Assignment** - Drag recipes to specific days/meals
3. **Shopping Integration** - Auto-generate shopping lists
4. **Nutrition Tracking** - Monitor calories and macros

## 🎨 Design Philosophy

This app focuses on **clean, minimal design**[2][3] with:
- Responsive layouts that work beautifully on mobile devices
- Interactive elements with smooth hover effects
- Consistent spacing and typography
- Accessibility-first approach
- User-friendly currency formatting (₹ for Indian users)

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow ESLint rules for code consistency[4]
- Write responsive, mobile-first CSS
- Test on multiple devices and browsers
- Maintain clean, documented code

## 🌟 Acknowledgments

- **OpenAI** for powering our recipe generation
- **Unsplash** for beautiful food photography
- **Vercel** for seamless deployment and hosting
- **MongoDB** for reliable data storage
- All the amazing open-source libraries that make this possible

## 📞 Support & Contact

- **Website:** [https://my-kitchen-buddy-hnb7.vercel.app/](https://my-kitchen-buddy-hnb7.vercel.app/)
- **Email:** garvgarg1902@gamil.com


**Made with lots of coffee**

*Happy Cooking!*
