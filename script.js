const SUPABASE_URL = 'https://oekzjffzxhluhhpptngy.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Oyy8-ryDioF-OEV8LA4Gyg_XJmhl4EH';

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

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
    precio: 1.8
  },
  {
    id: 3,
    categoria: 'STREAMING',
    nombre: 'Spotify Premium',
    descripcion: 'Cuenta premium de Spotify.',
    precio: 2.5
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
    precio: 6.5
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

document.addEventListener('DOMContentLoaded', iniciarAplicacion);

async function iniciarAplicacion() {
  prepararMenu();
  mostrarProductos();
  actualizarCarrito();

  const { data, error } = await supabaseClient.auth.getSession();

  if (error) {
    console.error('Error de sesión:', error);
    sesionActual = null;
  } else {
    sesionActual = data.session;
  }

  await actualizarInterfazUsuario();
}

function prepararMenu() {
  const drawer = document.getElementById('drawer');
  const overlay = document.getElementById('drawerOverlay');
  const openButton = document.getElementById('openDrawer');
  const closeButton = document.getElementById('closeDrawer');

  openButton.addEventListener('click', () => {
    drawer.classList.add('open');
    overlay.classList.add('open');
  });

  closeButton.addEventListener('click', cerrarMenu);
  overlay.addEventListener('click', cerrarMenu);

  document.getElementById('inicioLink').addEventListener('click', cerrarMenu);
  document.getElementById('catalogoLink').addEventListener('click', cerrarMenu);
}

function cerrarMenu() {
  document.getElementById('drawer').classList.remove('open');
  document.getElementById('drawerOverlay').classList.remove('open');
}

function mostrarProductos() {
  const productList = document.getElementById('productList');

  productList.innerHTML = productos.map(producto => `
    <article class="product">
      <div>
        <span class="product-category">${producto.categoria}</span>
        <h3>${producto.nombre}</h3>
        <p>${producto.descripcion}</p>
      </div>

      <div class="product-bottom">
        <span class="price">$${producto.precio.toFixed(2)}</span>
        <button class="btn btn-primary" onclick="agregarProducto(${producto.id})">
          Comprar
        </button>
      </div>
    </article>
  `).join('');
}

function agregarProducto(id) {
  const producto = productos.find(item => item.id === id);

  if (!producto) return;

  const productoCarrito = carrito.find(item => item.id === id);

  if (productoCarrito) {
    productoCarrito.cantidad++;
  } else {
    carrito.push({
      ...producto,
      cantidad: 1
    });
  }

  actualizarCarrito();
}

function eliminarProducto(id) {
  carrito = carrito.filter(item => item.id !== id);
  actualizarCarrito();
}

function calcularTotal() {
  return carrito.reduce(
    (total, item) => total + item.precio * item.cantidad,
    0
  );
}

function actualizarCarrito() {
  const cartCount = document.getElementById('cartCount');
  const cartList = document.getElementById('cartList');
  const cartTotal = document.getElementById('cartTotal');

  const cantidad = carrito.reduce(
    (total, item) => total + item.cantidad,
    0
  );

  cartCount.textContent = cantidad;
  cartTotal.textContent = `$${calcularTotal().toFixed(2)}`;

  if (carrito.length === 0) {
    cartList.innerHTML = '<div class="empty">El carrito está vacío.</div>';
    return;
  }

  cartList.innerHTML = carrito.map(item => `
    <div class="cart-item">
      <div>
        <strong>${item.cantidad}x ${item.nombre}</strong>
        <div style="color:#67e8f9;margin-top:5px;">
          $${(item.precio * item.cantidad).toFixed(2)}
        </div>
      </div>

      <button class="btn btn-danger" onclick="eliminarProducto(${item.id})">
        Eliminar
      </button>
    </div>
  `).join('');
}

function abrirCarrito() {
  document.getElementById('cartModal').classList.add('open');
}

function cerrarCarrito() {
  document.getElementById('cartModal').classList.remove('open');
}

function abrirModalTickets() {
  document.getElementById('ticketsModal').classList.add('open');
}

function cerrarTickets() {
  document.getElementById('ticketsModal').classList.remove('open');
}

function abrirModalChat() {
  document.getElementById('chatModal').classList.add('open');
}

function cerrarChat() {
  document.getElementById('chatModal').classList.remove('open');
  ticketActual = null;
}

async function actualizarInterfazUsuario() {
  const authBox = document.getElementById('authBox');
  const adminLink = document.getElementById('adminLink');
  const logoutButton = document.getElementById('logoutMenuButton');

  if (!sesionActual) {
    adminLink.style.display = 'none';
    logoutButton.style.display = 'none';

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

  logoutButton.style.display = 'block';

  authBox.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;gap:15px;flex-wrap:wrap;">
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

  const { data: perfil, error } = await supabaseClient
    .from('profiles')
    .select('role')
    .eq('id', sesionActual.user.id)
    .maybeSingle();

  if (!error && perfil && perfil.role === 'admin') {
    adminLink.style.display = 'block';
  } else {
    adminLink.style.display = 'none';
  }
}

async function iniciarSesion() {
  const email = document.getElementById('emailInput').value.trim();
  const password = document.getElementById('passwordInput').value;

  if (!email || !password) {
    alert('Completa el correo y la contraseña.');
    return;
  }

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    console.error(error);
    alert('No se pudo iniciar sesión: ' + error.message);
    return;
  }

  sesionActual = data.session;
  await actualizarInterfazUsuario();
}

async function registrarse() {
  const email = document.getElementById('emailInput').value.trim();
  const password = document.getElementById('passwordInput').value;

  if (!email || !password) {
    alert('Completa el correo y la contraseña.');
    return;
  }

  if (password.length < 6) {
    alert('La contraseña debe tener al menos 6 caracteres.');
    return;
  }

  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password
  });

  if (error) {
    console.error(error);
    alert('No se pudo registrar la cuenta: ' + error.message);
    return;
  }

  if (!data.session) {
    alert('Cuenta creada. Revisa tu correo para confirmar la cuenta.');
  } else {
    sesionActual = data.session;
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

  const detalles = carrito
    .map(item => `${item.cantidad}x ${item.nombre}`)
    .join(' | ');

  const total = calcularTotal();

  const { error } = await supabaseClient
    .from('tickets')
    .insert({
      user_id: sesionActual.user.id,
      codigo,
      cliente: sesionActual.user.email,
      detalles,
      total,
      estado: 'Pendiente'
    });

  if (error) {
    console.error(error);
    alert('No se pudo crear el ticket: ' + error.message);
    return;
  }

  carrito = [];
  actualizarCarrito();
  cerrarCarrito();

  alert(`Ticket ${codigo} creado correctamente.`);
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
  const ticketList = document.getElementById('ticketList');

  const { data, error } = await supabaseClient
    .from('tickets')
    .select('*')
    .eq('user_id', sesionActual.user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    ticketList.innerHTML = `
      <div class="empty">
        No se pudieron cargar los tickets:<br>
        ${error.message}
      </div>
    `;
    return;
  }

  if (!data || data.length === 0) {
    ticketList.innerHTML = `
      <div class="empty">
        Todavía no tienes tickets.
      </div>
    `;
    return;
  }

  ticketList.innerHTML = data.map(ticket => `
    <article class="ticket">
      <div class="ticket-top">
        <strong>${ticket.codigo}</strong>
        <span class="status">${ticket.estado}</span>
      </div>

      <p style="color:#cbd5e1;">${ticket.detalles}</p>

      <div class="ticket-bottom">
        <strong>$${Number(ticket.total).toFixed(2)}</strong>

        <button
          class="btn btn-primary"
          onclick="abrirChat('${ticket.id}', '${ticket.codigo}')"
        >
          Abrir chat
        </button>
      </div>
    </article>
  `).join('');
}

