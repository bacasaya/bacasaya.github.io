const toggle = document.getElementById('darkModeToggle');

// === BOOK LIST ===
const books = [
  "(Smart Sensors, Measurement and Instrumentation) Alice James, Avishkar Seth, Subhas Chandra Mukhopadhyay - IoT System Design_ Project Based Approach. 41-Springer (2021).pdf",
  "machine-learning-algorithm.pdf",
  "test.pdf"
];

// === DARK MODE ===
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark');
  toggle.checked = true;
}
toggle.addEventListener('change', () => {
  if (toggle.checked) {
    document.body.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.body.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
});

// === SEARCH ===
function searchBooks() {
  const input = document.getElementById('searchBox').value.toLowerCase().trim();
  const items = document.querySelectorAll('.pdf-item');
  const headers = document.querySelectorAll('.section-title');
  const clearBtn = document.getElementById('secretClearBtn');

  if (input === 'tolong hapus kakak') {
    clearBtn.classList.add('visible');
  } else {
    clearBtn.classList.remove('visible');
  }

  if (input === '' || input === 'tolong hapus kakak') {
    items.forEach(item => item.style.display = '');
    headers.forEach(header => header.style.display = '');
    return;
  }

  items.forEach(item => {
    const title = item.textContent.toLowerCase();
    item.style.display = title.includes(input) ? '' : 'none';
  });

  headers.forEach(header => header.style.display = 'none');
}

// === GROUP & RENDER BOOKS ===
function renderBooks() {
  const bookListDiv = document.getElementById('bookList');
  if (!bookListDiv) return;
  bookListDiv.innerHTML = ''; // clear before rendering

  const grouped = {};

  books.forEach(book => {
    const trimmed = book.trim();
    if (!trimmed) return;

    const letter = trimmed[0].toUpperCase();
    if (!grouped[letter]) grouped[letter] = [];
    grouped[letter].push(trimmed);
  });

  Object.keys(grouped).sort().forEach(letter => {
    const section = document.createElement('div');

    const header = document.createElement('div');
    header.className = 'section-title';
    header.textContent = letter;
    section.appendChild(header);

    const ul = document.createElement('ul');
    ul.classList.add('pdf-list');

    grouped[letter].forEach(book => {
      const li = document.createElement('li');
      li.classList.add('pdf-item');
      const link = document.createElement('a');
      link.href = "#";
      link.textContent = book;
      link.onclick = () => openPDF(book);
      li.appendChild(link);
      ul.appendChild(li);
    });

    section.appendChild(ul);
    bookListDiv.appendChild(section);
  });
}

// === OPEN PDF INLINE WITH PAGE RESTORE ===
function openPDF(filePath) {
  const viewerContainer = document.getElementById('pdfViewerContainer');
  viewerContainer.innerHTML = '';

  let pdfUrl = `PDFs/${filePath}`;
  const savedPage = localStorage.getItem(`pdf_${filePath}`);
  if (savedPage) {
    pdfUrl += `#page=${savedPage}`;
  } else {
    pdfUrl += `#page=1`;
  }

  const viewer = document.createElement('pdfjs-viewer-element');
  viewer.setAttribute('src', pdfUrl);
  viewer.setAttribute('height', '90vh');
  viewerContainer.appendChild(viewer);

  viewer.scrollIntoView({ behavior: 'smooth' });

  localStorage.setItem('current_pdf', filePath);
}

// === SAVE LAST PAGE ON EXIT ===
window.addEventListener('beforeunload', () => {
  const viewer = document.querySelector('pdfjs-viewer-element');
  if (!viewer) return;

  const src = viewer.getAttribute('src');
  const match = src.match(/file=.+\.pdf#page=(\d+)/);
  if (!match) return;

  const page = match[1];
  const fileMatch = src.match(/file=PDFs\/(.+\.pdf)/);
  if (fileMatch) {
    const fileName = decodeURIComponent(fileMatch[1]);
    localStorage.setItem(`pdf_${fileName}`, page);
  }
});

// === SECRET CLEAR BUTTON ===
document.getElementById('secretClearBtn').addEventListener('click', () => {
  let cleared = 0;

  for (let key in localStorage) {
    if (key.startsWith('pdf_') || key === 'current_pdf') {
      localStorage.removeItem(key);
      cleared++;
    }
  }

  alert(`Cache berhasil dihapus. ${cleared} item telah dihapus.`);
});

// === INIT ===
renderBooks();
