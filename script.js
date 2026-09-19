document.addEventListener("DOMContentLoaded", () => {
    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach(item => {
        const questionBtn = item.querySelector(".faq-question");

        questionBtn.addEventListener("click", () => {
            const isActive = item.classList.contains("active");

            // Cierra todas las preguntas abiertas
            faqItems.forEach(innerItem => innerItem.classList.remove("active"));

            // Si no estaba activa, abre la seleccionada
            if (!isActive) {
                item.classList.add("active");
            }
        });
    });
});
