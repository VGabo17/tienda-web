const SUPABASE_URL = 'https://oekzjffzxhluhhpptngy.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Oyy8-ryDioF-OEV8LA4Gyg_XJmhl4EH';

let supabaseClient = null;

if (window.supabase && typeof window.supabase.createClient === 'function') {
  supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );
}

const productos = [
  {
    id: 1,
    categoria: 'DISCORD',
    nombre: 'Nitro Boost',
    descripcion: 'Nitro Boost de Discord por un mes.',
    precio: 5
  },
  {
    id: 2,
    categoria: 'DISCORD',
    nombre: 'Nitro Basic',
    descripcion: 'Nitro Basic de Discord por un mes.',
    precio: 1.80
  },
  {
    id: 3,
    categoria: 'STREAMING',
    nombre: 'Spotify Premium',
    descripcion: 'Cuenta premium de Spotify.',
    precio: 2.50
  },
  {
    id: 4,
    categoria: 'MINECRAFT',
    nombre: 'Minecraft Premium',
    descripcion: 'Cuenta premium de Minecraft.',
    precio: 4
  },
  {
    id: 5,
    categoria: 'MINECRAFT',
    nombre: 'Minecraft Full Access',
    descripcion: 'Cuenta de Minecraft con acceso completo.',
    precio: 6.50
  },
  {
    id: 6,
    categoria: 'SOCIAL',
    nombre: 'Boost Social Media',
    descripcion: 'Servicio de crecimiento para redes sociales.',
    precio: 3
  }
];

let carrito = [];
let sesionActual = null;
let ticketActual = null;

document.addEventListener('DOMContentLoaded', function () {
  prepararMenu();
  mostrarProductos();
  actualizarCarrito();

  if (supabaseClient) {
    cargarSesion();
  } else {
    mostrarFormularioSinConexion();
  }
});

function prepararMenu() {
  const drawer = document.getElementById('drawer');
  const overlay = document.getElementById('drawerOverlay');
  const abrir = document.getElementById('openDrawer');
  const cerrar = document.getElementById('closeDrawer');

  if (!drawer || !overlay || !abrir || !cerrar) return;

  abrir.addEventListener('click', function () {
    drawer.classList.add('open');
    overlay.classList.add('open');
  });

  cerrar.addEventListener('click', cerrarMenu);
  overlay.addEventListener('click', cerrarMenu);

  const inicio = document.getElementById('inicioLink');
  const catalogo = document.getElementById('catalogoLink');

  if (inicio) inicio.addEventListener('click', cerrarMenu);
  if (catalogo) catalogo.addEventListener('click', cerrarMenu);
}

function cerrarMenu() {
  const drawer = document.getElementById('drawer');
  const overlay = document.getElementById('drawerOverlay');

  if (drawer) drawer.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
}

function mostrarProductos() {
  const lista = document.getElementById('productList');

  if (!lista) return;

  lista.innerHTML = productos.map(function (producto) {
    return `
      <article class="product">
        <div>
          <span class="product-category">${producto.categoria}</span>
          <h3>${producto.nombre}</h3>
          <p>${producto.descripcion}</p>
        </div>

        <div class="product-bottom">
          <span class="price">$${producto.precio.toFixed(2)}</span>

          <button
            class="btn btn-primary"
            onclick="agregarProducto(${producto.id})">
            Comprar
          </button>
        </div>
      </article>
    `;
  }).join('');
}

function agregarProducto(id) {
  const producto = productos.find(function (item) {
    return item.id === id;
  });

  if (!producto) return;

  const existente = carrito.find(function (item) {
    return item.id === id;
  });

  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({
      id: producto.id,
      categoria: producto.categoria,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      cantidad: 1
    });
  }

  actualizarCarrito();
}

function eliminarProducto(id) {
  carrito = carrito.filter(function (item) {
    return item.id !== id;
  });

  actualizarCarrito();
}

function calcularTotal() {
  return carrito.reduce(function (total, item) {
    return total + item.precio * item.cantidad;
  }, 0);
}

function actualizarCarrito() {
  const contador = document.getElementById('cartCount');
  const lista = document.getElementById('cartList');
  const total = document.getElementById('cartTotal');

  if (!contador || !lista || !total) return;

  const cantidad = carrito.reduce(function (totalItems, item) {
    return totalItems + item.cantidad;
  }, 0);

  contador.textContent = cantidad;
  total.textContent = '$' + calcularTotal().toFixed(2);

  if (carrito.length === 0) {
    lista.innerHTML = `
      <div class="empty">
        El carrito está vacío.
      </div>
    `;
    return;
  }

  lista.innerHTML = carrito.map(function (item) {
    return `
      <div class="cart-item">
        <div>
          <strong>${item.cantidad}x ${item.nombre}</strong>
          <div style="color:#67e8f9;margin-top:5px;">
            $${(item.precio * item.cantidad).toFixed(2)}
          </div>
        </div>

        <button
          class="btn btn-danger"
          onclick="eliminarProducto(${item.id})">
          Eliminar
        </button>
      </div>
    `;
  }).join('');
}

