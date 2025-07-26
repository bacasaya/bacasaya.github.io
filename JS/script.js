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

  if (input === '') {
    // Restore all items and headers
    items.forEach(item => item.style.display = '');
    headers.forEach(header => header.style.display = '');
    return;
  }

  items.forEach(item => {
    const title = item.textContent.toLowerCase();
    item.style.display = title.includes(input) ? '' : 'none';
  });

  // Hide all section headers during search
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

// === OPEN PDF IN NEW TAB ===
function openPDF(filePath) {
  const savedPage = localStorage.getItem(`pdf_${filePath}`);

  let target = `PDFs/${filePath}`;
  if (savedPage) {
    const continueReading = confirm(`Continue reading from page ${savedPage}?`);
    if (continueReading) {
      target += `#page=${savedPage}`;
    } else {
      localStorage.removeItem(`pdf_${filePath}`);
    }
  } else {
    target += `#page=1`;
  }

  localStorage.setItem('current_pdf', filePath);
  window.open(target, '_blank');
}

// === INIT ===
renderBooks();
