function openTicketModal(serviceName) {
    const modal = document.getElementById('modal-ticket');
    if (modal) {
        modal.classList.remove('hidden');
        const select = document.getElementById('service-type');
        if (select && serviceName !== 'General') {
            select.value = serviceName;
        }
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
    }
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function calculateTotal() {
    const checkboxes = document.querySelectorAll('.est-check');
    let total = 0;
    checkboxes.forEach(box => {
        if (box.checked) {
            total += parseFloat(box.value);
        }
    });
    const priceDisplay = document.getElementById('total-price');
    if (priceDisplay) {
        priceDisplay.innerText = '$' + total.toFixed(2);
    }
}

function submitTicket(event) {
    event.preventDefault();
    alert('¡Cotización enviada con éxito!');
    closeModal('modal-ticket');
}