async function abrirChat(ticketId, codigo) {
  ticketActual = ticketId;

  document.getElementById('chatTitle').textContent =
    `Chat del ticket ${codigo}`;

  cerrarTickets();
  abrirModalChat();
  await cargarMensajes();
}

async function cargarMensajes() {
  const messageList = document.getElementById('messageList');

  const { data, error } = await supabaseClient
    .from('mensajes')
    .select('*')
    .eq('ticket_id', ticketActual)
    .order('created_at', { ascending: true });

  if (error) {
    console.error(error);
    messageList.innerHTML = `
      <div class="empty">
        No se pudieron cargar los mensajes.
      </div>
    `;
    return;
  }

  if (!data || data.length === 0) {
    messageList.innerHTML = `
      <div class="empty">
        Todavía no hay mensajes.
      </div>
    `;
    return;
  }

  messageList.innerHTML = data.map(mensaje => {
    const esMio = mensaje.user_id === sesionActual.user.id;

    let imagen = '';

    if (mensaje.archivo_url) {
      const { data: urlData } = supabaseClient.storage
        .from('ticket-attachments')
        .getPublicUrl(mensaje.archivo_url);

      imagen = `
        <img
          src="${urlData.publicUrl}"
          alt="Imagen adjunta"
        >
      `;
    }

    return `
      <div class="message ${esMio ? 'mine' : 'other'}">
        <small>${esMio ? 'Tú' : 'Soporte'}</small>
        <div>${mensaje.contenido || ''}</div>
        ${imagen}
      </div>
    `;
  }).join('');

  messageList.scrollTop = messageList.scrollHeight;
}

async function enviarMensaje() {
  if (!ticketActual || !sesionActual) return;

  const input = document.getElementById('messageInput');
  const imageInput = document.getElementById('imageInput');

  const texto = input.value.trim();
  const imagen = imageInput.files[0];

  if (!texto && !imagen) {
    alert('Escribe un mensaje o selecciona una imagen.');
    return;
  }

  let archivoUrl = null;

  if (imagen) {
    if (!imagen.type.startsWith('image/')) {
      alert('Solo puedes enviar imágenes.');
      return;
    }

    if (imagen.size > 5 * 1024 * 1024) {
      alert('La imagen no puede superar los 5 MB.');
      return;
    }

    const extension = imagen.name.split('.').pop();
    const ruta = `${sesionActual.user.id}/${ticketActual}/${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabaseClient.storage
      .from('ticket-attachments')
      .upload(ruta, imagen, {
        contentType: imagen.type,
        upsert: false
      });

    if (uploadError) {
      alert('No se pudo subir la imagen: ' + uploadError.message);
      return;
    }

    archivoUrl = ruta;
  }

  const { error } = await supabaseClient
    .from('mensajes')
    .insert({
      ticket_id: ticketActual,
      user_id: sesionActual.user.id,
      contenido: texto,
      archivo_url: archivoUrl,
      archivo_nombre: imagen ? imagen.name : null
    });

  if (error) {
    console.error(error);
    alert('No se pudo enviar el mensaje: ' + error.message);
    return;
  }

  input.value = '';
  imageInput.value = '';

  await cargarMensajes();
}

window.addEventListener('click', event => {
  if (event.target.classList.contains('modal')) {
    event.target.classList.remove('open');
  }
});

window.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    document.querySelectorAll('.modal').forEach(modal => {
      modal.classList.remove('open');
    });

    cerrarMenu();
  }
});
