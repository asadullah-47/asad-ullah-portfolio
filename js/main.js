
/* ==========================================
   MAIN JAVASCRIPT
   Asad Ullah Portfolio
========================================== */


/* ------------------------------------------
   1. RUN FUNCTIONS WHEN DOM IS READY
------------------------------------------ */

function runWhenReady(callback) {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", callback);
    } else {
        callback();
    }
}


/* ------------------------------------------
   2. LOAD SHARED HEADER
------------------------------------------ */

runWhenReady(loadHeader);

async function loadHeader() {
    const placeholder = document.getElementById("header-placeholder");

    if (!placeholder) return;

    try {
        const response = await fetch("./components/header.html");

        if (!response.ok) {
            throw new Error("Header could not be loaded.");
        }

        placeholder.innerHTML = await response.text();

        setActiveNavigation();
        initializeMobileMenu();

        document.dispatchEvent(new Event("headerLoaded"));

    } catch (error) {
        // Header loading failed. Check the file path and Live Server setup.
    }
}


/* ------------------------------------------
   3. ACTIVE NAVIGATION
------------------------------------------ */

function setActiveNavigation() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll("#primary-navigation a");

    navLinks.forEach(link => {
        const linkPath = new URL(link.href, window.location.origin).pathname;

        const isHome =
            (currentPath === "/" || currentPath.endsWith("/index.html")) &&
            (linkPath === "/" || linkPath.endsWith("/index.html"));

        if (linkPath === currentPath || isHome) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        } else {
            link.classList.remove("active");
            link.removeAttribute("aria-current");
        }
    });
}


/* ------------------------------------------
   4. MOBILE NAVIGATION
------------------------------------------ */

function initializeMobileMenu() {
    const menuToggle = document.getElementById("menu-toggle");
    const navigation = document.getElementById("primary-navigation");

    if (!menuToggle || !navigation) return;

    function openMenu() {
        navigation.classList.add("is-open");
        menuToggle.setAttribute("aria-expanded", "true");
    }

    function closeMenu() {
        navigation.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
    }

    menuToggle.addEventListener("click", () => {
        const isOpen = navigation.classList.contains("is-open");

        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close menu after clicking a navigation link.
    navigation.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", closeMenu);
    });

    // Close menu with Escape key.
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeMenu();
        }
    });

    // Close menu when clicking outside.
    document.addEventListener("click", event => {
        if (
            navigation.classList.contains("is-open") &&
            !navigation.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {
            closeMenu();
        }
    });

    // Reset menu on desktop screen sizes.
    window.addEventListener("resize", () => {
        if (window.innerWidth > 760) {
            closeMenu();
        }
    });
}


/* ------------------------------------------
   5. LOAD SHARED FOOTER
------------------------------------------ */

runWhenReady(loadFooter);

async function loadFooter() {
    const placeholder = document.getElementById("footer-placeholder");

    if (!placeholder) return;

    try {
        const response = await fetch("./components/footer.html");

        if (!response.ok) {
            throw new Error("Footer could not be loaded.");
        }

        placeholder.innerHTML = await response.text();

        updateFooterYear();
        initializeScrollToTop();

    } catch (error) {
        // Footer loading failed. Check the file path and Live Server setup.
    }
}


/* ------------------------------------------
   6. AUTOMATIC FOOTER YEAR
------------------------------------------ */

