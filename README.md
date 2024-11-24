# Web Novel Application  

![License](https://img.shields.io/badge/license-MIT-blue.svg)  
A web-based application for creating, sharing, and managing interactive novels.  

## 🌟 Features  

- **User Authentication**: Secure sign-in and sign-up functionality.  
- **Interactive Novel Creation**: Tools for authors to create and manage their stories.  
- **User Profiles**: Personalized dashboards to manage novels and track progress.  
- **Responsive Design**: Optimized for both desktop and mobile devices.  
- **Story Browsing**: Search and explore novels by genre, rating, or popularity.
- **File**: No feature to recive file ex. Image Novel, Profile Image, Banner Profile. 

## 📂 Project Structure  

```plaintext  
web-novel/  
├── public/              # Public assets like icons and images  
├── src/  
│   ├── app/             # App entry points and core application setup  
│   ├── components/      # Reusable UI components  
│   ├── context/         # Context for managing global states  
│   ├── lib/             # Helper libraries and utilities  
│   ├── middleware/      # Middleware functions for API and app logic  
│   ├── provider/        # Context or service providers  
│   ├── utils/           # Utility functions  
├── package.json         # Dependencies and scripts  
└── README.md            # Project documentation  
```  

## 🚀 Installation  

1. Clone the repository:  
   ```bash  
   git clone https://github.com/PhurinGZ/web-app-novel.git  
   cd web-app-novel  
   ```  

2. Create a `.env` file in the project root and add the following environment variables:  
   ```bash  
   NEXTAUTH_URL=http://localhost:3000 # Replace with your production URL if deploying  
   SALT=10                           # Adjust salt value for password hashing if needed  
   NEXTAUTH_SECRET=Web-novel         # Replace with your secret  
   MongodbURL=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>  
   ```  

3. Install dependencies:  
   ```bash  
   npm install  
   ```  

4. Start the development server:  
   ```bash  
   npm run dev  
   ```  

## 💻 Technologies  

- **Frontend**: Next.js  
- **Backend**: Node.js  
- **Database**: MongoDB  
- **Styling**: CSS, TailwindCSS  

## 🛠️ Development  

To contribute:  

1. Fork the repository.  
2. Create a new branch:  
   ```bash  
   git checkout -b feature/your-feature-name  
   ```  
3. Commit your changes:  
   ```bash  
   git commit -m "Add new feature"  
   ```  
4. Push your branch:  
   ```bash  
   git push origin feature/your-feature-name  
   ```  
5. Open a Pull Request.  

## 📜 License  

This project is licensed under the [MIT License](LICENSE).  

## 📞 Contact  

For questions or collaborations, feel free to contact:  
- **GitHub**: [PhurinGZ](https://github.com/PhurinGZ)  
