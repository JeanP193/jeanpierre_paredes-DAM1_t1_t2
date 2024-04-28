document.getElementById('aplicarFiltro').addEventListener('click', cargarProductos);

function cargarProductos() {
    let precioMinimo = document.getElementById('precioMinimo').value;
    const categoria = document.getElementById('categoria').value.toLowerCase();
    const marca = document.getElementById('marca').value.toLowerCase();

    precioMinimo = parseFloat(precioMinimo);
    if (isNaN(precioMinimo)) {
        precioMinimo = 0; 
    }
    if (precioMinimo < 0) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'El precio mínimo no puede ser negativo.',
        });
        return;
    }

    fetch('https://dummyjson.com/products')
        .then(response => response.json())
        .then(data => {
            const productos = data.products.filter(producto => {
                return (producto.price >= precioMinimo) && 
                       (!categoria || producto.category.toLowerCase().includes(categoria)) &&
                       (!marca || producto.brand.toLowerCase().includes(marca));
            });
            mostrarProductos(productos);
        });
}


function cargarFiltros() {
    fetch('https://dummyjson.com/products')
        .then(response => response.json())
        .then(data => {
            const categorias = new Set();
            const marcas = new Set();
            
            data.products.forEach(producto => {
                categorias.add(producto.category);
                marcas.add(producto.brand);
            });

            const categoriaSelect = document.getElementById('categoria');
            categorias.forEach(categoria => {
                const option = document.createElement('option');
                option.value = categoria.toLowerCase();
                option.textContent = categoria;
                categoriaSelect.appendChild(option);
            });

            const marcaSelect = document.getElementById('marca');
            marcas.forEach(marca => {
                const option = document.createElement('option');
                option.value = marca.toLowerCase();
                option.textContent = marca;
                marcaSelect.appendChild(option);
            });
        });
}

document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    cargarFiltros();
});

function mostrarProductos(productos) {
    const contenedor = document.getElementById('resultados').querySelector('.row');
    contenedor.innerHTML = ''; 

    if (productos.length === 0) {
        Swal.fire({
            icon: 'info',
            title: 'Sin resultados',
            text: 'Lo sentimos, no se ha encontrado ningún producto que coincida con los criterios de búsqueda.',
        });
    } else {
        productos.forEach(producto => {
            const div = document.createElement('div');
            div.classList.add('col-12', 'col-sm-6', 'col-md-4', 'col-lg-3', 'animate__animated', 'animate__fadeInUp');
            div.innerHTML = `
                <div class="producto">
                    <img src="${producto.thumbnail}" alt="${producto.title}" width="100">
                    <p>${producto.title} - ${producto.category} - ${producto.price}€</p>
                    <button onclick="añadirACarrito(${producto.id})" class="btn btn-primary">Añadir a carrito</button>
                </div>
            `;
            contenedor.appendChild(div);
        });
    }
}

let carrito = [];

function añadirACarrito(idProducto) {
    fetch(`https://dummyjson.com/products/${idProducto}`)
        .then(response => response.json())
        .then(producto => {
            carrito.push(producto);
            actualizarCarrito();
        });
}

function actualizarCarrito() {
    const contenedorCarrito = document.getElementById('carrito');
    contenedorCarrito.innerHTML = '';

    const tituloCarrito = document.createElement('h2');
    tituloCarrito.textContent = 'Carrito';
    contenedorCarrito.appendChild(tituloCarrito);

    carrito.forEach(producto => {
        const elementoProducto = document.createElement('div');
        elementoProducto.classList.add('animate__animated', 'animate__fadeInRight', 'producto-carrito'); 
        elementoProducto.innerHTML = `
        <img src="${producto.thumbnail}" alt="${producto.title}" width="50">
        <p>${producto.title} - ${producto.price}€</p>
        <button onclick="removerDelCarrito(${producto.id})" class="btn btn-danger">Eliminar</button>
    `;
        contenedorCarrito.appendChild(elementoProducto);
    });
}

function removerDelCarrito(idProducto) {
    carrito = carrito.filter(producto => producto.id !== idProducto);
    actualizarCarrito();
}