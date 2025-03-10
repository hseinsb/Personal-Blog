# Hussein's Philosophy Blog

A personal blog website for publishing theories and philosophies on various topics including religion, morals, philosophy, and personal growth.

## Features

- **Public Blog Reading**: Anyone can read blog posts, leave comments, and like posts
- **Admin Panel**: Only the owner can add, edit, or delete posts
- **Category Organization**: Posts organized into four main categories
- **Comments System**: Visitors can leave comments without needing to create an account
- **Like System**: Visitors can like posts (limited to once per session via localStorage)
- **Responsive Design**: Beautiful UI that works on all devices
- **Dark/Light Mode**: Toggle between dark and light themes

## Tech Stack

- **Frontend**:

  - Next.js (React framework with SSG)
  - Tailwind CSS
  - React Icons
  - Kalam font from Google Fonts

- **Backend**:
  - Firebase Firestore (database)
  - Firebase Authentication (admin access)

## Getting Started

### Prerequisites

- Node.js (v18 or newer)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/philosophy-blog.git
   cd philosophy-blog
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env.local` file in the root directory with your Firebase credentials:

   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_ADMIN_UID=your_firebase_user_uid
   ```

4. Update the Firestore security rules:

   - Deploy the included `firestore.rules` file to your Firebase project
   - Replace `YOUR_ADMIN_UID` in the rules with your actual Firebase user UID

5. Run the development server:

   ```
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Firebase Setup

1. Create a new Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Firestore Database
3. Set up Authentication with Email/Password provider
4. Create an admin user through the Authentication panel
5. Set up Firestore security rules to protect your data

## Deployment

This project is designed to be deployed on Vercel:

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Add your environment variables in the Vercel project settings
4. Deploy!

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Design inspired by modern blog platforms
- Built with Next.js and Firebase
