/**
 * Controla la apertura y cierre del menú lateral (Drawer) de forma fluida
 * @param {Event} [event] - Evento opcional para evitar cierre si se hace clic dentro del contenido
 */
function toggleSynthDrawer(event) {
    if (event) {
        // Si el clic viene del overlay oscuro, evitamos propagaciones no deseadas
        if (event.target !== document.getElementById('synthDrawer')) return;
    }
    
    const drawer = document.getElementById('synthDrawer');
    if (drawer) {
        drawer.classList.toggle('hidden');
        
        // Bloquea el scroll de la página cuando el menú está abierto en móviles
        if (!drawer.classList.contains('hidden')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
}

/**
 * Valida la seguridad antispam (Honeypot) y procesa el envío del formulario
 * @param {SubmitEvent} event 
 */
function handleTicketSubmit(event) {
    event.preventDefault();

    // 1. Verificación de seguridad Honeypot contra Bots automatizados
    const botTrap = document.getElementById('website_url_verification').value;
    if (botTrap && botTrap.trim() !== "") {
        console.warn("Actividad automatizada detectada por Honeypot. Solicitud bloqueada silenciosamente.");
        // Simulamos éxito para engañar al bot sin ejecutar ninguna acción en servidor
        alert("¡Solicitud enviada con éxito!");
        return;
    }

    // 2. Extracción y saneamiento de datos del usuario real
    const discordTag = document.getElementById('discordTag').value.trim();
    const interestArea = document.getElementById('interestArea').value;
    const projectSpecs = document.getElementById('projectSpecs').value.trim();

    // Validaciones básicas de contenido mínimo
    if (discordTag.length < 3 || projectSpecs.length < 5) {
        alert("Por favor, introduce un usuario de Discord válido y especifica un poco más los requerimientos.");
        return;
    }

    // 3. Procesamiento legítimo (aquí puedes conectar tu API o Webhook de Discord)
    console.log("Ticket válido generado por:", {
        creator: "Aledevv",
        discord: discordTag,
        area: interestArea,
        specs: projectSpecs,
        timestamp: new Date().toISOString()
    });

    alert("¡Requerimiento enviado correctamente a Synthetix Labs! Nos pondremos en contacto vía Discord.");
    
    // Limpiar formulario tras el envío exitoso
    document.getElementById('ticketForm').reset();
}