function abrirCarrito() {
  const modal = document.getElementById('cartModal');
  if (modal) modal.classList.add('open');
}

function cerrarCarrito() {
  const modal = document.getElementById('cartModal');
  if (modal) modal.classList.remove('open');
}

function abrirModalTickets() {
  const modal = document.getElementById('ticketsModal');
  if (modal) modal.classList.add('open');
}

function cerrarTickets() {
  const modal = document.getElementById('ticketsModal');
  if (modal) modal.classList.remove('open');
}

function abrirModalChat() {
  const modal = document.getElementById('chatModal');
  if (modal) modal.classList.add('open');
}

function cerrarChat() {
  const modal = document.getElementById('chatModal');
  if (modal) modal.classList.remove('open');

  ticketActual = null;
}

async function cargarSesion() {
  const respuesta = await supabaseClient.auth.getSession();

  if (respuesta.error) {
    console.error(respuesta.error);
    sesionActual = null;
  } else {
    sesionActual = respuesta.data.session;
  }

  await actualizarInterfazUsuario();
}

function mostrarFormularioSinConexion() {
  const authBox = document.getElementById('authBox');

  if (!authBox) return;

  authBox.innerHTML = `
    <h2>MRSTORE</h2>
    <p style="color:#fca5a5;">
      La tienda está cargada, pero Supabase no está disponible.
    </p>
    <p style="color:#94a3b8;">
      Revisa tu conexión a Internet y recarga la página.
    </p>
  `;
}

async function actualizarInterfazUsuario() {
  const authBox = document.getElementById('authBox');
  const adminLink = document.getElementById('adminLink');
  const logoutButton = document.getElementById('logoutMenuButton');

  if (!authBox) return;

  if (!sesionActual) {
    if (adminLink) adminLink.style.display = 'none';
    if (logoutButton) logoutButton.style.display = 'none';

    authBox.innerHTML = `
      <h2>Iniciar sesión</h2>

      <input
        id="emailInput"
        class="auth-input"
        type="email"
        placeholder="Correo electrónico"
      >

      <input
        id="passwordInput"
        class="auth-input"
        type="password"
        placeholder="Contraseña"
      >

      <div class="button-row">
        <button class="btn btn-primary" onclick="iniciarSesion()">
          Iniciar sesión
        </button>

        <button class="btn btn-secondary" onclick="registrarse()">
          Registrarse
        </button>
      </div>
    `;

    return;
  }

  if (logoutButton) logoutButton.style.display = 'block';

  authBox.innerHTML = `
    <div style="
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:15px;
      flex-wrap:wrap;
    ">
      <div>
        <strong>Sesión iniciada</strong>
        <div style="color:#94a3b8;margin-top:5px;">
          ${sesionActual.user.email}
        </div>
      </div>

      <button class="btn btn-danger" onclick="cerrarSesion()">
        Cerrar sesión
      </button>
    </div>
  `;

  if (!adminLink) return;

  const respuesta = await supabaseClient
    .from('profiles')
    .select('role')
    .eq('id', sesionActual.user.id)
    .maybeSingle();

  if (
    !respuesta.error &&
    respuesta.data &&
    respuesta.data.role === 'admin'
  ) {
    adminLink.style.display = 'block';
  } else {
    adminLink.style.display = 'none';
  }
}

async function iniciarSesion() {
  const emailInput = document.getElementById('emailInput');
  const passwordInput = document.getElementById('passwordInput');

  if (!emailInput || !passwordInput) return;

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    alert('Completa el correo y la contraseña.');
    return;
  }

  const respuesta = await supabaseClient.auth.signInWithPassword({
    email: email,
    password: password
  });

  if (respuesta.error) {
    alert('No se pudo iniciar sesión: ' + respuesta.error.message);
    return;
  }

  sesionActual = respuesta.data.session;
  await actualizarInterfazUsuario();
}

async function registrarse() {
  const emailInput = document.getElementById('emailInput');
  const passwordInput = document.getElementById('passwordInput');

  if (!emailInput || !passwordInput) return;

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    alert('Completa el correo y la contraseña.');
    return;
  }

  if (password.length < 6) {
    alert('La contraseña debe tener al menos 6 caracteres.');
    return;
  }

  const respuesta = await supabaseClient.auth.signUp({
    email: email,
    password: password
  });

  if (respuesta.error) {
    alert('No se pudo registrar la cuenta: ' + respuesta.error.message);
    return;
  }

  if (!respuesta.data.session) {
    alert('Cuenta creada. Revisa tu correo para confirmarla.');
  } else {
    sesionActual = respuesta.data.session;
    alert('Cuenta creada correctamente.');
    await actualizarInterfazUsuario();
  }
}

async function cerrarSesion() {
  await supabaseClient.auth.signOut();

  sesionActual = null;
  carrito = [];

  cerrarMenu();
  actualizarCarrito();
  await actualizarInterfazUsuario();
}

