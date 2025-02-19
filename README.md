# Dimaa Digital Menu

A bilingual (Farsi/English) digital menu web application for Dimaa Cafe, built with Next.js 13, TypeScript, and Tailwind CSS.

## Features

- 🌙 Dark/Light mode support
- 🌐 Bilingual support (Farsi/English)
- 📱 Mobile-first, responsive design
- 🎨 Beautiful animations and transitions
- 🔄 RTL support for Farsi
- 👨‍💼 Admin panel for menu management

## Prerequisites

- Node.js 18.x or later
- npm 9.x or later

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd dimaadigitalmenu
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
dimaadigitalmenu/
├── app/
│   ├── (admin)/
│   │   └── admin/         # Admin panel pages
│   ├── components/        # Reusable components
│   ├── context/          # React context providers
│   ├── lib/              # Utility functions and configurations
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Helper functions
├── public/
│   └── images/           # Static images
└── package.json
```

## Admin Panel

The admin panel is accessible at `/admin` and allows you to:
- Create new menu items
- Edit existing menu items
- Delete menu items
- Manage menu categories

## Customization

### Adding New Menu Categories

1. Add the new category to the `MenuCategory` type in `app/types/menu.ts`
2. Add translations for the new category in `app/components/MenuSection.tsx`

### Modifying Themes

The theme configuration can be found in `app/lib/theme.config.ts`.

## Contributing

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
