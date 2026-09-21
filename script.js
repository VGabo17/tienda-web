// ================= CONFIGURACIÓN SUPABASE =================
const SUPABASE_URL = 'https://oekzjffzxhluhhpptngy.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Oyy8-ryDioF-OEV8LA4Gyg_XJmhl4EH';

const { createClient } = supabase;
const _supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let usuarioActual = null;

// ================= ESTADO DE LA TIENDA =================
let carrito = [];
let monedaActual = 'USD';
let tasaCambio = 1;
let simboloMoneda = '$';
let montoTotalUsd = 0;

// Cambiar de vista (Tienda <-> Carrito)
function cambiarMenu(vista) {
    const viewTienda = document.getElementById('view-tienda');
    const viewCarrito = document.getElementById('view-carrito');

    if (vista === 'tienda') {
        viewTienda.classList.remove('hidden');
        viewCarrito.classList.add('hidden');
    } else if (vista === 'carrito') {
        viewTienda.classList.add('hidden');
        viewCarrito.classList.remove('hidden');
        renderizarCarrito();
        verificarSesionCliente();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Agregar producto al carrito
function agregarAlCarrito(nombre, precioUsd) {
    carrito.push({ nombre, precioUsd });
    actualizarContadorCarrito();
    alert(`¡"${nombre}" se agregó al carrito!`);
}

// Actualizar indicador flotante del carrito
function actualizarContadorCarrito() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.textContent = carrito.length;
    }
}

// Renderizar contenido del carrito
function renderizarCarrito() {
    const listaCarrito = document.getElementById('listaCarrito');
    const totalCarrito = document.getElementById('totalCarrito');
    
    if (!listaCarrito || !totalCarrito) return;

    if (carrito.length === 0) {
        listaCarrito.innerHTML = `<p class="text-xs text-gray-400 text-center py-4">Tu carrito está vacío.</p>`;
        totalCarrito.textContent = `${simboloMoneda}0.00`;
        montoTotalUsd = 0;
        return;
    }

    let html = '';
    let totalUsdCalc = 0;

    carrito.forEach((item, index) => {
        const precioConvertido = (item.precioUsd * tasaCambio).toFixed(2);
        totalUsdCalc += item.precioUsd;
        
        html += `
            <div class="flex items-center justify-between bg-[#060913] p-3 rounded-xl border border-purple-500/10">
                <div>
                    <h4 class="text-xs font-black text-white">${item.nombre}</h4>
                    <p class="text-[11px] text-cyan-400 font-bold">${simboloMoneda}${precioConvertido}</p>
                </div>
                <button onclick="eliminarDelCarrito(${index})" class="text-red-400 hover:text-red-300 p-1 text-xs cursor-pointer">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
    });

    montoTotalUsd = totalUsdCalc;
    const totalFinalConvertido = (totalUsdCalc * tasaCambio).toFixed(2);
    listaCarrito.innerHTML = html;
    totalCarrito.textContent = `${simboloMoneda}${totalFinalConvertido}`;
}

// Eliminar un ítem del carrito
function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    actualizarContadorCarrito();
    renderizarCarrito();
}

// Selector de Moneda
function toggleMonedaMenu(event) {
    event.stopPropagation();
    const dropdown = document.getElementById('dropdownMoneda');
    if (dropdown) dropdown.classList.toggle('hidden');
}

window.addEventListener('click', () => {
    const dropdown = document.getElementById('dropdownMoneda');
    if (dropdown) dropdown.classList.add('hidden');
});

function setMoneda(flag, curr, tasa, simbolo) {
    monedaActual = curr;
    tasaCambio = tasa;
    simboloMoneda = simbolo;

    document.getElementById('flagLbl').textContent = flag;
    document.getElementById('currLbl').textContent = curr;

    document.querySelectorAll('.prod-card').forEach(card => {
        const spanPrecio = card.querySelector('.precio');
        const spanSimbolo = card.querySelector('.simbolo');
        if (spanPrecio && spanSimbolo) {
            const usdBase = parseFloat(spanPrecio.getAttribute('data-usd'));
            spanPrecio.textContent = (usdBase * tasa).toFixed(2);
            spanSimbolo.textContent = simbolo;
        }
    });

    renderizarCarrito();
}

// Filtrar productos por categoría
function filtrarProductos(cat) {
    const cards = document.querySelectorAll('.prod-card');
    
    ['todos', 'discord', 'streaming', 'minecraft'].forEach(c => {
        const btn = document.getElementById(`btn-cat-${c}`);
        if (btn) {
            if (c === cat) {
                btn.className = "px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-[11px] shrink-0 shadow-md";
            } else {
                btn.className = "px-3.5 py-2 rounded-xl bg-[#0a0f1d] border border-purple-500/20 text-gray-300 font-bold text-[11px] shrink-0 hover:border-cyan-400 transition";
            }
        }
    });

    cards.forEach(card => {
        if (cat === 'todos' || card.getAttribute('data-cat') === cat) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// ================= AUTH DISCORD & SUPABASE TICKETS =================

// Verificar sesión del cliente al abrir el carrito
async function verificarSesionCliente() {
    const { data: { session } } = await _supabase.auth.getSession();
    const authSection = document.getElementById('authRequiredSection');
    const checkoutSection = document.getElementById('checkoutReadySection');
    const userInfoText = document.getElementById('userInfoText');

    if (session) {
        usuarioActual = session.user;
        const discordName = usuarioActual.user_metadata?.full_name || usuarioActual.user_metadata?.name || usuarioActual.email?.split('@')[0] || 'Usuario Discord';
        
        if (authSection) authSection.style.display = 'none';
        if (checkoutSection) checkoutSection.style.display = 'block';
        if (userInfoText) userInfoText.innerHTML = `@${discordName}`;
    } else {
        usuarioActual = null;
        if (authSection) authSection.style.display = 'block';
        if (checkoutSection) checkoutSection.style.display = 'none';
    }
}

// Iniciar sesión con Discord
async function loginDiscordStore() {
    const { error } = await _supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: {
            redirectTo: window.location.href
        }
    });
    if (error) {
        alert('Error al conectar con Discord: ' + error.message);
    }
}

// Cerrar sesión
async function logoutStore() {
    await _supabase.auth.signOut();
    window.location.reload();
}

// Generar el ticket en la base de datos con el usuario real autenticado
async function procesarPagoSupabase() {
    if (!usuarioActual) {
        alert('Debes iniciar sesión primero.');
        return;
    }

    if (carrito.length === 0) {
        alert('Tu carrito está vacío.');
        return;
    }

    const discordName = usuarioActual.user_metadata?.full_name || usuarioActual.user_metadata?.name || usuarioActual.email?.split('@')[0] || 'Usuario Discord';
    const codigoTicket = 'MR-' + Math.floor(100000 + Math.random() * 900000);
    
    const detallesCompra = carrito.map(i => i.nombre).join(', ');
    const totalCompra = montoTotalUsd;

    const { error } = await _supabase
        .from('tickets')
        .insert([
            {
                user_id: usuarioActual.id, // <-- IMPORTANTE
                codigo: codigoTicket,
                cliente: `@${discordName}`,
                detalles: detallesCompra,
                total: totalCompra,
                estado: 'Pendiente'
            }
        ]);

    if (error) {
        console.error('Error al guardar ticket:', error);
        alert('Hubo un error al registrar el ticket en la base de datos.');
    } else {
        alert(`¡Ticket ${codigoTicket} creado con éxito!`);
        carrito = [];
        actualizarContadorCarrito();
        cambiarMenu('tienda');
    }
}