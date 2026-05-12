
    // ==================== CURSOR ====================
    (function initCursor() {
      if (window.innerWidth <= 768) return;
      const dot = document.getElementById('cursorDot');
      const ring = document.getElementById('cursorRing');
      if (!dot || !ring) return;
      let mouseX = window.innerWidth/2, mouseY = window.innerHeight/2;
      let ringX = mouseX, ringY = mouseY;
      document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
      function tick() {
        dot.style.transform = `translate(${mouseX}px,${mouseY}px) translate(-50%,-50%)`;
        ringX += (mouseX - ringX) * 0.10;
        ringY += (mouseY - ringY) * 0.10;
        ring.style.transform = `translate(${ringX}px,${ringY}px) translate(-50%,-50%)`;
        requestAnimationFrame(tick);
      }
      tick();
      const observer = new MutationObserver(() => {
        document.querySelectorAll('a,button,.btn,.card,.gallery-item,[data-page]').forEach(el => {
          if (!el.dataset.cursorBound) {
            el.dataset.cursorBound = '1';
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
          }
        });
      });
      observer.observe(document.body, { childList: true, subtree: true });
      document.addEventListener('mousedown', () => {
        document.body.classList.add('cursor-click');
        setTimeout(() => document.body.classList.remove('cursor-click'), 150);
      });
    })();

    // ==================== DATA ====================
    const beritaData = [
      { id:1, judul:"Prestasi Olimpiade Sains Internasional", tgl:"12 Mei 2025", excerpt:"Siswa kami berhasil meraih medali emas di ajang Olimpiade Sains Dunia.", img:"https://picsum.photos/id/20/600/400" },
      { id:2, judul:"Workshop AI & Robotics", tgl:"5 April 2025", excerpt:"Pelatihan intensif kecerdasan buatan bersama praktisi global.", img:"https://picsum.photos/id/26/600/400" },
      { id:3, judul:"Penerimaan Siswa Baru 2026", tgl:"1 Maret 2025", excerpt:"Gelombang pertama pendaftaran telah dibuka untuk tahun ajaran 2026.", img:"https://picsum.photos/id/28/600/400" }
    ];
    const galeriFoto = [
      "https://picsum.photos/id/1/500/400","https://picsum.photos/id/15/500/450","https://picsum.photos/id/22/500/420",
      "https://picsum.photos/id/42/500/500","https://picsum.photos/id/77/500/380","https://picsum.photos/id/96/500/360"
    ];
    const fasilitasList = [
      { nama:"Lab VR & AI", desc:"Teknologi immersive untuk pembelajaran interaktif dan eksperimen digital.", icon:"fas fa-vr-cardboard" },
      { nama:"Perpustakaan 4.0", desc:"Akses jurnal internasional, e-book, dan ruang diskusi digital.", icon:"fas fa-book-open" },
      { nama:"Arena Olahraga", desc:"Futsal, basket, kolam renang, dan fasilitas fitness premium.", icon:"fas fa-futbol" }
    ];

    // ==================== LAYANAN (updated) ====================
    const layananList = [
      { nama:"Website Development", desc:"Perancangan dan pengembangan website profesional, responsif, dan SEO-friendly — dari company profile hingga e-commerce dinamis.", icon:"fas fa-globe" },
      { nama:"Mobile App", desc:"Aplikasi mobile inovatif dan intuitif untuk Android & iOS, dengan pengalaman pengguna yang mulus dan modern.", icon:"fas fa-mobile-alt" },
      { nama:"Desktop Development", desc:"Aplikasi desktop kustom yang stabil dan andal untuk meningkatkan efisiensi operasional dan keamanan data internal.", icon:"fas fa-desktop" },
      { nama:"Game Development", desc:"Game edukatif, promosi, dan kasual yang menarik dengan fokus pada kreativitas, logika, dan kualitas visual.", icon:"fas fa-gamepad" },
      { nama:"IoT Solutions", desc:"Backend cerdas dan dashboard terintegrasi untuk analisis dan visualisasi data dari perangkat IoT Anda.", icon:"fas fa-network-wired" }
    ];

    // ==================== NILAI PERUSAHAAN ====================
    const nilaiList = [
      { nama:"Educational Excellence", desc:"Berkomitmen menjadi lingkungan belajar profesional yang memastikan transfer pengetahuan dan keterampilan industri terbaik, menghasilkan lulusan siap kerja dan berdaya saing global.", icon:"fas fa-graduation-cap" },
      { nama:"Innovation", desc:"Selalu mencari solusi kreatif dan menguasai teknologi terbaru untuk memberikan produk yang cerdas dan mutakhir kepada pasar.", icon:"fas fa-lightbulb" },
      { nama:"Collaboration", desc:"Mendorong sinergi dan komunikasi efektif di dalam tim, serta membangun kerja sama harmonis dengan klien dan mitra untuk mencapai tujuan bersama.", icon:"fas fa-handshake" },
      { nama:"Professionalism", desc:"Bekerja dengan disiplin, tanggung jawab, dan standar layanan terbaik, mencerminkan komitmen kami sebagai bagian dari Teaching Factory.", icon:"fas fa-shield-alt" }
    ];

    let currentPage = "beranda";

    function renderPage(page) {
      const app = document.getElementById("app");
      app.classList.remove('page-enter');
      void app.offsetWidth;
      app.classList.add('page-enter');
      if(page === "beranda") app.innerHTML = renderHome();
      else if(page === "profil") app.innerHTML = renderProfil();
      else if(page === "layanan") app.innerHTML = renderLayanan();
      else if(page === "fasilitas") app.innerHTML = renderFasilitas();
      else if(page === "galeri") app.innerHTML = renderGaleri();
      else if(page === "kontak") app.innerHTML = renderKontak();
      else if(page === "pendaftaran") app.innerHTML = renderPendaftaran();
      else app.innerHTML = renderHome();
      attachPageEvents(page);
      initRevealObserver();
      initStaggered();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function attachPageEvents(page) {
      if(page === "galeri" || page === "beranda") {
        document.querySelectorAll('.gallery-item').forEach(item => {
          item.addEventListener('click', () => showLightbox(item.querySelector('img').src));
        });
      }
      if(page === "beranda") animateCounters();
      if(page === "pendaftaran") initMultiStep();
    }

    function showLightbox(src) {
      let lb = document.getElementById('globalLightbox');
      if(!lb) {
        lb = document.createElement('div');
        lb.id = "globalLightbox";
        lb.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(5,8,16,.92);z-index:10000;display:none;align-items:center;justify-content:center;cursor:pointer;backdrop-filter:blur(12px);";
        lb.innerHTML = '<div><img id="lightboxImg" style="max-width:90vw;max-height:85vh;border-radius:20px;box-shadow:0 40px 80px rgba(0,0,0,.5);"></div>';
        document.body.appendChild(lb);
        lb.addEventListener('click', () => { lb.style.opacity='0'; setTimeout(() => lb.style.display='none', 300); });
      }
      document.getElementById('lightboxImg').src = src;
      lb.style.display = 'flex'; lb.style.opacity = '0'; lb.style.transition = 'opacity .35s ease';
      requestAnimationFrame(() => lb.style.opacity = '1');
    }

    function animateCounters() {
      document.querySelectorAll('.stat-number[data-target]').forEach(el => {
        const target = parseFloat(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const duration = 2000;
        const startTime = performance.now();
        function update(now) {
          const progress = Math.min((now - startTime) / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          el.textContent = prefix + Math.floor(ease * target) + suffix;
          if(progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
      });
    }

    let step = 1;
    function initMultiStep() {
      const steps = document.querySelectorAll('.step-form');
      const fill = document.querySelector('.progress-fill');
      function update() {
        steps.forEach((st, idx) => st.classList.toggle('active-step', idx+1 === step));
        if(fill) fill.style.width = ((step-1)/(steps.length-1))*100 + '%';
      }
      window.nextStep = function() { if(step < steps.length) { step++; update(); } };
      window.prevStep = function() { if(step > 1) { step--; update(); } };
      const form = document.getElementById('regForm');
      if(form) {
        form.addEventListener('submit', e => {
          e.preventDefault();
          if(step === steps.length) alert("✅ Pendaftaran berhasil! Admin akan menghubungi Anda.");
          else nextStep();
        });
      }
      update();
    }

    function initRevealObserver() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if(entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }});
      }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
      document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }

    function initStaggered() {
      document.querySelectorAll('.stagger-children').forEach(parent => {
        Array.from(parent.children).forEach((child, i) => { child.style.animationDelay = `${i * 0.1}s`; });
      });
    }

    // ==================== RENDER FUNCTIONS ====================

    function renderHome() {
      return `
        <section class="hero">
          <div class="hero-lines"></div>
          <div class="hero-noise"></div>
          <div class="hero-orb hero-orb-1"></div>
          <div class="hero-orb hero-orb-2"></div>

          <div class="hero-inner">
          <div class="hero-content">
            <div class="hero-accent-line"></div>

            <div class="hero-eyebrow">
              <div class="hero-badge">
                <span class="hero-badge-dot"></span>
                TEFA · BLUD SMKN 1 Cirebon
              </div>
            </div>

            <h1 class="hero-title">
              Solusi Teknologi oleh<br>
              <span class="gradient-text">Talenta <em>Masa Depan</em></span>
            </h1>

            <p class="hero-sub">
              Teaching Factory software development profesional — membangun teknologi cerdas sekaligus mencetak talenta digital Indonesia yang berdaya saing global.
            </p>

            <div class="hero-buttons">
              <a href="#" data-page="kontak" class="btn btn-primary btn-arrow">
                Konsultasi Gratis <i class="fas fa-arrow-right"></i>
              </a>
              <a href="#" data-page="layanan" class="btn btn-outline btn-arrow">
                Lihat Layanan <i class="fas fa-arrow-right"></i>
              </a>
            </div>

            <div class="hero-stats">
              <div class="stat-item">
                <span class="stat-number" data-target="5" data-suffix="+">5+</span>
                <span class="stat-label">Jenis Layanan</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <span class="stat-number" data-target="100" data-suffix="+">100+</span>
                <span class="stat-label">Siswa Aktif</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <span class="stat-number" data-target="10" data-suffix="th">10th</span>
                <span class="stat-label">Pengalaman</span>
              </div>
            </div>
          </div>
          </div>

          <div class="hero-visual animate-scale-in" style="animation-delay:.5s">
            <div class="hero-card-float card-float-1"><i class="fas fa-code"></i> Software Dev</div>
            <div class="hero-card-float card-float-2"><i class="fas fa-robot"></i> AI Solutions</div>
            <div class="hero-card-float card-float-3"><i class="fas fa-network-wired"></i> IoT & Mobile</div>
            <svg class="hero-ring" viewBox="0 0 400 400" fill="none">
              <circle cx="200" cy="200" r="160" stroke="url(#ringGrad)" stroke-width="1.5" stroke-dasharray="12 6"/>
              <circle cx="200" cy="200" r="110" stroke="url(#ringGrad)" stroke-width="1" stroke-dasharray="6 8" opacity=".5"/>
              <circle cx="200" cy="200" r="60" fill="url(#centerGrad)" opacity=".15"/>
              <defs>
                <linearGradient id="ringGrad" x1="0" y1="0" x2="400" y2="400">
                  <stop offset="0%" stop-color="#0a2540"/>
                  <stop offset="100%" stop-color="#2c6b9e"/>
                </linearGradient>
                <radialGradient id="centerGrad">
                  <stop offset="0%" stop-color="#0a2540"/>
                  <stop offset="100%" stop-color="transparent"/>
                </radialGradient>
              </defs>
            </svg>
            <div class="hero-center-icon"><i class="fas fa-laptop-code"></i></div>
          </div>

          <div class="hero-scroll-hint">
            <span>Scroll</span><div class="scroll-line"></div>
          </div>
        </section>

        <!-- About -->
        <section class="section-about">
          <div class="container">
            <div class="section-header reveal">
              <span class="section-tag">Tentang Kami</span>
              <h2>Membangun Teknologi,<br><span class="gradient-text">Membangun Masa Depan</span></h2>
              <p class="section-desc">NeperTech adalah Teaching Factory (TEFA) software development profesional di bawah BLUD SMKN 1 Cirebon — bukan sekadar membangun teknologi, tapi juga mencetak talenta digital Indonesia.</p>
            </div>
            <div class="grid-3 stagger-children">
              ${[
                {icon:'fas fa-bullseye',title:'Teaching Factory',desc:'Seluruh produk dikerjakan oleh siswa-siswi kompeten di bawah bimbingan tenaga pendidik dan standar industri nyata.'},
                {icon:'fas fa-microchip',title:'Smart Technology',desc:'Solusi komprehensif mulai dari website, mobile, desktop, game, IoT, hingga aplikasi berbasis AI yang relevan dengan kebutuhan pasar.'},
                {icon:'fas fa-medal',title:'BLUD SMKN 1 Cirebon',desc:'Secara resmi berada di bawah naungan BLUD SMKN 1 Cirebon dengan standar profesional industri dan komitmen kualitas tinggi.'}
              ].map((c,i) => `
                <div class="card card-hover reveal" style="transition-delay:${i*.12}s">
                  <div class="card-icon-wrap"><i class="${c.icon}"></i></div>
                  <h3>${c.title}</h3><p>${c.desc}</p>
                  <a href="#" data-page="profil" class="card-link">Selengkapnya <i class="fas fa-arrow-right"></i></a>
                </div>`).join('')}
            </div>
          </div>
        </section>

        <!-- Layanan -->
        <section class="section-alt">
          <div class="container">
            <div class="section-header reveal">
              <span class="section-tag">Produk & Layanan</span>
              <h2>Solusi <span class="gradient-text">Teknologi Lengkap</span></h2>
              <p class="section-desc">Lima lini layanan dirancang untuk memenuhi kebutuhan teknologi bisnis Anda secara menyeluruh.</p>
            </div>
            <div class="grid-3">
              ${layananList.map((l,i) => `
                <div class="card card-program reveal" style="transition-delay:${i*.12}s">
                  <div class="card-program-num">${String(i+1).padStart(2,'0')}</div>
                  <div class="card-icon-wrap"><i class="${l.icon}"></i></div>
                  <h3>${l.nama}</h3><p>${l.desc}</p>
                  <a href="#" data-page="layanan" class="card-link">Detail <i class="fas fa-arrow-right"></i></a>
                </div>`).join('')}
            </div>
          </div>
        </section>

        <!-- Nilai Perusahaan -->
        <section>
          <div class="container">
            <div class="section-header reveal">
              <span class="section-tag">Nilai Perusahaan</span>
              <h2>Panduan <span class="gradient-text">Setiap Langkah</span></h2>
              <p class="section-desc">Empat nilai inti yang menjadi fondasi dalam setiap proses kerja NeperTech.</p>
            </div>
            <div class="grid-3">
              ${nilaiList.map((n,i) => `
                <div class="card reveal" style="transition-delay:${i*.12}s">
                  <div class="card-icon-wrap"><i class="${n.icon}"></i></div>
                  <h3>${n.nama}</h3><p>${n.desc}</p>
                </div>`).join('')}
            </div>
          </div>
        </section>

        <!-- Gallery -->
        <section class="section-alt">
          <div class="container">
            <div class="section-header reveal">
              <span class="section-tag">Galeri Kegiatan</span>
              <h2>Momen <span class="gradient-text">Terbaik</span></h2>
            </div>
            <div class="gallery-grid reveal">
              ${galeriFoto.slice(0,6).map(url => `
                <div class="gallery-item">
                  <img src="${url}" alt="galeri" loading="lazy">
                  <div class="gallery-overlay"><i class="fas fa-search-plus"></i></div>
                </div>`).join('')}
            </div>
          </div>
        </section>

        <!-- News -->
        <section>
          <div class="container">
            <div class="section-header reveal">
              <span class="section-tag">Berita & Artikel</span>
              <h2>Update <span class="gradient-text">Terkini</span></h2>
            </div>
            <div class="grid-3">
              ${beritaData.map((b,i) => `
                <div class="card card-news reveal" style="transition-delay:${i*.12}s">
                  <div class="card-news-img"><img src="${b.img}" alt="${b.judul}" loading="lazy"></div>
                  <div class="card-news-body">
                    <span class="news-date"><i class="far fa-calendar"></i> ${b.tgl}</span>
                    <h3>${b.judul}</h3><p>${b.excerpt}</p>
                    <a href="#" class="card-link">Baca <i class="fas fa-arrow-right"></i></a>
                  </div>
                </div>`).join('')}
            </div>
          </div>
        </section>

        <!-- CTA -->
        <div class="cta-section reveal">
          <div class="container">
            <div class="cta-inner">
              <div class="cta-orb cta-orb-1"></div>
              <div class="cta-orb cta-orb-2"></div>
              <span class="section-tag" style="color:rgba(255,255,255,.7);">Mulai Proyek Anda</span>
              <h2>Siap Wujudkan <span class="cta-highlight">Ide Digitalmu?</span></h2>
              <p>Hubungi tim NeperTech dan dapatkan konsultasi gratis untuk proyek teknologi Anda.</p>
              <a href="#" data-page="kontak" class="btn btn-cta btn-arrow">
                Hubungi Kami <i class="fas fa-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>
        ${renderFooter()}
      `;
    }

    function renderProfil() {
      return `
        <section class="page-hero">
          <div class="page-hero-bg"></div>
          <div class="container">
            <span class="section-tag animate-fade-up">About Us</span>
            <h1 class="animate-fade-up" style="animation-delay:.15s">Profil NeperTech</h1>
            <p class="page-hero-sub animate-fade-up" style="animation-delay:.3s">Teaching Factory Software Development · BLUD SMKN 1 Cirebon</p>
          </div>
        </section>
        <div class="container">

          <!-- Tentang -->
          <section>
            <div class="profil-sambutan reveal">
              <div class="sambutan-icon-wrap">
                <i class="fas fa-laptop-code"></i>
              </div>
              <div>
                <span class="section-tag">Tentang Kami</span>
                <h2 style="margin-bottom:16px">Apa itu NeperTech?</h2>
                <blockquote>"Kami bukan hanya membangun teknologi — kami juga membangun masa depan talenta digital Indonesia."</blockquote>
                <p style="margin-top:16px;line-height:1.8;">
                  NeperTech adalah <strong>Teaching Factory (TEFA)</strong> yang bergerak di bidang Software Development profesional, secara resmi berada di bawah naungan <strong>BLUD SMKN 1 Cirebon</strong>. Kami berfokus pada penyediaan solusi teknologi cerdas dan komprehensif — mulai dari website, aplikasi mobile, desktop, game, IoT, hingga aplikasi berbasis AI.
                </p>
                <p style="margin-top:12px;line-height:1.8;">
                  Inti kekuatan kami terletak pada model bisnis TEFA, di mana seluruh produk dikerjakan dan didesain oleh siswa-siswi kompeten di bawah bimbingan tenaga pendidik dan standar industri nyata.
                </p>
              </div>
            </div>
          </section>

          <!-- Visi Misi -->
          <section>
            <div class="section-header reveal" style="text-align:left;margin-bottom:40px">
              <span class="section-tag">Visi & Misi</span>
              <h2>Arah & <span class="gradient-text">Tujuan</span></h2>
            </div>
            <div class="visi-misi-grid reveal">
              <!-- Visi -->
              <div class="card visi-card">
                <div class="card-icon-wrap"><i class="fas fa-eye"></i></div>
                <h3>Visi</h3>
                <p style="font-size:16px;line-height:1.8;color:var(--text);">
                  Menjadi pengembang perangkat lunak berbasis pendidikan yang <strong>terdepan, terpercaya, dan inovatif</strong>, serta menjadi pusat unggulan (<em>center of excellence</em>) dalam penyiapan dan pengembangan talenta muda digital yang berdaya saing global.
                </p>
              </div>
              <!-- Misi -->
              <div class="card">
                <div class="card-icon-wrap"><i class="fas fa-rocket"></i></div>
                <h3>Misi</h3>
                <ul class="misi-list">
                  <li><i class="fas fa-check-circle"></i> Menciptakan produk perangkat lunak yang cerdas (<em>smart tech</em>) dan berkualitas tinggi serta memberikan solusi teknologi komprehensif (website, mobile, game, IoT, dan AI) yang relevan dengan kebutuhan pasar.</li>
                  <li><i class="fas fa-check-circle"></i> Menyelenggarakan proses kerja profesional berbasis standar industri untuk meningkatkan kompetensi dan pengalaman praktis siswa-siswi SMKN 1 Cirebon.</li>
                  <li><i class="fas fa-check-circle"></i> Membangun kemitraan dan kepercayaan pelanggan melalui komitmen terhadap kualitas, pengerjaan proyek yang profesional, dan pelayanan purna jual yang andal.</li>
                </ul>
              </div>
            </div>
          </section>

          <!-- Nilai Perusahaan -->
          <section>
            <div class="section-header reveal">
              <span class="section-tag">Company Values</span>
              <h2>Nilai-Nilai <span class="gradient-text">Perusahaan</span></h2>
              <p class="section-desc">Nilai-nilai ini menjadi panduan dalam setiap proses kerja NeperTech.</p>
            </div>
            <div class="grid-3">
              ${nilaiList.map((n,i) => `
                <div class="card reveal" style="transition-delay:${i*.12}s">
                  <div class="card-icon-wrap"><i class="${n.icon}"></i></div>
                  <h3>${n.nama}</h3><p>${n.desc}</p>
                </div>`).join('')}
            </div>
          </section>

          <!-- Struktur Organisasi -->
          <section>
            <div class="section-header reveal"><h2>Struktur <span class="gradient-text">Organisasi</span></h2></div>
            <div class="grid-3">
              ${[
                {jabatan:'Kepala TEFA', nama:'Nama Kepala TEFA'},
                {jabatan:'Koordinator Proyek', nama:'Nama Koordinator'},
                {jabatan:'Pembimbing Teknis', nama:'Nama Pembimbing'}
              ].map((s,i)=>`
                <div class="card reveal" style="transition-delay:${i*.12}s">
                  <div class="card-icon-wrap"><i class="fas fa-user-tie"></i></div>
                  <h3>${s.nama}</h3>
                  <p>${s.jabatan}<br>BLUD SMKN 1 Cirebon</p>
                </div>`).join('')}
            </div>
          </section>
        </div>${renderFooter()}`;
    }

    function renderLayanan() {
      return `
        <section class="page-hero">
          <div class="page-hero-bg"></div>
          <div class="container">
            <span class="section-tag animate-fade-up">Products & Services</span>
            <h1 class="animate-fade-up" style="animation-delay:.15s">Layanan Kami</h1>
            <p class="page-hero-sub animate-fade-up" style="animation-delay:.3s">Solusi teknologi lengkap dari tim TEFA profesional</p>
          </div>
        </section>
        <div class="container">
          <section>
            <div class="grid-3">
              ${layananList.map((l,i)=>`
                <div class="card card-program reveal" style="transition-delay:${i*.12}s">
                  <div class="card-program-num">${String(i+1).padStart(2,'0')}</div>
                  <div class="card-icon-wrap"><i class="${l.icon}"></i></div>
                  <h3>${l.nama}</h3>
                  <p>${l.desc}</p>
                  <div class="cert-badge"><i class="fas fa-check-circle"></i> Dikerjakan Tim TEFA Profesional</div>
                </div>`).join('')}
            </div>
          </section>

          <!-- Kenapa pilih NeperTech -->
          <section>
            <div class="section-header reveal">
              <span class="section-tag">Keunggulan Kami</span>
              <h2>Mengapa Pilih <span class="gradient-text">NeperTech?</span></h2>
            </div>
            <div class="grid-3">
              ${[
                {icon:'fas fa-users',title:'Tim Terlatih',desc:'Siswa-siswi kompeten yang dibimbing langsung oleh tenaga pendidik berpengalaman dan praktisi industri.'},
                {icon:'fas fa-dollar-sign',title:'Harga Kompetitif',desc:'Sebagai TEFA pendidikan, kami menawarkan solusi berkualitas dengan harga yang lebih terjangkau dibanding vendor komersial.'},
                {icon:'fas fa-headset',title:'Purna Jual Andal',desc:'Dukungan teknis dan layanan after-sales yang responsif untuk memastikan produk Anda berjalan optimal.'}
              ].map((k,i)=>`
                <div class="card reveal" style="transition-delay:${i*.12}s">
                  <div class="card-icon-wrap"><i class="${k.icon}"></i></div>
                  <h3>${k.title}</h3><p>${k.desc}</p>
                </div>`).join('')}
            </div>
          </section>
        </div>${renderFooter()}`;
    }

    function renderFasilitas() {
      return `
        <section class="page-hero">
          <div class="page-hero-bg"></div>
          <div class="container">
            <span class="section-tag animate-fade-up">Infrastruktur</span>
            <h1 class="animate-fade-up" style="animation-delay:.15s">Fasilitas Lengkap</h1>
            <p class="page-hero-sub animate-fade-up" style="animation-delay:.3s">Didukung sarana modern & nyaman</p>
          </div>
        </section>
        <div class="container">
          <div class="grid-3" style="padding:60px 0">
            ${fasilitasList.map((f,i)=>`
              <div class="card card-fasilitas reveal" style="transition-delay:${i*.12}s">
                <div class="card-icon-wrap"><i class="${f.icon}"></i></div>
                <h3>${f.nama}</h3>
                <p>${f.desc} dengan standar internasional dan akses 24/7.</p>
                <div class="fasilitas-img-wrap">
                  <img src="https://picsum.photos/id/${91+i}/400/220" alt="${f.nama}" loading="lazy">
                </div>
              </div>`).join('')}
          </div>
        </div>${renderFooter()}`;
    }

    function renderGaleri() {
      return `
        <section class="page-hero">
          <div class="page-hero-bg"></div>
          <div class="container">
            <span class="section-tag animate-fade-up">Dokumentasi</span>
            <h1 class="animate-fade-up" style="animation-delay:.15s">Galeri Kegiatan</h1>
            <p class="page-hero-sub animate-fade-up" style="animation-delay:.3s">Momen inspiratif tim NeperTech</p>
          </div>
        </section>
        <div class="container" style="padding:60px 24px">
          <div class="gallery-grid reveal">
            ${galeriFoto.map(url=>`
              <div class="gallery-item">
                <img src="${url}" alt="galeri" loading="lazy">
                <div class="gallery-overlay"><i class="fas fa-expand"></i></div>
              </div>`).join('')}
          </div>
        </div>${renderFooter()}`;
    }

    function renderKontak() {
      return `
        <section class="page-hero">
          <div class="page-hero-bg"></div>
          <div class="container">
            <span class="section-tag animate-fade-up">Support</span>
            <h1 class="animate-fade-up" style="animation-delay:.15s">Hubungi Kami</h1>
            <p class="page-hero-sub animate-fade-up" style="animation-delay:.3s">Tim NeperTech siap membantu Anda</p>
          </div>
        </section>
        <div class="container">
          <section>
            <div class="grid-3">
              ${[
                {icon:'fas fa-map-marker-alt',title:'Alamat',body:'BLUD SMKN 1 Cirebon<br>Kota Cirebon, Jawa Barat'},
                {icon:'fas fa-phone-alt',title:'Telepon',body:'+62 XXX XXXX XXXX<br>Senin–Jumat 08.00–16.00'},
                {icon:'fas fa-envelope',title:'Email',body:'info@nepertech.id<br>project@nepertech.id'}
              ].map((c,i)=>`<div class="card reveal" style="transition-delay:${i*.12}s"><div class="card-icon-wrap"><i class="${c.icon}"></i></div><h3>${c.title}</h3><p>${c.body}</p></div>`).join('')}
            </div>
          </section>
          <section>
            <div class="kontak-grid reveal">
              <div class="card">
                <h3>Kirim <span class="gradient-text">Pesan</span></h3>
                <form id="contactForm" class="contact-form">
                  <input type="text" placeholder="Nama Lengkap / Instansi" required>
                  <input type="email" placeholder="Alamat Email" required>
                  <textarea rows="5" placeholder="Ceritakan kebutuhan proyek Anda..." required></textarea>
                  <button type="submit" class="btn btn-primary">Kirim Pesan <i class="fas fa-paper-plane"></i></button>
                </form>
              </div>
              <div class="map-wrap">
                <iframe width="100%" height="100%" style="border:0;min-height:300px;" loading="lazy"
                  src="https://maps.google.com/maps?q=SMKN+1+Cirebon&t=&z=15&ie=UTF8&iwloc=&output=embed">
                </iframe>
              </div>
            </div>
          </section>
        </div>${renderFooter()}`;
    }

    function renderPendaftaran() {
      return `
        <section class="page-hero">
          <div class="page-hero-bg"></div>
          <div class="container">
            <span class="section-tag animate-fade-up">PPDB 2026</span>
            <h1 class="animate-fade-up" style="animation-delay:.15s">Pendaftaran Online</h1>
            <p class="page-hero-sub animate-fade-up" style="animation-delay:.3s">Isi data dengan benar dan lengkap</p>
          </div>
        </section>
        <div class="container" style="padding:60px 24px 80px">
          <div class="card reg-card reveal">
            <div class="step-indicators">
              ${['Data Pribadi','Program','Berkas','Konfirmasi'].map((label,i)=>`
                <div class="step-dot-wrap">
                  <div class="step-dot" data-step="${i+1}">${i+1}</div>
                  <span>${label}</span>
                </div>
                ${i<3?'<div class="step-connector"></div>':''}`).join('')}
            </div>
            <div class="progress-track"><div class="progress-fill"></div></div>
            <form id="regForm">
              <div class="step-form active-step">
                <h3>Data Pribadi</h3>
                <div class="form-grid">
                  <div class="form-group"><label>Nama Lengkap</label><input type="text" placeholder="Masukkan nama lengkap" required></div>
                  <div class="form-group"><label>NISN / No Registrasi</label><input type="text" placeholder="Masukkan NISN"></div>
                  <div class="form-group"><label>Tanggal Lahir</label><input type="date"></div>
                  <div class="form-group"><label>Nomor HP</label><input type="tel" placeholder="+62..."></div>
                </div>
              </div>
              <div class="step-form">
                <h3>Pilihan Program</h3>
                <div class="program-options">
                  ${[
                    {nama:'Rekayasa Perangkat Lunak', icon:'fas fa-code'},
                    {nama:'Multimedia', icon:'fas fa-photo-video'},
                    {nama:'Teknik Komputer & Jaringan', icon:'fas fa-network-wired'}
                  ].map((p,i)=>`
                    <label class="program-option">
                      <input type="radio" name="program" value="${p.nama}" ${i===0?'checked':''}>
                      <div class="program-option-card">
                        <i class="${p.icon}"></i><span>${p.nama}</span>
                      </div>
                    </label>`).join('')}
                </div>
              </div>
              <div class="step-form">
                <h3>Unggah Berkas</h3>
                <div class="upload-list">
                  ${['Ijazah / SKL','Rapor Semester Terakhir','Foto 3×4 (formal)'].map(item=>`
                    <div class="upload-item"><label>${item}</label><input type="file" accept=".pdf,.jpg,.jpeg,.png"></div>`).join('')}
                </div>
              </div>
              <div class="step-form">
                <h3>Konfirmasi Data</h3>
                <div class="confirm-box">
                  <i class="fas fa-shield-alt"></i>
                  <div>
                    <p>Pastikan semua data sudah benar dan dokumen valid. Pendaftaran akan diproses dalam <strong>3 hari kerja</strong>.</p>
                    <label class="check-label"><input type="checkbox" required> Saya menyetujui kebijakan dan syarat pendaftaran NeperTech</label>
                  </div>
                </div>
              </div>
              <div class="form-nav">
                <button type="button" class="btn btn-outline" onclick="prevStep()"><i class="fas fa-arrow-left"></i> Kembali</button>
                <button type="submit" class="btn btn-primary">Selanjutnya <i class="fas fa-arrow-right"></i></button>
              </div>
            </form>
          </div>
        </div>${renderFooter()}`;
    }

    function renderFooter() {
      return `
        <footer class="footer">
          <div class="container">
            <div class="footer-grid">
              <div class="footer-col footer-brand">
                <div class="footer-logo">
                  <img src="images/logo.png" alt="NeperTech"
                       onerror="this.style.display='none';this.nextElementSibling.style.display='block'">
                  <span style="display:none;"></span>
                  <span class="footer-logo-name">NeperTech</span>
                </div>
                <p>Teaching Factory Software Development profesional di bawah BLUD SMKN 1 Cirebon. Membangun teknologi, membangun masa depan.</p>
                <div class="social-links">
                  <a href="#"><i class="fab fa-instagram"></i></a>
                  <a href="#"><i class="fab fa-youtube"></i></a>
                  <a href="#"><i class="fab fa-linkedin"></i></a>
                  <a href="#"><i class="fab fa-github"></i></a>
                </div>
              </div>
              <div class="footer-col">
                <h4>Layanan</h4>
                <a href="#">Website Development</a>
                <a href="#">Mobile App</a>
                <a href="#">Desktop Development</a>
                <a href="#">Game Development</a>
                <a href="#">IoT Solutions</a>
              </div>
              <div class="footer-col">
                <h4>Perusahaan</h4>
                <a href="#">Profil</a>
                <a href="#">Visi & Misi</a>
                <a href="#">Nilai Perusahaan</a>
                <a href="#">Galeri</a>
                <a href="#">Kontak</a>
              </div>
              <div class="footer-col">
                <h4>Kontak</h4>
                <p><i class="fas fa-map-marker-alt" style="margin-right:8px;color:var(--accent)"></i>BLUD SMKN 1 Cirebon</p>
                <p><i class="fas fa-phone" style="margin-right:8px;color:var(--accent)"></i>+62 XXX XXXX XXXX</p>
                <p><i class="fas fa-envelope" style="margin-right:8px;color:var(--accent)"></i>info@nepertech.id</p>
              </div>
            </div>
            <div class="footer-bottom">
              <span>© 2025 NeperTech · BLUD SMKN 1 Cirebon · All rights reserved.</span>
              <span>Teaching Factory Software Development</span>
            </div>
          </div>
        </footer>`;
    }

    // ==================== ROUTING ====================
    document.addEventListener('click', e => {
      const link = e.target.closest('[data-page]');
      if(link) {
        e.preventDefault();
        const page = link.dataset.page;
        if(page) { currentPage = page; renderPage(page); }
        const mobile = document.getElementById('navLinks');
        if(mobile && mobile.classList.contains('active')) mobile.classList.remove('active');
      }
    });

    window.addEventListener('scroll', () => {
      document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 30);
    });

    document.getElementById('menuIcon').addEventListener('click', () => {
      document.getElementById('navLinks').classList.toggle('active');
    });

    renderPage('beranda');
