"use strict";

/* ========================================
   1. CURRENT YEAR
======================================== */

const yearElement = document.getElementById("current-year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}


/* ========================================
   2. LIGHT / DARK THEME SWITCH
======================================== */

const themeButton = document.getElementById("theme-toggle");

if (themeButton) {
    themeButton.addEventListener("click", function () {

        const isDark = document.body.classList.toggle("dark-theme");

        themeButton.textContent = isDark
            ? "☀️ Light Mode"
            : "🌙 Dark Mode";

        themeButton.setAttribute("aria-pressed", String(isDark));

    });
}


/* ========================================
   3. PROJECT SEARCH AND FILTER
======================================== */

const projectSearch = document.getElementById("project-search");
const resetSearchButton = document.getElementById("reset-search");
const projectCards = document.querySelectorAll(".project-card");
const searchStatus = document.getElementById("search-status");
const noProjectsMessage = document.getElementById("no-projects");

function filterProjects() {

    const query = projectSearch.value.trim().toLowerCase();

    let visibleCount = 0;

    projectCards.forEach(function (card) {

        const searchableText = (
            card.textContent + " " +
            card.dataset.search
        ).toLowerCase();

        const matches = searchableText.includes(query);

        card.hidden = !matches;

        if (matches) {
            visibleCount++;
        }

    });

    searchStatus.textContent =
        `Showing ${visibleCount} of ${projectCards.length} projects and skills.`;

    noProjectsMessage.hidden = visibleCount !== 0;
}

if (projectSearch) {
    projectSearch.addEventListener("input", filterProjects);
}

if (resetSearchButton) {
    resetSearchButton.addEventListener("click", function () {

        projectSearch.value = "";

        filterProjects();

        projectSearch.focus();

    });
}


/* ========================================
   4. CONTACT FORM VALIDATION AND PREVIEW
======================================== */

const contactForm = document.getElementById("contact-form");
const formPreview = document.getElementById("form-preview");

const previewName = document.getElementById("preview-name");
const previewEmail = document.getElementById("preview-email");
const previewTopic = document.getElementById("preview-topic");
const previewMessage = document.getElementById("preview-message");

const formStatus = document.getElementById("form-status");
const editMessageButton = document.getElementById("edit-message");

if (contactForm) {

    contactForm.addEventListener("submit", function (event) {

        // Prevent the browser from submitting the form.
        event.preventDefault();

        // Run built-in HTML validation.
        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const topic = document.getElementById("topic").value;
        const message = document.getElementById("message").value.trim();

        if (name.length < 2 || message.length < 5) {
            formStatus.textContent =
                "Please check that your name and message are long enough.";

            formPreview.hidden = false;
            return;
        }

        // Use textContent so the user's input is displayed as text.
        previewName.textContent = `Name: ${name}`;
        previewEmail.textContent = `Email: ${email}`;
        previewTopic.textContent = `Topic: ${topic}`;
        previewMessage.textContent = `Message: ${message}`;

        formStatus.textContent =
            "Your message is valid. This is a preview only; nothing has been sent.";

        formPreview.hidden = false;

        formPreview.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });

    });

}

if (editMessageButton) {

    editMessageButton.addEventListener("click", function () {

        formPreview.hidden = true;

        document.getElementById("name").focus();

    });

}


/* ========================================
   5. INTERACTIVE PHOTO GALLERY
======================================== */

const galleryButtons = document.querySelectorAll(".gallery-open");

const galleryViewer = document.getElementById("gallery-viewer");
const galleryImage = document.getElementById("gallery-image");
const galleryCaption = document.getElementById("gallery-caption");

const galleryClose = document.getElementById("gallery-close");
const galleryPrevious = document.getElementById("gallery-previous");
const galleryNext = document.getElementById("gallery-next");

const galleryItems = Array.from(galleryButtons).map(function (button) {

    const image = button.querySelector("img");

    const figure = button.closest("figure");

    const caption = figure.querySelector("figcaption");

    return {
        src: image.getAttribute("src"),
        alt: image.alt,
        caption: caption.textContent.trim()
    };

});

let currentPhotoIndex = 0;
let previouslyFocusedElement = null;

function displayGalleryPhoto(index) {

    if (galleryItems.length === 0) {
        return;
    }

    // Wrap around when reaching either end.
    currentPhotoIndex =
        (index + galleryItems.length) % galleryItems.length;

    const photo = galleryItems[currentPhotoIndex];

    galleryImage.src = photo.src;
    galleryImage.alt = photo.alt;
    galleryCaption.textContent = photo.caption;

}

function openGallery(index) {

    previouslyFocusedElement = document.activeElement;

    displayGalleryPhoto(index);

    galleryViewer.hidden = false;

    document.body.classList.add("gallery-open");

    galleryClose.focus();

}

function closeGallery() {

    galleryViewer.hidden = true;

    document.body.classList.remove("gallery-open");

    if (previouslyFocusedElement) {
        previouslyFocusedElement.focus();
    }

}

galleryButtons.forEach(function (button, index) {

    button.addEventListener("click", function () {
        openGallery(index);
    });

});

if (galleryPrevious) {

    galleryPrevious.addEventListener("click", function () {
        displayGalleryPhoto(currentPhotoIndex - 1);
    });

}

if (galleryNext) {

    galleryNext.addEventListener("click", function () {
        displayGalleryPhoto(currentPhotoIndex + 1);
    });

}

if (galleryClose) {

    galleryClose.addEventListener("click", closeGallery);

}

if (galleryViewer) {

    galleryViewer.addEventListener("click", function (event) {

        if (event.target === galleryViewer) {
            closeGallery();
        }

    });

}

document.addEventListener("keydown", function (event) {

    if (!galleryViewer || galleryViewer.hidden) {
        return;
    }

    if (event.key === "Escape") {
        closeGallery();
    }

    if (event.key === "ArrowLeft") {
        displayGalleryPhoto(currentPhotoIndex - 1);
    }

    if (event.key === "ArrowRight") {
        displayGalleryPhoto(currentPhotoIndex + 1);
    }

});