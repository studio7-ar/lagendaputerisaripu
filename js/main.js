// =========================================
// THE LEGEND OF PUTERI SARIPU
// MAIN JAVASCRIPT
// =========================================


// 1. MOBILE NAVIGATION

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
menuToggle.addEventListener("click", () => {

    const isOpen = navLinks.classList.toggle("active");

    menuToggle.textContent = isOpen ? "✕" : "☰";
    menuToggle.setAttribute("aria-expanded", isOpen);

});

document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("click", () => {

        navLinks.classList.remove("active");
        menuToggle.textContent = "☰";
        menuToggle.setAttribute("aria-expanded", "false");

    });

});
}


// 2. INTERACTIVE BOOK COVER

const heroImage = document.querySelector(".hero-image");

const bookCover = heroImage.querySelector(
    "img, .cover-placeholder"
);

const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

if (heroImage && bookCover && !reduceMotion) {

    heroImage.addEventListener("mousemove", (event) => {

        const rect = heroImage.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((centerY - y) / centerY) * 12;
        const rotateY = ((x - centerX) / centerX) * 12;

        bookCover.style.transform = `
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            scale(1.04)
        `;

    });

    heroImage.addEventListener("mouseleave", () => {

        bookCover.style.transform = `
            rotateX(0deg)
            rotateY(0deg)
            scale(1)
        `;

    });

}


// 3. GENERATE 12 STORY SCENES

const scenesGrid = document.getElementById("scenesGrid");

for (let i = 1; i <= 12; i++) {

    const sceneNumber = String(i).padStart(2, "0");

    const sceneCard = document.createElement("article");

    sceneCard.className = "scene-card";

    sceneCard.innerHTML = `

        <div class="scene-image">
            <span>Scene ${sceneNumber}</span>
        </div>

        <div class="scene-info">

            <span class="scene-label">
                STORY SCENE ${sceneNumber}
            </span>

            <h3>Scene ${sceneNumber}</h3>

            <a href="viewer.html?scene=${i}&lang=en"
               class="scene-button">

                View in 3D

            </a>

        </div>

    `;

    scenesGrid.appendChild(sceneCard);

}


// 4. FAQ ACCORDION

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {

    item.addEventListener("toggle", () => {

        if (item.open) {

            faqItems.forEach(other => {

                if (other !== item) {
                    other.open = false;
                }

            });

        }

    });

});