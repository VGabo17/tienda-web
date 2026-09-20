/**
 * Abre y cierra el menú lateral deslizante (Drawer)
 */
function toggleSynthDrawer(event) {
    if (event) {
        if (event.target !== document.getElementById('synthDrawer')) return;
    }
    
    const drawer = document.getElementById('synthDrawer');
    if (drawer) {
        drawer.classList.toggle('hidden');
        if (!drawer.classList.contains('hidden')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
}

/**
 * Valida el sistema de tickets y el sistema antispam (Honeypot)
 */
function handleTicketSubmit(event) {
    event.preventDefault();

    // Verificación oculta antispam (Honeypot)
    const botTrap = document.getElementById('website_url_verification').value;
    if (botTrap && botTrap.trim() !== "") {
        alert("¡Solicitud enviada con éxito!");
        return;
    }

    const discordTag = document.getElementById('discordTag').value.trim();
    const interestArea = document.getElementById('interestArea').value;
    const projectSpecs = document.getElementById('projectSpecs').value.trim();

    if (discordTag.length < 3 || projectSpecs.length < 5) {
        alert("Por favor, completa los datos correctamente.");
        return;
    }

    console.log("Requerimiento enviado por Aledevv:", {
        discord: discordTag,
        area: interestArea,
        specs: projectSpecs
    });

    alert("¡Requerimiento enviado correctamente a Synthetix Labs!");
    document.getElementById('ticketForm').reset();
}
