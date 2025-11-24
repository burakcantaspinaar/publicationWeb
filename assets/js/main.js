            const searchBar = document.getElementById('mobileSearchBar');
            searchBar.classList.toggle('show');
        }

        // İsmailkitap Seçkisi Swiper Carousel
        document.addEventListener('DOMContentLoaded', function() {
            const selectionSwiper = new Swiper('.selection-carousel', {
                // Navigation arrows
                navigation: {
                    nextEl: '.selection-next',
                    prevEl: '.selection-prev',
                },
                // Pagination
                pagination: {
                    el: '.selection-pagination',
                    type: 'bullets',
                    clickable: true,
                },
                // Lazy loading
                lazy: {
                    loadPrevNext: true,
                    loadPrevNextAmount: 1,
                },
                // Preload images
                preloadImages: false,
                watchSlidesProgress: true,
                // Responsive breakpoints
                breakpoints: {
                    // when window width is >= 320px
                    320: {
                        slidesPerView: 2,
                        spaceBetween: 10,
                    },
                    // when window width is >= 576px
                    576: {
                        slidesPerView: 2,
                        spaceBetween: 15,
                    },
                    // when window width is >= 768px
                    768: {
                        slidesPerView: 3,
                        spaceBetween: 15,
                    },
                    // when window width is >= 992px
                    992: {
                        slidesPerView: 4,
                        spaceBetween: 20,
                    },
                    // when window width is >= 1200px
                    1200: {
                        slidesPerView: 5,
                        spaceBetween: 20,
                    }
                },
                // Other options
                loop: false,
                grabCursor: true,
                watchSlidesProgress: true,
                // Enable touch/mouse drag
                allowTouchMove: true,
                // Smooth transitions
                speed: 300,
            });

            // Çok Satanlar Swiper Carousel
            const bestsellersSwiper = new Swiper('.bestsellers-carousel', {
                // Navigation arrows
                navigation: {
                    nextEl: '.bestsellers-next',
                    prevEl: '.bestsellers-prev',
                },
                // Pagination
                pagination: {
                    el: '.bestsellers-pagination',
                    type: 'bullets',
                    clickable: true,
                },
                // Lazy loading
                lazy: {
                    loadPrevNext: true,
                    loadPrevNextAmount: 1,
                },
                // Preload images
                preloadImages: false,
                watchSlidesProgress: true,
                // Responsive breakpoints - Same as selection carousel
                breakpoints: {
                    // when window width is >= 320px
                    320: {
                        slidesPerView: 2,
                        spaceBetween: 10,
                    },
                    // when window width is >= 576px
                    576: {
                        slidesPerView: 2,
                        spaceBetween: 15,
                    },
                    // when window width is >= 768px
                    768: {
                        slidesPerView: 3,
                        spaceBetween: 15,
                    },
                    // when window width is >= 992px
                    992: {
                        slidesPerView: 4,
                        spaceBetween: 20,
                    },
                    // when window width is >= 1200px
                    1200: {
                        slidesPerView: 5,
                        spaceBetween: 20,
                    }
                },
                // Other options
                loop: false,
                grabCursor: true,
                watchSlidesProgress: true,
                // Enable touch/mouse drag
                allowTouchMove: true,
                // Smooth transitions
                speed: 300,
            });

            // Yeni Çıkanlar Swiper Carousel
            const newbooksSwiper = new Swiper('.newbooks-carousel', {
                // Navigation arrows
                navigation: {
                    nextEl: '.newbooks-next',
                    prevEl: '.newbooks-prev',
                },
                // Pagination
                pagination: {
                    el: '.newbooks-pagination',
                    type: 'bullets',
                    clickable: true,
                },
                // Lazy loading
                lazy: {
                    loadPrevNext: true,
                    loadPrevNextAmount: 1,
                },
                // Preload images
                preloadImages: false,
                watchSlidesProgress: true,
                // Responsive breakpoints - Same as other carousels
                breakpoints: {
                    // when window width is >= 320px
                    320: {
                        slidesPerView: 2,
                        spaceBetween: 10,
                    },
                    // when window width is >= 576px
                    576: {
                        slidesPerView: 2,
                        spaceBetween: 15,
                    },
                    // when window width is >= 768px
                    768: {
                        slidesPerView: 3,
                        spaceBetween: 15,
                    },
                    // when window width is >= 992px
                    992: {
                        slidesPerView: 4,
                        spaceBetween: 20,
                    },
                    // when window width is >= 1200px
                    1200: {
                        slidesPerView: 5,
                        spaceBetween: 20,
                    }
                },
                // Other options
                loop: false,
                grabCursor: true,
                watchSlidesProgress: true,
                // Enable touch/mouse drag
                allowTouchMove: true,
                // Smooth transitions
                speed: 300,
            });

            // Hızlı işlem butonlarını otomatik ekle (sadece henüz eklenmemiş kartlara)
            document.querySelectorAll('.book-cover-wrap').forEach(function(coverWrap) {
                // Eğer bu kapsamda zaten action butonları varsa, atlayın
                if (!coverWrap.querySelector('.book-actions')) {
                    const actionsDiv = document.createElement('div');
                    actionsDiv.className = 'book-actions';
                    actionsDiv.innerHTML = `
                        <button class="btn-book-action" title="Sepete Ekle"><i class="fas fa-shopping-cart"></i></button>
                        <button class="btn-book-action" title="Favoriye Ekle"><i class="fas fa-heart"></i></button>
                        <button class="btn-book-action" title="Önizleme"><i class="fas fa-eye"></i></button>
                    `;
                    coverWrap.appendChild(actionsDiv);
                }

                // Rozet ekle (sadece henüz eklenmemiş kartlara)
                if (!coverWrap.querySelector('.book-badges')) {
                    const badgesDiv = document.createElement('div');
                    badgesDiv.className = 'book-badges';

                    // Rastgele rozet türü belirleme
                    const badgeTypes = ['bestseller', 'new', 'sale', null];
                    const randomBadge = badgeTypes[Math.floor(Math.random() * badgeTypes.length)];

                    if (randomBadge) {
                        const badgeTexts = {
                            'bestseller': 'Çok Satan',
                            'new': 'Yeni',
                            'sale': 'İndirimli'
                        };

                        badgesDiv.innerHTML = `<span class="book-badge ${randomBadge}">${badgeTexts[randomBadge]}</span>`;
                        coverWrap.appendChild(badgesDiv);
                    }
                }
            });

            // Fiyat bilgilerini otomatik ekle (sadece henüz eklenmemiş kartlara)
            document.querySelectorAll('.book-info').forEach(function(bookInfo, index) {
                if (!bookInfo.querySelector('.book-price')) {
                    const priceDiv = document.createElement('div');
                    priceDiv.className = 'book-price';

                    // Rastgele fiyat ve indirim belirleme
                    const basePrice = 50 + Math.floor(Math.random() * 100); // 50-150 TL arası
                    const isOnSale = Math.random() < 0.3; // %30 ihtimalle indirimli

                    if (isOnSale) {
                        const discountPercent = 10 + Math.floor(Math.random() * 40); // %10-50 arası
                        const discountedPrice = basePrice * (1 - discountPercent / 100);

                        priceDiv.innerHTML = `
                            <span class="book-price-current">${discountedPrice.toFixed(2).replace('.', ',')} ₺</span>
                            <span class="book-price-original">${basePrice.toFixed(2).replace('.', ',')} ₺</span>
                            <span class="book-price-discount">%${discountPercent} İndirim</span>
                        `;
                    } else {
                        priceDiv.innerHTML = `<span class="book-price-current">${basePrice.toFixed(2).replace('.', ',')} ₺</span>`;
                    }

                    bookInfo.appendChild(priceDiv);
                }
            });

            // Modal fonksiyonları için event listener ekle
            document.addEventListener('click', function(e) {
                if (e.target.closest('.btn-book-action[title="Önizleme"]')) {
                    e.preventDefault();
                    const bookCard = e.target.closest('.book-card');
                    openBookModal(bookCard);
                }
            });
        });

        // Modal fonksiyonları
        function openBookModal(bookCard) {
            const img = bookCard.querySelector('.book-cover');
            const title = bookCard.querySelector('.book-title')?.textContent || 'Kitap Başlığı';
            const author = bookCard.querySelector('.book-author')?.textContent || 'Yazar Adı';
            const publisher = bookCard.querySelector('.book-publisher')?.textContent || 'Yayınevi';
            const price = bookCard.querySelector('.book-price-current')?.textContent || '89,90 ₺';

            // Modal içeriğini güncelle
            document.getElementById('modalBookImage').src = img.src;
            document.getElementById('modalBookImage').alt = title;
            document.getElementById('modalBookTitle').textContent = title;
            document.getElementById('modalBookAuthor').textContent = author;
            document.getElementById('modalBookPublisher').textContent = publisher;
            document.getElementById('modalBookPrice').textContent = price;

            // Rastgele kitap detayları
            const pages = Math.floor(Math.random() * 400) + 100;
            const languages = ['Türkçe', 'İngilizce', 'Almanca', 'Fransızca'];
            const randomLanguage = languages[Math.floor(Math.random() * languages.length)];

            document.getElementById('modalBookPages').textContent = pages;
            document.getElementById('modalBookLanguage').textContent = randomLanguage;

            // Modal açma
            const bookModal = new bootstrap.Modal(document.getElementById('bookModal'));
            bookModal.show();
        }

        function addToCart() {
            const title = document.getElementById('modalBookTitle').textContent;
            showToast(`"${title}" sepete eklendi!`, 'success');

            // Modal'ı kapat
            const bookModal = bootstrap.Modal.getInstance(document.getElementById('bookModal'));
            bookModal.hide();
        }

        function addToFavorites() {
            const title = document.getElementById('modalBookTitle').textContent;
            showToast(`"${title}" favorilere eklendi!`, 'success');

            // Modal'ı kapat
            const bookModal = bootstrap.Modal.getInstance(document.getElementById('bookModal'));
            bookModal.hide();
        }

        // Toast fonksiyonu
        function showToast(message, type = 'info', duration = 3000) {
            const toastContainer = document.getElementById('toastContainer');
            const toastId = 'toast-' + Date.now();

            const toastHtml = `
                <div class="toast toast-${type}" id="${toastId}" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="toast-header">
                        <i class="fas ${getToastIcon(type)} me-2"></i>
                        <strong class="me-auto">${getToastTitle(type)}</strong>
                        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div class="toast-body">
                        ${message}
                    </div>
                </div>
            `;

            toastContainer.insertAdjacentHTML('beforeend', toastHtml);

            const toastElement = document.getElementById(toastId);
            const toast = new bootstrap.Toast(toastElement, {
                autohide: true,
                delay: duration
            });

            toast.show();

            // Toast kapandıktan sonra DOM'dan kaldır
            toastElement.addEventListener('hidden.bs.toast', function() {
                toastElement.remove();
            });
        }

        function getToastIcon(type) {
            switch(type) {
                case 'success': return 'fa-check-circle';
                case 'error': return 'fa-exclamation-circle';
                case 'info': return 'fa-info-circle';
                default: return 'fa-info-circle';
            }
        }

        function getToastTitle(type) {
            switch(type) {
                case 'success': return 'Başarılı';
                case 'error': return 'Hata';
                case 'info': return 'Bilgi';
                default: return 'Bildirim';
            }
        }

        // Hızlı işlem butonları için event listener'lar
        document.addEventListener('click', function(e) {
            if (e.target.closest('.btn-book-action[title="Sepete Ekle"]')) {
                e.preventDefault();
                const bookCard = e.target.closest('.book-card');
                const title = bookCard.querySelector('.book-title')?.textContent || 'Kitap';
                showToast(`"${title}" sepete eklendi!`, 'success');
            }

            if (e.target.closest('.btn-book-action[title="Favoriye Ekle"]')) {
                e.preventDefault();
                const bookCard = e.target.closest('.book-card');
                const title = bookCard.querySelector('.book-title')?.textContent || 'Kitap';
                showToast(`"${title}" favorilere eklendi!`, 'success');
            }
        });

        // Accessibility ve Performance İyileştirmeleri
        function initializeAccessibility() {
            // Alt text'leri güncelle
            document.querySelectorAll('.book-cover').forEach(function(img) {
                const bookCard = img.closest('.book-card');
                const title = bookCard?.querySelector('.book-title')?.textContent;
                const author = bookCard?.querySelector('.book-author')?.textContent;

                if (title) {
                    img.alt = author ? `${title} - ${author} kitabının kapağı` : `${title} kitabının kapağı`;
                }

                // Lazy loading ekle
                img.loading = 'lazy';
            });

            // ARIA etiketleri ekle
            document.querySelectorAll('.book-card').forEach(function(card, index) {
                card.setAttribute('role', 'article');
                card.setAttribute('aria-labelledby', `book-title-${index}`);

                const titleElement = card.querySelector('.book-title');
                if (titleElement) {
                    titleElement.id = `book-title-${index}`;
                }
            });

            // Carousel'lara ARIA etiketleri
            document.querySelectorAll('.swiper').forEach(function(carousel) {
                carousel.setAttribute('role', 'region');
                carousel.setAttribute('aria-label', 'Kitap carousel\'ı');
            });

            // Navigation butonlarına ARIA etiketleri ve tabindex
            document.querySelectorAll('.swiper-button-prev').forEach(function(btn) {
                btn.setAttribute('aria-label', 'Önceki kitaplar');
                btn.setAttribute('role', 'button');
                btn.setAttribute('tabindex', '0');
            });

            document.querySelectorAll('.swiper-button-next').forEach(function(btn) {
                btn.setAttribute('aria-label', 'Sonraki kitaplar');
                btn.setAttribute('role', 'button');
                btn.setAttribute('tabindex', '0');
            });

            // Keyboard navigation
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    const focusedElement = document.activeElement;

                    if (focusedElement.classList.contains('swiper-button-prev') ||
                        focusedElement.classList.contains('swiper-button-next')) {
                        e.preventDefault();
                        focusedElement.click();
                    }

                    if (focusedElement.classList.contains('btn-book-action')) {
                        e.preventDefault();
                        focusedElement.click();
                    }
                }
            });

            // Focus yönetimi
            document.querySelectorAll('.btn-book-action').forEach(function(btn) {
                btn.setAttribute('tabindex', '0');

                btn.addEventListener('focus', function() {
                    this.style.outline = '2px solid var(--primary-blue)';
                    this.style.outlineOffset = '2px';
                });

                btn.addEventListener('blur', function() {
                    this.style.outline = '';
                    this.style.outlineOffset = '';
                });
            });
        }

        // Accessibility fonksiyonunu çağır
        setTimeout(initializeAccessibility, 500);
