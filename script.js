// Utility function to generate anchor ID from project name
function generateAnchorId(projectName) {
    return projectName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// Helper to get theme class from theme name
function getThemeClass(theme) {
    if (!theme) return '';
    const t = theme.toLowerCase();
    if (t.includes('belonging')) return 'theme-belonging';
    if (t.includes('healing')) return 'theme-healing';
    if (t.includes('culture')) return 'theme-culture';
    if (t.includes('play')) return 'theme-play';
    if (t.includes('welcome')) return 'theme-welcome';
    if (t.includes('learning')) return 'theme-learning';
    return '';
}

// Helper to wrap bracketed text in a span for underlining, using parentheses
function underlineBrackets(text) {
    if (!text) return '';
    return text.replace(/\[([^\]]+)\]/g, '<span class="bracketed">($1)</span>');
}

// Utility function to create project card HTML
function createProjectCard(project) {
    const anchorId = generateAnchorId(project.Project);
    const card = document.createElement('article');
    card.className = 'project-card';
    card.id = anchorId;

    // Determine theme class
    let themeClass = '';
    if (project.Theme && project.Theme.trim()) {
        themeClass = getThemeClass(project.Theme.trim());
    }

    const header = document.createElement('div');
    header.className = 'project-header';

    // Theme tag above project title
    let themeTagHTML = '';
    if (project.Theme && project.Theme.trim()) {
        themeTagHTML = `<div class="theme-tag ${themeClass}">${project.Theme.trim()}</div>`;
    }

    header.innerHTML = `
        ${themeTagHTML}
        <h2 class="project-title${themeClass ? ' ' + themeClass : ''}">${project.Project}</h2>
        <p class="project-firm">${project.Firm}</p>
        ${project.Description ? `<p class="project-description">${project.Description}</p>` : ''}
    `;

    const details = document.createElement('div');
    details.className = 'project-details';
    details.innerHTML = `
        ${project.Date ? `<div class="project-detail-item">
            <span class="project-detail-label">Date:</span>
            <span>${project.Date}</span>
        </div>` : ''}
        ${project.Credits ? `<div class="project-detail-item">
            <span class="project-detail-label">Photographer:</span>
            <span>${underlineBrackets(project.Credits)}</span>
        </div>` : ''}
    `;

    card.appendChild(header);
    card.appendChild(details);

    // Card footer for actions (no theme tag here)
    const cardFooter = document.createElement('div');
    cardFooter.className = 'project-card-footer';

    // CREDITS button with + inside
    const creditsButton = document.createElement('button');
    creditsButton.className = 'credits-button';
    creditsButton.innerHTML = `<span class="plus-circle">+</span><span class="credits-text">CREDITS</span>`;
    cardFooter.appendChild(creditsButton);

    card.appendChild(cardFooter);

    // Add click handler for expandable details on credits button
    creditsButton.addEventListener('click', (e) => {
        e.stopPropagation();
        details.classList.toggle('expanded');
    });

    return card;
}

// Robust CSV parser (handles quoted fields and commas)
function parseCSV(text) {
    const rows = [];
    let current = '';
    let inQuotes = false;
    let row = [];
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === '"') {
            if (inQuotes && text[i + 1] === '"') {
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            row.push(current);
            current = '';
        } else if ((char === '\n' || char === '\r') && !inQuotes) {
            if (current || row.length > 0) {
                row.push(current);
                rows.push(row);
                row = [];
                current = '';
            }
            // Handle \r\n
            if (char === '\r' && text[i + 1] === '\n') i++;
        } else {
            current += char;
        }
    }
    // Add last row
    if (current || row.length > 0) {
        row.push(current);
        rows.push(row);
    }
    // Remove empty trailing rows
    return rows.filter(r => r.some(cell => cell.trim() !== ''));
}

// Main function to load and process CSV data
async function loadProjects() {
    try {
        const response = await fetch('CSV/BSA Labels.csv');
        const csvText = await response.text();
        
        // Parse CSV
        const rows = parseCSV(csvText);
        const headers = rows[0].map(h => h.trim());
        const projects = rows.slice(1).map(row => {
            const project = {};
            headers.forEach((header, index) => {
                project[header] = row[index]?.trim() || '';
            });
            return project;
        });

        // Create and append project cards
        const container = document.querySelector('.projects-container');
        container.innerHTML = '';
        projects.forEach(project => {
            if (project.Project && project.Project !== '[Not visible]') {
                const card = createProjectCard(project);
                container.appendChild(card);
            }
        });

        // Handle anchor links
        if (window.location.hash) {
            const targetElement = document.querySelector(window.location.hash);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
                // Expand the project details if it's an anchor link
                const details = targetElement.querySelector('.project-details');
                if (details) {
                    details.classList.add('expanded');
                }
                const description = targetElement.querySelector('.project-description');
                if (description) {
                    description.classList.add('expanded');
                }
            }
        }

    } catch (error) {
        console.error('Error loading projects:', error);
        document.querySelector('.projects-container').innerHTML = `
            <div class="error-message">
                <p>Error loading projects. Please try refreshing the page.</p>
            </div>
        `;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', loadProjects); 