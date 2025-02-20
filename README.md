# Dimaa Digital Menu

A modern, bilingual (English/Farsi) digital menu system built with Next.js 13+, featuring:

- 🌙 Dark/Light mode support
- 🌐 Bilingual support (English/Farsi)
- 📱 Responsive design
- ✨ Beautiful animations with Framer Motion
- 🎨 Tailwind CSS styling
- 🔒 Admin panel with authentication
- 📸 Image upload functionality
- 🎯 Category-based menu filtering

## Tech Stack

- Next.js 13+
- TypeScript
- Tailwind CSS
- Framer Motion
- next-themes
- next-i18next
- React Hot Toast

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```
5. Start production server:
   ```bash
   npm start
   ```

## Features

- **Bilingual Support**: Full support for English and Farsi languages with RTL handling
- **Theme Switching**: Automatic and manual dark/light mode switching
- **Admin Panel**: Secure admin interface for menu management
- **Category Management**: Organize menu items by categories
- **Image Upload**: Support for menu item images
- **Responsive Design**: Works on all device sizes
- **Animations**: Smooth transitions and animations
- **Type Safety**: Full TypeScript support

## Project Structure

- `/app` - Next.js 13+ app directory
- `/components` - React components
- `/context` - React context providers
- `/types` - TypeScript type definitions
- `/styles` - Global styles and CSS modules
- `/public` - Static assets

## Environment Variables

The following environment variables are required:

- `VERCEL_URL` - Vercel deployment URL (automatically set on Vercel)

## License

MIT License
