        document.addEventListener('DOMContentLoaded', function() {
            // Variables
            const sidebar = document.getElementById('sidebar');
            const mobileToggle = document.getElementById('mobileToggle');
            const navLinks = document.querySelectorAll('.sidebar .nav-link');
            const quickActions = document.querySelector('.quick-actions');
            const quickActionBtn = document.querySelector('.quick-action-btn');
            const darkModeToggle = document.getElementById('darkModeToggle');

            // === DARK MODE FUNCTIONALITY === //
            function initDarkMode() {
                // Check for saved theme preference
                const savedTheme = localStorage.getItem('darkMode');
                if (savedTheme === 'enabled' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.body.classList.add('dark-mode');
                    if (darkModeToggle) darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
                }

                // Dark mode toggle event
                if (darkModeToggle) {
                    darkModeToggle.addEventListener('click', function() {
                        document.body.classList.toggle('dark-mode');

                        if (document.body.classList.contains('dark-mode')) {
                            this.innerHTML = '<i class="fas fa-sun"></i>';
                            localStorage.setItem('darkMode', 'enabled');
                            showToast('Karanlık tema aktif edildi', 'info');
                        } else {
                            this.innerHTML = '<i class="fas fa-moon"></i>';
                            localStorage.setItem('darkMode', null);
                            showToast('Aydınlık tema aktif edildi', 'info');
                        }

                        // Reinitialize charts with new theme
                        setTimeout(initCharts, 100);
                    });
                }
            }

            // === PREMIUM TOAST NOTIFICATION SYSTEM === //
            function showToast(message, type = 'success', duration = 3000) {
                const toastContainer = document.querySelector('.toast-container');
                if (!toastContainer) return;

                // Create toast element
                const toast = document.createElement('div');
                toast.className = `toast toast-${type} show`;
                toast.setAttribute('role', 'alert');
                toast.setAttribute('aria-live', 'assertive');
                toast.setAttribute('aria-atomic', 'true');

                // Icon selection
                let icon = 'check-circle';
                if (type === 'error') icon = 'exclamation-circle';
                if (type === 'warning') icon = 'exclamation-triangle';
                if (type === 'info') icon = 'info-circle';

                // Toast content
                toast.innerHTML = `
                    <div class="toast-header">
                        <i class="fas fa-${icon} me-2"></i>
                        <strong class="me-auto">${type.charAt(0).toUpperCase() + type.slice(1)}</strong>
                        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div class="toast-body">
                        ${message}
                    </div>
                `;

                // Add toast to container
                toastContainer.appendChild(toast);

                // Confetti effect for success
                if (type === 'success' && typeof confetti !== 'undefined') {
                    confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.9, x: 0.9 }
                    });
                }

                // Auto-remove toast
                setTimeout(() => {
                    toast.classList.remove('show');
                    toast.classList.add('hide');
                    setTimeout(() => toast.remove(), 500);
                }, duration);

                // Close button event
                const closeBtn = toast.querySelector('.btn-close');
                if (closeBtn) {
                    closeBtn.addEventListener('click', () => {
                        toast.classList.remove('show');
                        toast.classList.add('hide');
                        setTimeout(() => toast.remove(), 300);
                    });
                }
            }

            // === QUICK ACTIONS FLOATING BUTTON === //
            function initQuickActions() {
                if (quickActionBtn) {
                    quickActionBtn.addEventListener('click', function() {
                        quickActions.classList.toggle('active');
                    });

                    // Close menu when clicking outside
                    document.addEventListener('click', function(e) {
                        if (quickActions && !quickActions.contains(e.target)) {
                            quickActions.classList.remove('active');
                        }
                    });

                    // Quick action items
                    const actionItems = document.querySelectorAll('.quick-action-item');
                    actionItems.forEach(item => {
                        item.addEventListener('click', function(e) {
                            e.preventDefault();

                            const action = this.getAttribute('data-action');
                            quickActions.classList.remove('active');

                            switch(action) {
                                case 'new-book':
                                    showToast('Kitap ekleme formu açılıyor...', 'info');
                                    loadPage('books');
                                    break;
                                case 'new-order':
                                    showToast('Sipariş oluşturma sayfası açılıyor...', 'info');
                                    loadPage('orders');
                                    break;
                                case 'new-customer':
                                    showToast('Müşteri ekleme formu açılıyor...', 'info');
                                    loadPage('customers');
                                    break;
                                case 'report':
                                    showToast('Rapor sayfası açılıyor...', 'info');
                                    loadPage('reports');
                                    break;
                            }
                        });
                    });
                }
            }

            // === DRAG & DROP DASHBOARD WIDGETS === //
            function initSortableWidgets() {
                if (typeof Sortable !== 'undefined') {
                    // Make stat cards sortable
                    const statCardsContainer = document.querySelector('#dashboard-content .row');
                    if (statCardsContainer) {
                        new Sortable(statCardsContainer, {
                            animation: 150,
                            handle: '.stat-card',
                            ghostClass: 'sortable-ghost',
                            chosenClass: 'sortable-chosen',
                            dragClass: 'sortable-drag',
                            onEnd: function() {
                                showToast('Dashboard düzeni kaydedildi', 'success');
                            }
                        });
                    }

                    // Make chart containers sortable
                    const chartsContainer = document.querySelector('#dashboard-content .row:nth-child(2)');
                    if (chartsContainer) {
                        new Sortable(chartsContainer, {
                            animation: 150,
                            handle: '.chart-container',
                            ghostClass: 'sortable-ghost',
                            chosenClass: 'sortable-chosen',
                            dragClass: 'sortable-drag',
                            onEnd: function() {
                                showToast('Grafik düzeni güncellendi', 'success');
                                // Reinitialize charts after reordering
                                setTimeout(initCharts, 200);
                            }
                        });
                    }
                }
            }

            // === GSAP PREMIUM ANIMATIONS === //
            function initGSAPAnimations() {
                if (typeof gsap !== 'undefined') {
                    // Page transition animations
                    gsap.set('.page-content', { opacity: 0, y: 20 });

                    // Card hover animations with GSAP
                    document.querySelectorAll('.stat-card').forEach(card => {
                        card.addEventListener('mouseenter', function() {
                            gsap.to(this, { y: -12, rotationX: 5, duration: 0.3, ease: "power2.out" });
                            gsap.to(this.querySelector('.stat-icon'), { scale: 1.1, duration: 0.3, ease: "power2.out" });
                        });

                        card.addEventListener('mouseleave', function() {
                            gsap.to(this, { y: 0, rotationX: 0, duration: 0.3, ease: "power2.out" });
                            gsap.to(this.querySelector('.stat-icon'), { scale: 1, duration: 0.3, ease: "power2.out" });
                        });
                    });

                    // Button ripple effect
                    document.querySelectorAll('.btn').forEach(button => {
                        button.addEventListener('click', function(e) {
                            const circle = document.createElement('span');
                            const diameter = Math.max(button.clientWidth, button.clientHeight);
                            const radius = diameter / 2;

                            circle.style.width = circle.style.height = `${diameter}px`;
                            circle.style.left = `${e.clientX - button.getBoundingClientRect().left - radius}px`;
                            circle.style.top = `${e.clientY - button.getBoundingClientRect().top - radius}px`;
                            circle.style.position = 'absolute';
                            circle.style.borderRadius = '50%';
                            circle.style.background = 'rgba(255,255,255,0.3)';
                            circle.style.transform = 'scale(0)';
                            circle.style.pointerEvents = 'none';

                            button.appendChild(circle);

                            gsap.to(circle, {
                                scale: 2,
                                opacity: 0,
                                duration: 0.6,
                                ease: "power2.out",
                                onComplete: () => circle.remove()
                            });
                        });
                    });
                }
            }

            // === ENHANCED PAGE NAVIGATION === //
            function loadPage(page) {
                const currentPage = document.querySelector('.page-content[style*="block"], .page-content.active');
                const targetPage = document.getElementById(page + '-content');

                if (!targetPage || targetPage === currentPage) return;

                // GSAP page transition
                if (typeof gsap !== 'undefined') {
                    gsap.to(currentPage, {
                        opacity: 0,
                        y: -20,
                        duration: 0.3,
                        onComplete: function() {
                            if (currentPage) {
                                currentPage.style.display = 'none';
                                currentPage.classList.remove('active');
                            }

                            targetPage.style.display = 'block';
                            targetPage.classList.add('active');

                            gsap.fromTo(targetPage,
                                { opacity: 0, y: 20 },
                                { opacity: 1, y: 0, duration: 0.3 }
                            );

                            // Re-initialize charts if dashboard
                            if (page === 'dashboard') {
                                setTimeout(initCharts, 100);
                            }
                        }
                    });
                } else {
                    // Fallback without GSAP
                    if (currentPage) {
                        currentPage.style.display = 'none';
                        currentPage.classList.remove('active');
                    }
                    targetPage.style.display = 'block';
                    targetPage.classList.add('active');

                    if (page === 'dashboard') {
                        setTimeout(initCharts, 100);
                    }
                }

                // Update sidebar active state
                navLinks.forEach(link => {
                    link.parentElement.classList.remove('active');
                    if (link.getAttribute('data-page') === page) {
                        link.parentElement.classList.add('active');
                    }
                });
            }

            // Mobile Sidebar Toggle
            if (mobileToggle) {
                mobileToggle.addEventListener('click', function() {
                    sidebar.classList.toggle('active');
                });
            }

            // Close sidebar when clicking outside on mobile
            document.addEventListener('click', function(event) {
                const isClickInsideSidebar = sidebar.contains(event.target);
                const isClickOnToggleBtn = mobileToggle && mobileToggle.contains(event.target);

                if (window.innerWidth < 992 && !isClickInsideSidebar && !isClickOnToggleBtn && sidebar.classList.contains('active')) {
                    sidebar.classList.remove('active');
                }
            });

            // Navigation Active State and Page Switching
            navLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();

                    // Remove active class from all nav items
                    navLinks.forEach(item => {
                        item.parentElement.classList.remove('active');
                    });

                    // Add active class to clicked nav item
                    this.parentElement.classList.add('active');

                    // Get page name from data attribute
                    const page = this.getAttribute('data-page');

                    // Load page content
                    loadPage(page);

                    // Close sidebar on mobile after navigation
                    if (window.innerWidth < 992) {
                        sidebar.classList.remove('active');
                    }
                });
            });

            // Load Page Content Function
            function loadPage(page) {
                // Hide all page contents
                document.querySelectorAll('.page-content').forEach(content => {
                    content.style.display = 'none';
                });

                // Show selected page content
                const selectedPage = document.getElementById(page + '-content');
                if (selectedPage) {
                    selectedPage.style.display = 'block';

                    // Initialize charts if dashboard
                    if (page === 'dashboard') {
                        setTimeout(initDashboardCharts, 100);
                    }
                } else {
                    // If page not found, default to dashboard
                    document.getElementById('dashboard-content').style.display = 'block';
                    setTimeout(initDashboardCharts, 100);
                }
            }

            // Initialize Dashboard Charts
            function initDashboardCharts() {
                // Sales Chart
                const salesCtx = document.getElementById('salesChart');
                if (salesCtx && !salesCtx.hasAttribute('data-chart-initialized')) {
                    salesCtx.setAttribute('data-chart-initialized', 'true');

                    new Chart(salesCtx, {
                        type: 'line',
                        data: {
                            labels: ['Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül'],
                            datasets: [{
                                label: 'Satış (₺)',
                                data: [65400, 78200, 85600, 92300, 108400, 124580],
                                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                borderColor: 'rgba(59, 130, 246, 1)',
                                borderWidth: 3,
                                pointBackgroundColor: 'rgba(59, 130, 246, 1)',
                                pointRadius: 6,
                                pointHoverRadius: 8,
                                tension: 0.4,
                                fill: true
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    display: false
                                },
                                tooltip: {
                                    mode: 'index',
                                    intersect: false,
                                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                    titleColor: 'white',
                                    bodyColor: 'white',
                                    borderColor: 'rgba(59, 130, 246, 1)',
                                    borderWidth: 1,
                                    cornerRadius: 8,
                                    callbacks: {
                                        label: function(context) {
                                            return `Satış: ₺${context.parsed.y.toLocaleString()}`;
                                        }
                                    }
                                }
                            },
                            scales: {
                                x: {
                                    grid: {
                                        color: 'rgba(0, 0, 0, 0.05)',
                                        drawBorder: false
                                    },
                                    ticks: {
                                        font: {
                                            family: 'Segoe UI'
                                        }
                                    }
                                },
                                y: {
                                    beginAtZero: true,
                                    ticks: {
                                        callback: function(value) {
                                            return '₺' + (value / 1000) + 'K';
                                        },
                                        font: {
                                            family: 'Segoe UI'
                                        }
                                    },
                                    grid: {
                                        color: 'rgba(0, 0, 0, 0.05)',
                                        drawBorder: false
                                    }
                                }
                            },
                            interaction: {
                                intersect: false,
                                mode: 'index'
                            }
                        }
                    });
                }

                // Category Distribution Chart
                const categoryCtx = document.getElementById('categoryChart');
                if (categoryCtx && !categoryCtx.hasAttribute('data-chart-initialized')) {
                    categoryCtx.setAttribute('data-chart-initialized', 'true');

                    new Chart(categoryCtx, {
                        type: 'doughnut',
                        data: {
                            labels: ['Roman', 'Bilim Kurgu', 'Kişisel Gelişim', 'Çocuk Kitapları', 'Tarih', 'Diğer'],
                            datasets: [{
                                data: [35, 22, 18, 12, 8, 5],
                                backgroundColor: [
                                    '#3b82f6',
                                    '#16a34a',
                                    '#ca8a04',
                                    '#dc2626',
                                    '#9333ea',
                                    '#64748b'
                                ],
                                borderWidth: 0,
                                hoverBorderWidth: 3,
                                hoverBorderColor: '#fff'
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'bottom',
                                    labels: {
                                        boxWidth: 12,
                                        padding: 15,
                                        font: {
                                            size: 12,
                                            family: 'Segoe UI'
                                        }
                                    }
                                },
                                tooltip: {
                                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                    titleColor: 'white',
                                    bodyColor: 'white',
                                    borderColor: 'rgba(59, 130, 246, 1)',
                                    borderWidth: 1,
                                    cornerRadius: 8,
                                    callbacks: {
                                        label: function(context) {
                                            return `${context.label}: %${context.parsed}`;
                                        }
                                    }
                                }
                            },
                            cutout: '65%'
                        }
                    });
                }
            }

            // Action Button Interactions
            document.addEventListener('click', function(e) {
                if (e.target.closest('.action-btn')) {
                    e.preventDefault();
                    const btn = e.target.closest('.action-btn');

                    // Add loading effect
                    const originalContent = btn.innerHTML;
                    btn.innerHTML = '<div class="loading"></div>';
                    btn.disabled = true;

                    // Simulate API call
                    setTimeout(() => {
                        btn.innerHTML = originalContent;
                        btn.disabled = false;

                        // Show success toast
                        showToast('İşlem başarıyla tamamlandı!', 'success');
                    }, 1000);
                }
            });

            // Toast Notification Function
            function showToast(message, type = 'success') {
                const toast = document.getElementById('successToast');
                const toastBody = toast.querySelector('.toast-body');
                toastBody.textContent = message;

                const bsToast = new bootstrap.Toast(toast);
                bsToast.show();
            }

            // Initialize dashboard on load
            setTimeout(initDashboardCharts, 100);

            // Real-time Clock in Navbar (Optional Enhancement)
            function updateTime() {
                const now = new Date();
                const timeString = now.toLocaleTimeString('tr-TR');
                const dateString = now.toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });

                // You can add a time display element if needed
                // document.getElementById('current-time').textContent = `${dateString} - ${timeString}`;
            }

            // Update time every second
            setInterval(updateTime, 1000);
            updateTime();



            // === INITIALIZE ALL PREMIUM FEATURES === //
            initDarkMode();
            initQuickActions();
            initGSAPAnimations();

            // Initialize charts on page load
            setTimeout(() => {
                initCharts();
                initSortableWidgets();
            }, 500);

            // Enhanced search functionality
            const enhancedSearchInput = document.querySelector('.search-input');
            if (enhancedSearchInput) {
                enhancedSearchInput.addEventListener('input', function() {
                    const query = this.value;
                    if (query.length > 2) {
                        showToast(`Aranıyor: "${query}"`, 'info', 2000);
                        // Simulate search results
                        console.log('Gelişmiş arama:', query);
                    }
                });
            }

            // === PREMIUM CHART INITIALIZATION === //
            function initCharts() {
                // Improved chart initialization with dark mode support
                const isDarkMode = document.body.classList.contains('dark-mode');
                const textColor = isDarkMode ? '#f1f5f9' : '#1f2937';
                const gridColor = isDarkMode ? 'rgba(241, 245, 249, 0.1)' : 'rgba(0, 0, 0, 0.05)';

                // Initialize dashboard charts with enhanced styling
                initDashboardCharts();
            }

            // === PWA SERVICE WORKER === //
            if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                    const swCode = `
                        const CACHE_NAME = 'ismail-kitap-admin-v1';
                        const urlsToCache = [
                            '/admin.html',
                            '/index.html',
                            'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
                            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css'
                        ];

                        self.addEventListener('install', event => {
                            event.waitUntil(
                                caches.open(CACHE_NAME)
                                    .then(cache => cache.addAll(urlsToCache))
                            );
                        });

                        self.addEventListener('fetch', event => {
                            event.respondWith(
                                caches.match(event.request)
                                    .then(response => response || fetch(event.request))
                            );
                        });
                    `;

                    const blob = new Blob([swCode], { type: 'application/javascript' });
                    const swUrl = URL.createObjectURL(blob);

                    navigator.serviceWorker.register(swUrl)
                        .then(registration => {
                            console.log('ServiceWorker kayıt başarılı:', registration.scope);
                            showToast('Uygulama offline çalışmaya hazır', 'success');
                        })
                        .catch(error => {
                            console.log('ServiceWorker kayıt hatası:', error);
                        });
                });
            }

            // Smooth animations for sidebar
            const style = document.createElement('style');
            style.textContent = `
                .sidebar .nav-link {
                    transform: translateX(0);
                    transition: transform 0.2s ease, background-color 0.2s ease;
                }
                .sidebar .nav-link:hover {
                    transform: translateX(5px);
                }
            `;
            document.head.appendChild(style);

            // Welcome message
            setTimeout(() => {
                showToast('İsmail Kitap Ultimate Admin Panel\'e hoş geldiniz!', 'success', 4000);
            }, 1000);
        });
