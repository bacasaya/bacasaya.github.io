const file = new URLSearchParams(location.search).get('file');
const decodedFile = decodeURIComponent(file || '');
const savedPage = localStorage.getItem(`pdf_${decodedFile}`) || 1;

const iframe = document.getElementById('pdfFrame');
const loadingOverlay = document.getElementById('loadingOverlay');
const loadingPercent = document.getElementById('loadingPercent');
const title = document.getElementById('pdfTitle');

if (!file) {
  document.body.innerHTML = "<h2>PDF file not specified.</h2>";
} else {
  title.textContent = decodedFile;

  const viewerUrl = `pdfjs/web/viewer.html?file=${encodeURIComponent(
    location.origin + '/PDFs/' + decodedFile
  )}#page=${savedPage}`;

  // Show fake loading progress
  let percent = 0;
  const interval = setInterval(() => {
    if (percent < 90) {
      percent += Math.random() * 5;
      loadingPercent.textContent = `${Math.floor(percent)}%`;
    }
  }, 100);

  // Listen for viewer events
  window.addEventListener("message", (event) => {
    if (!event.data || typeof event.data !== "object") return;

    if (event.data.status === "pdf_loaded") {
      clearInterval(interval);
      loadingPercent.textContent = `100%`;
      setTimeout(() => {
        loadingOverlay.classList.add("fade-out");
      }, 300);
    }

    if (event.data.status === "pdf_failed") {
      clearInterval(interval);
      loadingOverlay.innerHTML = `
        <div class="error-message">
          <h3>Gagal memuat PDF</h3>
          <p>File <strong>${decodedFile}</strong> tidak tersedia atau rusak.</p>
          <a href="index.html" class="back-button">← Kembali ke Daftar</a>
        </div>
      `;
    }
  });

  // Set iframe source after listener is ready
  iframe.src = viewerUrl;

  // Fallback: if no message received within 10s
  setTimeout(() => {
    clearInterval(interval);
    loadingPercent.textContent = `100%`;

    try {
      const isBlank =
        !iframe.contentWindow?.location?.href ||
        iframe.contentWindow.location.href.includes("about:blank");

      if (isBlank) {
        loadingOverlay.innerHTML = `
          <div class="error-message">
            <h3>Gagal memuat PDF</h3>
            <p>File <strong>${decodedFile}</strong> tidak dapat ditampilkan.</p>
            <a href="index.html" class="back-button">← Kembali ke Daftar</a>
          </div>
        `;
      } else {
        loadingOverlay.classList.add("fade-out");
      }
    } catch (e) {
      loadingOverlay.innerHTML = `
        <div class="error-message">
          <h3>Gagal memuat PDF</h3>
          <p>File <strong>${decodedFile}</strong> tidak dapat ditampilkan.</p>
          <a href="index.html" class="back-button">← Kembali ke Daftar</a>
        </div>
      `;
    }
  }, 10000);
}

// Apply dark mode if needed
const theme = localStorage.getItem('theme');
if (theme === 'dark') {
  document.body.classList.add('dark');
}

document.getElementById('navLeft').addEventListener('click', () => {
  iframe.contentWindow.postMessage({ action: 'prev' }, '*');
});

document.getElementById('navRight').addEventListener('click', () => {
  iframe.contentWindow.postMessage({ action: 'next' }, '*');
});
