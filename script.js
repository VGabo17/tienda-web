// =========================================================================
// CONFIGURACIÓN DE WEBOOK DE DISCORD
// Pega aquí la URL del Webhook de tu canal privado de staff en Discord
// =========================================================================
const DISCORD_WEBHOOK_URL = ""; 

document.addEventListener("DOMContentLoaded", () => {
    checkActiveSession();
    setupCalculadora();
    setupFAQ();
});

// ---------- GESTIÓN DE MODALES ----------
function openTicketModal(defaultService = 'General') {
    const serviceSelect = document.getElementById('service-type');
    if (serviceSelect && defaultService !== 'General') {
        serviceSelect.value = defaultService;
    }
    
    // Autocompletar usuario si ya inició sesión
    const savedUser = localStorage.getItem('synthetix_user');
    if (savedUser) {
        document.getElementById('discord-user').value = savedUser;
    }

    document.getElementById('modal-ticket').classList.remove('hidden');
}

function openLoginModal() {
    document.getElementById('modal-login').classList.remove('hidden');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

// ---------- ENVÍO DE COTIZACIÓN (WEBHOOK DISCORD) ----------
async function submitTicket(event) {
    event.preventDefault();
    const btnSubmit = document.getElementById('btn-submit-ticket');
    btnSubmit.disabled = true;
    btnSubmit.innerText = "Enviando cotización...";

    const discordUser = document.getElementById('discord-user').value.trim();
    const serviceType = document.getElementById('service-type').value;
    const paymentMethod = document.getElementById('payment-method').value;
    const budget = document.getElementById('budget-input').value || "No especificado";
    const details = document.getElementById('project-details').value.trim();
    
    // Generar un ID de ticket único de 4 dígitos
    const ticketId = `#TK-${Math.floor(1000 + Math.random() * 9000)}`;

    // Guardar sesión del usuario en el navegador
    localStorage.setItem('synthetix_user', discordUser);
    localStorage.setItem('synthetix_ticket_id', ticketId);

    // Formatear mensaje para Discord Embed
    const embedData = {
        embeds: [{
            title: `⚡ Nueva Cotización Web ${ticketId}`,
            color: 62207, // Color Cian (#00f2fe)
            fields: [
                { name: "👤 Usuario Discord", value: discordUser, inline: true },
                { name: "🛠️ Servicio", value: serviceType, inline: true },
                { name: "💳 Método de Pago", value: paymentMethod, inline: true },
                { name: "💰 Presupuesto", value: `$${budget}`, inline: true },
                { name: "📝 Detalles del Proyecto", value: details }
            ],
            footer: { text: "Synthetix Labs | Ticket System Web" },
            timestamp: new Date().toISOString()
        }]
    };

    // Si configuraste la URL del Webhook, se envía a tu Discord
    if (DISCORD_WEBHOOK_URL && DISCORD_WEBHOOK_URL.startsWith("https://discord")) {
        try {
            await fetch(DISCORD_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(embedData)
            });
        } catch (error) {
            console.error("Error al enviar el Webhook a Discord:", error);
        }
    } else {
        console.log("Cotización enviada localmente (Modo simulación):", embedData);
    }

    // Resetear formulario y mostrar modal de éxito
    document.getElementById('ticket-form').reset();
    btnSubmit.disabled = false;
    btnSubmit.innerText = "Enviar Cotización Ahora";

    closeModal('modal-ticket');
    document.getElementById('generated-ticket-id').innerText = ticketId;
    document.getElementById('modal-success').classList.remove('hidden');

    checkActiveSession();
}

// ---------- SISTEMA DE INICIO DE SESIÓN ----------
function loginUser(event) {
    event.preventDefault();
    const loginVal = document.getElementById('login-input').value.trim();
    
    if (loginVal) {
        const userTag = loginVal.startsWith('#') ? loginVal : (loginVal.startsWith('@') ? loginVal : `@${loginVal}`);
        const fakeTicketId = loginVal.startsWith('#') ? loginVal : `#TK-${Math.floor(1000 + Math.random() * 9000)}`;

        localStorage.setItem('synthetix_user', userTag);
        localStorage.setItem('synthetix_ticket_id', fakeTicketId);

        closeModal('modal-login');
        checkActiveSession();
    }
}

function checkActiveSession() {
    const savedUser = localStorage.getItem('synthetix_user');
    const savedTicket = localStorage.getItem('synthetix_ticket_id');

    const sessionBar = document.getElementById('user-session-bar');
    if (savedUser && sessionBar) {
        document.getElementById('logged-username').innerText = savedUser;
        document.getElementById('logged-ticket-id').innerText = savedTicket || '#TK-0000';
        sessionBar.classList.remove('hidden');
    }
}

function logoutUser() {
    localStorage.removeItem('synthetix_user');
    localStorage.removeItem('synthetix_ticket_id');
    document.getElementById('user-session-bar').classList.add('hidden');
}

// ---------- CALCULADORA Y FAQ ----------
function setupCalculadora() {
    const checks = document.querySelectorAll('.est-check');
    const totalPriceEl = document.getElementById('total-price');

    if (checks.length > 0 && totalPriceEl) {
        checks.forEach(check => {
            check.addEventListener('change', () => {
                let total = 0;
                checks.forEach(c => {
                    if (c.checked) total += parseFloat(c.value);
                });
                totalPriceEl.textContent = `$${total.toFixed(2)}`;
            });
        });
    }
}

function setupFAQ() {
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach(item => {
        const questionBtn = item.querySelector(".faq-question");
        if (questionBtn) {
            questionBtn.addEventListener("click", () => {
                const isActive = item.classList.contains("active");
                faqItems.forEach(innerItem => innerItem.classList.remove("active"));
                if (!isActive) item.classList.add("active");
            });
        }
    });
}
