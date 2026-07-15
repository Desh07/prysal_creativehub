# Prysal Print & Design Hub

A modern, highly optimized dual-portal web application built for Prysal Creative Hub in Matale, Sri Lanka. This platform features a high-performance frontend for clients and a bespoke, headless CMS for instant content updates.

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion (Parallax, Magnetic Buttons, Interactive Particles)
- **Database / Cloud Storage:** Supabase
- **Hosting:** Vercel

## ✨ Features

- **Dual-Portal Architecture:** Seamlessly switches between the "Print Hub" and "Design Hub" with distinct styling and content.
- **Bespoke Headless CMS:** A custom `/admin` dashboard allowing authorized users to edit text, upload images, and crop media precisely to the required CSS aspect ratios.
- **Automated Garbage Collection:** Supabase integration automatically deletes old/unused images when replaced, ensuring zero cloud storage bloat.
- **Fully Responsive Design:** meticulously crafted breakpoints ensure pixel-perfect rendering across desktop, tablet, and mobile.
- **Optimized Media:** Automatic WebP compression (85% quality) dramatically reduces payload sizes for lightning-fast page loads.

## 🛠️ Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/prysal-printhub.git
   cd prysal-printhub
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables (`.env.local`):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ADMIN_TOKEN=your_custom_admin_password
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the client-facing site, and [http://localhost:3000/admin](http://localhost:3000/admin) to access the CMS.

## ☁️ Deployment

This project is optimized for deployment on Vercel. Because Vercel utilizes a read-only filesystem, all CMS data (JSON config and images) are strictly routed through the Supabase Storage Bucket (`public-content`). 

To deploy:
1. Ensure all local changes are saved and published to Supabase via the CMS.
2. Push to GitHub.
3. Import the repository in Vercel and apply the 4 environment variables listed above.

## 📝 License
Proprietary software. All rights reserved by Prysal Creative Hub.
