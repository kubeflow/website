# Kubeflow Website Theme Setup

This site now uses the Kubeflow Hugo theme as a git submodule for better maintainability.

## Initial Setup

After cloning this repository, you need to add the theme submodule:

```bash
git submodule add https://github.com/davidgs/kubeflow-hugo themes/kubeflow
```

## Building the Site

The theme uses Tailwind CSS with a proper build process. You need to build the CSS before running the site:

```bash
# Navigate to the theme directory
cd themes/kubeflow

# Install dependencies
npm install

# Build CSS for production
npm run build:css:prod

# Go back to the site root
cd ../..

# Run Hugo
hugo server --port 1313
```

## Development Workflow

For theme development:

```bash
# In the theme directory
cd themes/kubeflow

# Install dependencies (if not done already)
npm install

# Watch for CSS changes during development
npm run build:css

# In another terminal, run Hugo from the site root
hugo server --port 1313
```

## Theme Updates

To update the theme:

```bash
cd themes/kubeflow
git pull origin main
npm run build:css:prod
```

## Key Configuration

The site configuration is in `config.toml` and includes:
- Homepage content (hero, features, action cards, components)
- Documentation sections
- Component versions
- Site metadata and social links

All theme-specific content is configured through Hugo's parameters system to maintain proper theme/content separation.