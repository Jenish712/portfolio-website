# Portfolio Website

A modern, responsive portfolio website built with React, showcasing projects with detailed case studies, animations, and a sleek dark theme. Features blog-style project pages with code snippets, images, and rich metadata.

## 🚀 Features

- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Interactive Project Showcase**: Grid layout with filtering and hover animations
- **Detailed Project Pages**: Blog-style case studies with sections, code snippets, galleries, and metrics
- **Smooth Animations**: Powered by Framer Motion for engaging user experience
- **Dark Theme**: Modern UI with emerald accents and glassmorphism effects
- **Contact Integration**: Functional contact form with validation
- **SEO Friendly**: Proper meta tags and semantic HTML

## 🛠️ Tech Stack

- **Frontend**: React 18.2.0
- **Styling**: Tailwind CSS with custom utilities
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **UI Components**: Custom shadcn-inspired components
- **Build Tool**: Create React App
- **Package Manager**: npm

## 📁 Project Structure

```
portfolio-website/
├── public/
│   ├── index.html          # Main HTML template
│   └── favicon.ico         # Website favicon
├── src/
│   ├── components/         # Reusable React components
│   │   ├── ui/            # UI component library
│   │   │   ├── button.jsx
│   │   │   ├── card.jsx
│   │   │   ├── dialog.jsx
│   │   │   └── ...
│   │   ├── Header.jsx     # Navigation header
│   │   ├── Footer.jsx     # Site footer
│   │   ├── About.jsx      # About section
│   │   ├── Projects.jsx   # Projects grid
│   │   ├── ProjectCard.jsx # Individual project card
│   │   ├── ProjectDetail.jsx # Detailed project view
│   │   └── Contact.jsx    # Contact form
│   ├── data/              # Static data files
│   │   ├── projects.js    # Project portfolio data
│   │   ├── profile.js     # Personal information
│   │   ├── skills.js      # Skills and technologies
│   │   ├── experience.js  # Work experience
│   │   └── misc.js        # Miscellaneous data
│   ├── pages/             # Page components
│   │   └── Home.jsx       # Main landing page
│   ├── styles/            # CSS stylesheets
│   │   ├── index.css      # Global styles
│   │   └── App.css        # App-specific styles
│   ├── utils/             # Utility functions
│   │   ├── cn.js          # Class name utility
│   │   └── router.js      # Custom routing logic
│   ├── App.jsx            # Main app component
│   └── index.js           # React entry point
├── .gitignore             # Git ignore rules
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Jenish712/portfolio-website.git
   cd portfolio-website
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

## 🌿 Git Workflow

This project follows a Git Flow branching strategy:

- **`main`**: Production-ready code
- **`develop`**: Main development branch
- **`feature/*`**: Feature branches (e.g., `feature/add-dark-mode`)
- **`release/*`**: Release preparation branches
- **`hotfix/*`**: Urgent bug fixes

### Common Commands

```bash
# Create a new feature branch
git checkout develop
git checkout -b feature/new-feature

# Merge feature to develop
git checkout develop
git merge feature/new-feature

# Create release
git checkout -b release/v1.1.0
# ... test and finalize ...
git checkout main
git merge release/v1.1.0
git tag v1.1.0
```

## 📝 Customization

### Adding New Projects

Edit `src/data/projects.js` to add new projects. Each project can include:

- Basic info (title, description, tech stack)
- Links (GitHub, demo, live site)
- Detailed sections with body text, bullets, images, and code snippets
- Gallery images
- Metrics and highlights

### Updating Personal Information

Modify the following files:
- `src/data/profile.js` - Personal details
- `src/data/skills.js` - Technical skills
- `src/data/experience.js` - Work history

### Styling Changes

- Global styles: `src/styles/index.css`
- Tailwind config: `tailwind.config.js`
- Component styles: Inline with Tailwind classes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Jenish712** - [GitHub](https://github.com/Jenish712)

---

*Built with ❤️ using React and Tailwind CSS*