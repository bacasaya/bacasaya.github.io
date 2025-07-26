const toggle = document.getElementById('darkModeToggle');

// === BOOK LIST ===
const books = [
  "Book_One.pdf",
  "Guide_to_Linux.pdf",
  "Python_Tutorial.pdf",
  "Gaming_Secrets.pdf",
  "Advanced_AI.pdf",
  "C_Programming.pdf",
  "Excel_Secrets.pdf",
  "A_Quick_Guide.pdf",
  "Data_Structures.pdf"
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
  const input = document.getElementById('searchBox').value.toLowerCase();
  const items = document.querySelectorAll('.pdf-item');
  items.forEach(item => {
    const title = item.textContent.toLowerCase();
    item.style.display = title.includes(input) ? '' : 'none';
  });
}

// === GROUP & RENDER BOOKS ===
function renderBooks() {
  const bookListDiv = document.getElementById('bookList');
  const grouped = {};

  books.forEach(book => {
    const letter = book[0].toUpperCase();
    if (!grouped[letter]) grouped[letter] = [];
    grouped[letter].push(book);
  });

  Object.keys(grouped).sort().forEach(letter => {
    const section = document.createElement('div');

    const header = document.createElement('div');
    header.className = 'section-title';
    header.textContent = `${letter} Section`;
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
