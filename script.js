document.addEventListener("DOMContentLoaded", () => {

  // ==========================================
  // 0. TAMPILKAN HARI, TANGGAL, BULAN, & TAHUN
  // ==========================================
  function setFormattedDate() {
    const dateElement = document.getElementById("date-text");
    if (!dateElement) return;

    const today = new Date();
    
    // Format Tanggal Indonesia (Contoh: Jumat, 4 September 2026)
    const options = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    };
    
    const formattedDate = today.toLocaleDateString('id-ID', options);
    dateElement.textContent = formattedDate;
  }

  // Panggil fungsi saat halaman dimuat
  setFormattedDate();

  // ==========================================
  // 1. NAVBAR RESPONSIF HP & EFEK SCROLL
  // ==========================================
  const navbar = document.querySelector('.navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const navItems = document.querySelectorAll('.nav-link, .nav-btn-admin');
  const sections = document.querySelectorAll('section');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      navLinks.classList.toggle('show');
      
      const icon = hamburger.querySelector('i');
      if (icon) {
        if (navLinks.classList.contains('show')) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-xmark');
        } else {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      }
    });
  }

  // KONFIGURASI BACKGROUND INTERAKTIF (PARTICLES.JS)
  if (typeof particlesJS !== 'undefined') {
    particlesJS("particles-js", {
      "particles": {
        "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
        "color": { "value": "#2b2b2b" },
        "shape": { "type": "circle" },
        "opacity": { "value": 0.5, "random": false },
        "size": { "value": 3, "random": true },
        "line_linked": { "enable": true, "distance": 150, "color": "#2b2b2b", "opacity": 0.4, "width": 1 },
        "move": { "enable": true, "speed": 3, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false }
      },
      "interactivity": {
        "detect_on": "window",
        "events": {
          "onhover": { "enable": true, "mode": "grab" },
          "onclick": { "enable": true, "mode": "push" },
          "resize": true
        },
        "modes": {
          "grab": { "distance": 180, "line_linked": { "opacity": 0.8 } },
          "push": { "particles_nb": 4 }
        }
      },
      "retina_detect": true
    });
  }

  // Tutup Menu HP Otomatis saat Link Diklik
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      if (navLinks && navLinks.classList.contains('show')) {
        navLinks.classList.remove('show');
        const icon = hamburger ? hamburger.querySelector('i') : null;
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      }
    });
  });

  // Tutup Menu HP saat Klik di Luar Menu
  document.addEventListener('click', (e) => {
    if (navLinks && navLinks.classList.contains('show') && !navLinks.contains(e.target) && !hamburger.contains(e.target)) {
      navLinks.classList.remove('show');
      const icon = hamburger ? hamburger.querySelector('i') : null;
      if (icon) {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    }
  });

  // Efek Scrolled Navbar & Highlight Active Link
  window.addEventListener('scroll', () => {
    if (navbar) {
      if (window.scrollY > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.pageYOffset >= sectionTop) {
        currentSection = section.getAttribute('id');
      }
    });

    navItems.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });

  // ==========================================
  // 2. MODAL PROFIL BIMBEL POP-UP
  // ==========================================
  const btnProfil = document.getElementById('btn-profil');
  const modalProfil = document.getElementById('modal-profil');
  const modalClose = document.getElementById('modal-close');

  if (btnProfil && modalProfil) {
    btnProfil.addEventListener('click', () => {
      modalProfil.classList.add('active');
    });

    if (modalClose) {
      modalClose.addEventListener('click', () => {
        modalProfil.classList.remove('active');
      });
    }

    window.addEventListener('click', (e) => {
      if (e.target === modalProfil) {
        modalProfil.classList.remove('active');
      }
    });
  }

  // ==========================================
  // 3. LOGOUT SYSTEM (DASHBOARD)
  // ==========================================
  const btnLogout = document.getElementById("btn-logout");
  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      sessionStorage.removeItem("isOwnerLoggedIn");
      window.location.href = "login.html";
    });
  }

  // ==========================================
  // 4. HELPER: FORMAT MATA UANG & NOMINAL
  // ==========================================
  // Memformat input ketikan secara otomatis menjadi bertitik (150000 -> 150.000)
  const inputAmount = document.getElementById("amount");
  if (inputAmount) {
    inputAmount.addEventListener("keyup", function(e) {
      let value = this.value.replace(/\D/g, "");
      this.value = value ? new Intl.NumberFormat("id-ID").format(value) : "";
    });
  }

  // Fungsi mengubah string bertitik menjadi angka murni ("50.000" -> 50000)
  function parseAmount(value) {
    if (typeof value === "number") return value;
    return parseInt(value.replace(/\D/g, ""), 10) || 0;
  }

  // ==========================================
  // ==========================================
  // 5. SISTEM TRANSAKSI KEUANGAN OWNER (DASHBOARD)
  // ==========================================
  const transactionForm = document.getElementById("transaction-form");
  const transactionList = document.getElementById("transaction-list");
  const transactionDateInput = document.getElementById("transaction-date");

  // Helper: Set input tanggal otomatis ke hari ini
  function setTodayDateInput() {
    if (transactionDateInput) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      transactionDateInput.value = `${yyyy}-${mm}-${dd}`;
    }
  }

  // Helper: Format tanggal dari YYYY-MM-DD ke DD/MM/YYYY untuk tampilan tabel
  function formatDateIndo(dateStr) {
    if (!dateStr) return "-";
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  }

  if (transactionForm) {
    // Set tanggal default saat halaman dimuat
    setTodayDateInput();

    let transactions = JSON.parse(localStorage.getItem("alc_transactions")) || [];

    function updateDashboard() {
      transactionList.innerHTML = "";
      let totalIncome = 0;
      let totalExpense = 0;

      transactions.forEach((item, index) => {
        const tr = document.createElement("tr");
        const isIncome = item.type === "income";
        const numericAmount = parseAmount(item.amount);
        
        // Format tampilan Rupiah tanpa desimal
        const amountFormatted = "Rp " + new Intl.NumberFormat("id-ID").format(numericAmount);

        // Jika data lama belum ada tanggal, tampilkan '-'
        const dateDisplay = item.date ? formatDateIndo(item.date) : "-";

        if (isIncome) totalIncome += numericAmount;
        else totalExpense += numericAmount;

        tr.innerHTML = `
          <td style="white-space: nowrap; font-size: 0.85rem; color: #6b7280;">${dateDisplay}</td>
          <td>${item.desc}</td>
          <td><span class="${isIncome ? 'badge-in' : 'badge-out'}">${isIncome ? 'Pemasukan' : 'Pengeluaran'}</span></td>
          <td>${amountFormatted}</td>
          <td><button onclick="deleteTransaction(${index})" class="btn-delete"><i class="fa-solid fa-trash"></i></button></td>
        `;
        transactionList.appendChild(tr);
      });

      const elIncome = document.getElementById("total-income");
      const elExpense = document.getElementById("total-expense");
      const elProfit = document.getElementById("total-profit");

      if (elIncome) elIncome.innerText = "Rp " + new Intl.NumberFormat("id-ID").format(totalIncome);
      if (elExpense) elExpense.innerText = "Rp " + new Intl.NumberFormat("id-ID").format(totalExpense);
      if (elProfit) elProfit.innerText = "Rp " + new Intl.NumberFormat("id-ID").format(totalIncome - totalExpense);

      localStorage.setItem("alc_transactions", JSON.stringify(transactions));
    }

    transactionForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const date = transactionDateInput ? transactionDateInput.value : "";
      const desc = document.getElementById("desc").value;
      const type = document.getElementById("type").value;
      const rawAmount = document.getElementById("amount").value;
      
      const amount = parseAmount(rawAmount);
      if (amount <= 0) return;

      // Simpan data transaksi beserta tanggal yang dipilih/terinput
      transactions.push({ date, desc, type, amount });
      updateDashboard();
      
      transactionForm.reset();
      setTodayDateInput(); // Kembalikan nilai tanggal ke hari ini setelah reset
    });

    window.deleteTransaction = function(index) {
      transactions.splice(index, 1);
      updateDashboard();
    };

    updateDashboard();
  }

  // ==========================================
  // 6. ANIMASI SCROLL INTERAKTIF
  // ==========================================
  const animatedElements = document.querySelectorAll('.fade-in-element');
  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('appear');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  animatedElements.forEach(el => scrollObserver.observe(el));

});