function updateFooterYear() {
    const yearElement = document.getElementById("footer-year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}


/* ------------------------------------------
   7. SCROLL TO TOP
------------------------------------------ */

function initializeScrollToTop() {
    const scrollButton = document.getElementById("scrollToTop");

    if (!scrollButton) return;

    function updateScrollButton() {
        if (window.scrollY > 300) {
            scrollButton.classList.add("show");
        } else {
            scrollButton.classList.remove("show");
        }
    }

    window.addEventListener("scroll", updateScrollButton, {
        passive: true
    });

    scrollButton.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    updateScrollButton();
}


/* ------------------------------------------
   8. GRAPHIC DESIGN GALLERY & LIGHTBOX
------------------------------------------ */

runWhenReady(initGraphicGallery);

function initGraphicGallery() {
    const gallery = document.getElementById("graphicGallery");
    const lightbox = document.getElementById("graphicLightbox");

    if (!gallery || !lightbox) return;

    const galleryItems = Array.from(
        gallery.querySelectorAll(".graphic-gallery-item")
    );

    const galleryArrows = document.querySelectorAll(
        ".graphic-arrow[data-slide]"
    );

    const closeButton = lightbox.querySelector(".graphic-lightbox-close");
    const previousButton = lightbox.querySelector(".graphic-lightbox-prev");
    const nextButton = lightbox.querySelector(".graphic-lightbox-next");
    const lightboxImage = lightbox.querySelector(".graphic-lightbox-image");
    const caption = lightbox.querySelector(".graphic-lightbox-caption");

    if (
        !galleryItems.length ||
        !closeButton ||
        !previousButton ||
        !nextButton ||
        !lightboxImage ||
        !caption
    ) {
        return;
    }

    let currentIndex = 0;
    let previousFocus = null;
    let previousBodyOverflow = "";

    /* --------------------------------------
       GALLERY HORIZONTAL SCROLL
    -------------------------------------- */

    galleryArrows.forEach(button => {
        button.addEventListener("click", () => {
            const direction = button.dataset.slide === "next" ? 1 : -1;

            gallery.scrollBy({
                left: direction * gallery.clientWidth * 0.8,
                behavior: "smooth"
            });
        });
    });


    /* --------------------------------------
       OPEN LIGHTBOX
    -------------------------------------- */

    function openLightbox(index) {
        currentIndex = index;

        const selectedItem = galleryItems[currentIndex];
        const image = selectedItem.querySelector("img");

        if (!image) return;

        const fullImage =
            selectedItem.dataset.fullImage ||
            image.currentSrc ||
            image.src;

        previousFocus = document.activeElement;
        previousBodyOverflow = document.body.style.overflow;

        lightboxImage.src = fullImage;
        lightboxImage.alt = image.alt || "Graphic design artwork";

        caption.textContent = image.alt || "";

        lightbox.classList.add("is-open");
        lightbox.setAttribute("aria-hidden", "false");

        document.body.style.overflow = "hidden";

        closeButton.focus();
    }


    /* --------------------------------------
       CLOSE LIGHTBOX
    -------------------------------------- */

    function closeLightbox() {
        if (!lightbox.classList.contains("is-open")) return;

        lightbox.classList.remove("is-open");
        lightbox.setAttribute("aria-hidden", "true");

        lightboxImage.removeAttribute("src");
        caption.textContent = "";

        document.body.style.overflow = previousBodyOverflow;

        if (previousFocus && typeof previousFocus.focus === "function") {
            previousFocus.focus();
        }
    }


    /* --------------------------------------
       SHOW PREVIOUS / NEXT IMAGE
    -------------------------------------- */

    function showImage(direction) {
        currentIndex =
            (currentIndex + direction + galleryItems.length) %
            galleryItems.length;

        const selectedItem = galleryItems[currentIndex];
        const image = selectedItem.querySelector("img");

        if (!image) return;

        lightboxImage.src =
            selectedItem.dataset.fullImage ||
            image.currentSrc ||
            image.src;

        lightboxImage.alt = image.alt || "Graphic design artwork";
        caption.textContent = image.alt || "";
    }


    /* --------------------------------------
       GALLERY IMAGE CLICK EVENTS
    -------------------------------------- */

    galleryItems.forEach((item, index) => {
        item.addEventListener("click", () => {
            openLightbox(index);
        });
    });


    /* --------------------------------------
       LIGHTBOX BUTTON EVENTS
    -------------------------------------- */

    closeButton.addEventListener("click", closeLightbox);

    previousButton.addEventListener("click", () => {
        showImage(-1);
    });

    nextButton.addEventListener("click", () => {
        showImage(1);
    });


    /* --------------------------------------
       CLOSE WHEN CLICKING BACKGROUND
    -------------------------------------- */

    lightbox.addEventListener("click", event => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });


    /* --------------------------------------
       KEYBOARD CONTROLS
    -------------------------------------- */

    document.addEventListener("keydown", event => {
        if (!lightbox.classList.contains("is-open")) return;

        if (event.key === "Escape") {
            closeLightbox();
        }

        if (event.key === "ArrowLeft") {
            showImage(-1);
        }

        if (event.key === "ArrowRight") {
            showImage(1);
        }
    });
}


