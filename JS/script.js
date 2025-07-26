const viewer = document.getElementById('pdfViewerComponent');
const toggle = document.getElementById('darkModeToggle');

function searchBooks() {
    const input = document.getElementById('searchBox').value.toLowerCase();
    const items = document.querySelectorAll('.pdf-item');

    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(input) ? '' : 'none';
    });
}

function loadPDF(filePath) {
    const savedPage = localStorage.getItem(`pdf_${filePath}`);

    if (savedPage) {
        const continueReading = confirm(`Continue reading from page ${savedPage}?`);
        if (continueReading) {
            viewer.src = `${filePath}#page=${savedPage}`;
        } else {
            localStorage.removeItem(`pdf_${filePath}`);
            viewer.src = `${filePath}#page=1`;
        }
    } else {
        viewer.src = `${filePath}#page=1`;
    }

    // Set theme on open
    const theme = document.body.classList.contains('dark') ? 'DARK' : 'LIGHT';
    viewer.setAttribute('viewer-css-theme', theme);

    localStorage.setItem('current_pdf', filePath);
}

// Approximate progress tracking (every 5s)
setInterval(() => {
    const filePath = localStorage.getItem('current_pdf');
    if (filePath && viewer.src.includes(filePath)) {
        const match = viewer.src.match(/#page=(\d+)/);
        if (match) {
            localStorage.setItem(`pdf_${filePath}`, match[1]);
        }
    }
}, 5000);

// 🌙 Dark Mode Toggle
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    toggle.checked = true;
    viewer.setAttribute('viewer-css-theme', 'DARK');
} else {
    viewer.setAttribute('viewer-css-theme', 'LIGHT');
}

toggle.addEventListener('change', () => {
    if (toggle.checked) {
        document.body.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        viewer.setAttribute('viewer-css-theme', 'DARK');
    } else {
        document.body.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        viewer.setAttribute('viewer-css-theme', 'LIGHT');
    }
});
