# Hussein's Philosophy Blog

A modern, responsive blog focused on philosophical topics including religion, morals, philosophy, and personal growth.

## Features

- Responsive design for all devices
- Dark/light mode toggle
- Category-based navigation
- Rich text editing with TinyMCE
- Comment system
- Like functionality for posts

## Technologies Used

- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- Firebase/Firestore
- Vercel Deployment

## Deployment

This project is deployed on Vercel.

Last update: March 10, 2025

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

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Design inspired by modern blog platforms
- Built with Next.js and Firebase
