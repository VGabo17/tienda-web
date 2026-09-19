// =========================================================================
// CONFIGURACIÓN DE WEBHOOK DE DISCORD (Opcional)
// Pega aquí la URL del Webhook de tu canal en Discord si quieres recibir los pedidos
// =========================================================================
const DISCORD_WEBHOOK_URL = ""; 

document.addEventListener("DOMContentLoaded", function() {
    checkActiveSession();
    setupCalculadora();
    setupFAQ();
});

// ---------- GESTIÓN DE MODALES ----------
function openTicketModal(defaultService) {
    defaultService = defaultService || 'General';
    var modal = document.getElementById('modal-ticket');
    if (!modal) return;
    
    var serviceSelect = document.getElementById('service-type');
    if (serviceSelect && defaultService !== 'General') {
        serviceSelect.value = defaultService;
    }
    
    var savedUser = localStorage.getItem('synthetix_user');
    if (savedUser) {
        var userInput = document.getElementById('discord-user');
        if (userInput) userInput.value = savedUser;
    }

    modal.classList.remove('hidden');
}

function openLoginModal() {
    var modal = document.getElementById('modal-login');
    if (modal) modal.classList.remove('hidden');
}

function closeModal(modalId) {
    var modal = document.getElementById(modalId);
    if (modal) modal.classList.add('hidden');
}

// Cerrar modal al hacer clic fuera de la tarjeta
window.onclick = function(event) {
    if (event.target.classList.contains('modal-overlay')) {
        event.target.classList.add('hidden');
    }
};

function scrollToSection(sectionId) {
    var section = document.getElementById(sectionId);
    if (section) section.scrollIntoView({ behavior: 'smooth' });
}

// ---------- ENVÍO DE COTIZACIÓN ----------
async function submitTicket(event) {
    if (event) event.preventDefault();
    var btnSubmit = document.getElementById('btn-submit-ticket');
    if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.innerText = "Enviando cotización...";
    }

    var discordUser = (document.getElementById('discord-user').value || '').trim();
    var serviceType = document.getElementById('service-type').value;
    var paymentMethod = document.getElementById('payment-method').value;
    var budget = document.getElementById('budget-input').value || "No especificado";
    var details = (document.getElementById('project-details').value || '').trim();
    
    var ticketId = '#TK-' + Math.floor(1000 + Math.random() * 9000);

    localStorage.setItem('synthetix_user', discordUser);
    localStorage.setItem('synthetix_ticket_id', ticketId);

    var embedData = {
        embeds: [{
            title: "⚡ Nueva Cotización Web " + ticketId,
            color: 3887350,
            fields: [
                { name: "👤 Usuario Discord", value: discordUser || "Anónimo", inline: true },
                { name: "🛠️ Servicio", value: serviceType, inline: true },
                { name: "💳 Método de Pago", value: paymentMethod, inline: true },
                { name: "💰 Presupuesto", value: "$" + budget, inline: true },
                { name: "📝 Detalles del Proyecto", value: details || "Sin detalles" }
            ],
            footer: { text: "Synthetix Labs | Ticket System Web" },
            timestamp: new Date().toISOString()
        }]
    };

    if (DISCORD_WEBHOOK_URL && DISCORD_WEBHOOK_URL.startsWith("https://discord")) {
        try {
            await fetch(DISCORD_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(embedData)
            });
        } catch (error) {
            console.error("Error al enviar el Webhook:", error);
        }
    }

    var form = document.getElementById('ticket-form');
    if (form) form.reset();
    
    if (btnSubmit) {
        btnSubmit.disabled = false;
        btnSubmit.innerText = "Enviar Cotización Ahora";
    }

    closeModal('modal-ticket');
    var resultEl = document.getElementById('generated-ticket-id');
    if (resultEl) resultEl.innerText = ticketId;
    
    var successModal = document.getElementById('modal-success');
    if (successModal) successModal.classList.remove('hidden');

    checkActiveSession();
}

// ---------- INICIO DE SESIÓN POR TICKET ----------
function loginUser(event) {
    if (event) event.preventDefault();
    var loginVal = (document.getElementById('login-input').value || '').trim();
    
    if (loginVal) {
        var userTag = loginVal.startsWith('#') ? loginVal : (loginVal.startsWith('@') ? loginVal : '@' + loginVal);
        var fakeTicketId = loginVal.startsWith('#') ? loginVal : '#TK-' + Math.floor(1000 + Math.random() * 9000);

        localStorage.setItem('synthetix_user', userTag);
        localStorage.setItem('synthetix_ticket_id', fakeTicketId);

        closeModal('modal-login');
        checkActiveSession();
    }
}

function checkActiveSession() {
    var savedUser = localStorage.getItem('synthetix_user');
    var savedTicket = localStorage.getItem('synthetix_ticket_id');

    var sessionBar = document.getElementById('user-session-bar');
    if (savedUser && sessionBar) {
        var usernameEl = document.getElementById('logged-username');
        var ticketEl = document.getElementById('logged-ticket-id');
        if (usernameEl) usernameEl.innerText = savedUser;
        if (ticketEl) ticketEl.innerText = savedTicket || '#TK-0000';
        sessionBar.classList.remove('hidden');
    }
}

function logoutUser() {
    localStorage.removeItem('synthetix_user');
    localStorage.removeItem('synthetix_ticket_id');
    var sessionBar = document.getElementById('user-session-bar');
    if (sessionBar) sessionBar.classList.add('hidden');
}

// ---------- CALCULADORA Y FAQ ----------
function setupCalculadora() {
    var checks = document.querySelectorAll('.est-check');
    var totalPriceEl = document.getElementById('total-price');

    if (checks.length > 0 && totalPriceEl) {
        checks.forEach(function(check) {
            check.addEventListener('change', function() {
                var total = 0;
                checks.forEach(function(c) {
                    if (c.checked) total += parseFloat(c.value);
                });
                totalPriceEl.textContent = '$' + total.toFixed(2);
            });
        });
    }
}

function setupFAQ() {
    var faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach(function(item) {
        var questionBtn = item.querySelector(".faq-question");
        if (questionBtn) {
            questionBtn.addEventListener("click", function() {
                var isActive = item.classList.contains("active");
                faqItems.forEach(function(innerItem) { innerItem.classList.remove("active"); });
                if (!isActive) item.classList.add("active");
            });
        }
    });
}
