# In Common: Sites of Encounter

A mobile-first exhibition website for the "In Common: Sites of Encounter" exhibition at BSA Space, Boston (June-December 2025).

## Features

- Mobile-first responsive design
- Dynamic project cards generated from CSV data
- Smooth scrolling navigation with anchor links
- Expandable project details
- Clean, minimalistic design using Inter Tight font
- Accessible and semantic HTML structure

## Technical Stack

- HTML5
- CSS3 (with CSS Grid and Flexbox)
- Vanilla JavaScript
- Google Fonts (Inter Tight)

## Project Structure

```
.
├── index.html          # Main HTML file
├── styles.css          # CSS styles
├── script.js           # JavaScript for interactivity
├── CSV/
│   └── BSA Labels.csv  # Project data source
└── README.md          # Project documentation
```

## Setup

1. Clone the repository
2. Serve the files using a local web server (required for CSV loading)
   - Using Python: `python -m http.server`
   - Using Node.js: `npx serve`
3. Open the website in a modern web browser

## Browser Support

The website is designed to work in all modern browsers that support:
- CSS Grid
- CSS Custom Properties (variables)
- ES6+ JavaScript features
- Fetch API

## Accessibility

- Semantic HTML structure
- ARIA attributes where necessary
- Keyboard navigation support
- Reduced motion support
- High contrast text
- Responsive text sizing

## Performance

- Minimal dependencies
- Optimized asset loading
- Efficient CSV parsing
- Smooth animations with hardware acceleration

## License

© 2025 Boston Society for Architecture. All rights reserved. 