async function crearTicket() {
  if (!sesionActual) {
    alert('Debes iniciar sesión antes de crear un ticket.');
    return;
  }

  if (carrito.length === 0) {
    alert('El carrito está vacío.');
    return;
  }

  const codigo = 'MR-' + Math.floor(100000 + Math.random() * 900000);

  const detalles = carrito.map(function (item) {
    return item.cantidad + 'x ' + item.nombre;
  }).join(' | ');

  const total = calcularTotal();

  const respuesta = await supabaseClient
    .from('tickets')
    .insert({
      user_id: sesionActual.user.id,
      codigo: codigo,
      cliente: sesionActual.user.email,
      detalles: detalles,
      total: total,
      estado: 'Pendiente'
    });

  if (respuesta.error) {
    alert('No se pudo crear el ticket: ' + respuesta.error.message);
    return;
  }

  carrito = [];
  actualizarCarrito();
  cerrarCarrito();

  alert('Ticket ' + codigo + ' creado correctamente.');

  await cargarTickets();
  abrirModalTickets();
}

async function abrirTickets() {
  if (!sesionActual) {
    alert('Debes iniciar sesión para ver tus tickets.');
    return;
  }

  cerrarMenu();
  await cargarTickets();
  abrirModalTickets();
}

async function cargarTickets() {
  const lista = document.getElementById('ticketList');

  if (!lista) return;

  const respuesta = await supabaseClient
    .from('tickets')
    .select('*')
    .eq('user_id', sesionActual.user.id)
    .order('created_at', { ascending: false });

  if (respuesta.error) {
    lista.innerHTML = `
      <div class="empty">
        Error al cargar tickets:<br>
        ${respuesta.error.message}
      </div>
    `;
    return;
  }

  if (!respuesta.data || respuesta.data.length === 0) {
    lista.innerHTML = `
      <div class="empty">
        Todavía no tienes tickets.
      </div>
    `;
    return;
  }

  lista.innerHTML = respuesta.data.map(function (ticket) {
    return `
      <article class="ticket">
        <div class="ticket-top">
          <strong>${ticket.codigo}</strong>
          <span class="status">${ticket.estado}</span>
        </div>

        <p style="color:#cbd5e1;">
          ${ticket.detalles}
        </p>

        <div class="ticket-bottom">
          <strong>$${Number(ticket.total).toFixed(2)}</strong>

          <button
            class="btn btn-primary"
            onclick="abrirChat('${ticket.id}', '${ticket.codigo}')">
            Abrir chat
          </button>
        </div>
      </article>
    `;
  }).join('');
}

async function abrirChat(ticketId, codigo) {
  ticketActual = ticketId;

  const titulo = document.getElementById('chatTitle');

  if (titulo) {
    titulo.textContent = 'Chat del ticket ' + codigo;
  }

  cerrarTickets();
  abrirModalChat();
  await cargarMensajes();
}

async function cargarMensajes() {
  const lista = document.getElementById('messageList');

  if (!lista || !ticketActual) return;

  const respuesta = await supabaseClient
    .from('mensajes')
    .select('*')
    .eq('ticket_id', ticketActual)
    .order('created_at', { ascending: true });

  if (respuesta.error) {
    lista.innerHTML = `
      <div class="empty">
        No se pudieron cargar los mensajes.
      </div>
    `;
    return;
  }

  if (!respuesta.data || respuesta.data.length === 0) {
    lista.innerHTML = `
      <div class="empty">
        Todavía no hay mensajes.
      </div>
    `;
    return;
  }

  lista.innerHTML = respuesta.data.map(function (mensaje) {
    const esMio = mensaje.user_id === sesionActual.user.id;

    return `
      <div class="message ${esMio ? 'mine' : 'other'}">
        <small>${esMio ? 'Tú' : 'Soporte'}</small>
        <div>${mensaje.contenido || ''}</div>
      </div>
    `;
  }).join('');

  lista.scrollTop = lista.scrollHeight;
}

async function enviarMensaje() {
  if (!ticketActual || !sesionActual) return;

  const input = document.getElementById('messageInput');

  if (!input) return;

  const texto = input.value.trim();

  if (!texto) {
    alert('Escribe un mensaje.');
    return;
  }

  const respuesta = await supabaseClient
    .from('mensajes')
    .insert({
      ticket_id: ticketActual,
      user_id: sesionActual.user.id,
      contenido: texto
    });

  if (respuesta.error) {
    alert('No se pudo enviar el mensaje: ' + respuesta.error.message);
    return;
  }

  input.value = '';
  await cargarMensajes();
}

window.addEventListener('click', function (event) {
  if (event.target.classList.contains('modal')) {
    event.target.classList.remove('open');
  }
});

window.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    document.querySelectorAll('.modal').forEach(function (modal) {
      modal.classList.remove('open');
    });

    cerrarMenu();
  }
});
