// script.js

document.addEventListener("DOMContentLoaded", () => {
    // Inicializar iconos de Feather
    feather.replace();

    // Efecto de click en los botones de "añadir"
    const addButtons = document.querySelectorAll('button:has(i[data-feather="plus"])');
    
    addButtons.forEach(button => {
        button.addEventListener('click', function() {
            const originalHTML = this.innerHTML;
            // Cambiar a un check temporalmente
            this.innerHTML = '<i data-feather="check" class="w-5 h-5"></i>';
            feather.replace();
            
            // Volver al icono de plus después de 1.5s
            setTimeout(() => {
                this.innerHTML = originalHTML;
                feather.replace();
            }, 1500);
            
            console.log("Producto añadido al carrito en MRSTORE");
        });
    });

    console.log("MRSTORE Frontend cargado con éxito.");
});
