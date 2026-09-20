let carrito = [];
let tasaMoneda = 1;
let simboloMoneda = '$';

// Cambiar vistas de manera fluida
function cambiarMenu(vista) {
  document.getElementById('view-tienda').classList.add('hidden');
  document.getElementById('view-carrito').classList.add('hidden');
  
  if(vista === 'tienda') {
    document.getElementById('view-tienda').classList.remove('hidden');
  } else if(vista === 'carrito') {
    document.getElementById('view-carrito').classList.remove('hidden');
    renderizarCarrito();
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Toggle menú de monedas
function toggleMonedaMenu(e) {
  e.stopPropagation();
  const menu = document.getElementById('dropdownMoneda');
  menu.classList.toggle('hidden');
}
window.addEventListener('click', () => {
  const menu = document.getElementById('dropdownMoneda');
  if (menu) menu.classList.add('hidden');
});

// Configurar Moneda
function setMoneda(flag, codigo, tasa, simbolo) {
  document.getElementById('flagLbl').textContent = flag;
  document.getElementById('currLbl').textContent = codigo;
  tasaMoneda = tasa;
  simboloMoneda = simbolo;

  document.querySelectorAll('.simbolo').forEach(el => el.textContent = simbolo);
  document.querySelectorAll('.precio').forEach(el => {
    let usd = parseFloat(el.getAttribute('data-usd'));
    el.textContent = (usd * tasa).toFixed(2);
  });
  renderizarCarrito();
}

// Filtrar Productos por categoría
function filtrarProductos(cat) {
  ['todos', 'discord', 'streaming', 'minecraft'].forEach(c => {
    const btn = document.getElementById('btn-cat-' + c);
    if(btn) {
      if(c === cat) {
        btn.className = "px-4 py-2.5 rounded-xl bg-mrPrimary text-white font-bold text-xs shrink-0 transition cursor-pointer";
      } else {
        btn.className = "px-4 py-2.5 rounded-xl glass-panel text-gray-300 font-bold text-xs shrink-0 hover:border-mrPrimary transition cursor-pointer";
      }
    }
  });

  document.querySelectorAll('.prod-card').forEach(card => {
    if(cat === 'todos' || card.getAttribute('data-cat') === cat) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

// Agregar producto al carrito
function agregarAlCarrito(nombre, precioUsd) {
  carrito.push({ nombre, precioUsd });
  document.getElementById('cartCount').textContent = carrito.length;
  mostrarNotificacion(`¡${nombre} agregado al carrito!`);
}

// Renderizar Carrito
function renderizarCarrito() {
  const contenedor = document.getElementById('listaCarrito');
  if(carrito.length === 0) {
    contenedor.innerHTML = `<p class="text-xs text-gray-400 text-center py-6">Tu carrito está vacío.</p>`;
    document.getElementById('totalCarrito').textContent = simboloMoneda + '0.00';
    return;
  }

  let html = '';
  let totalUsd = 0;
  carrito.forEach((item, index) => {
    totalUsd += item.precioUsd;
    html += `
      <div class="flex items-center justify-between pb-3 border-b border-mrBorder text-xs">
        <div>
          <span class="font-bold text-white block">${item.nombre}</span>
          <span class="text-gray-400">${simboloMoneda}${(item.precioUsd * tasaMoneda).toFixed(2)}</span>
        </div>
        <button onclick="eliminarItem(${index})" class="text-red-400 hover:text-red-300 p-1.5 cursor-pointer"><i class="fa-solid fa-trash"></i></button>
      </div>
    `;
  });
  contenedor.innerHTML = html;
  document.getElementById('totalCarrito').textContent = simboloMoneda + (totalUsd * tasaMoneda).toFixed(2);
}

// Eliminar item
function eliminarItem(index) {
  carrito.splice(index, 1);
  document.getElementById('cartCount').textContent = carrito.length;
  renderizarCarrito();
}

// Procesar pedido y enviar al Discord configurado
function procesarPagoDiscord() {
  if(carrito.length === 0) {
    mostrarNotificacion('Agrega productos antes de realizar el pedido.');
    return;
  }

  let resumen = "Hola, quiero realizar el siguiente pedido en MRSTORE:\n";
  let totalUsd = 0;
  carrito.forEach(item => {
    resumen += `- ${item.nombre} ($${item.precioUsd.toFixed(2)})\n`;
    totalUsd += item.precioUsd;
  });
  resumen += `Total: $${totalUsd.toFixed(2)}`;

  // Copia el resumen de la compra y redirige al Discord de soporte
  navigator.clipboard.writeText(resumen).then(() => {
    mostrarNotificacion('¡Pedido copiado! Abriendo servidor de Discord...');
    setTimeout(() => {
      window.open('https://discord.gg/QN2Yew346d', '_blank');
    }, 1200);
  }).catch(() => {
    alert('Copia tu pedido y ábrelo en un ticket de Discord: https://discord.gg/QN2Yew346d');
    window.open('https://discord.gg/QN2Yew346d', '_blank');
  });
}

// Notificaciones flotantes
function mostrarNotificacion(msg) {
  const noti = document.createElement('div');
  noti.className = "fixed bottom-6 right-6 glass-panel border border-mrPrimary text-white font-bold px-5 py-3 rounded-2xl shadow-2xl z-50 text-xs flex items-center gap-3 animate-bounce";
  noti.innerHTML = `<i class="fa-solid fa-circle-check text-mrPrimary text-base"></i> ${msg}`;
  document.body.appendChild(noti);
  setTimeout(() => noti.remove(), 3000);
}
