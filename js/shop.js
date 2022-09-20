obtenerProductos();
//Constructor de elementos del carrito 
class Carrito {
  constructor(id, nombre, cantidad, precio) {
    this.id = parseInt(id);
    this.nombre = nombre;
    this.cantidad = parseFloat(cantidad);
    this.precio = parseFloat(precio);

  }
}
class Producto {
  constructor(id, nombre, cantidad, precio) {
    this.id = parseInt(id);
    this.nombre = nombre;
    this.cantidad = parseFloat(cantidad);
    this.precio = parseFloat(precio);

  }
}

//VARIABLES
let carrito = [];
let productos = [];
let counter = 0; // Agrega posisionamiento al item del carrito


//Revisando local Storage si hay productos pasados en carrito
const localCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
carrito = localCarrito;
localCarrito.forEach(producto => {
  counter++
  document.querySelector("#itemsCarrito").innerHTML += `  
  <tr>
  <th scope="col">${counter}</th>
  <th scope="col">${producto.nombre}</th>
  <th scope="col">${producto.cantidad}</th>
  <th scope="col">${producto.precio}</th>
  <td><button id="eliminar${counter}" class="btn btn-outline-danger"><i class="fa-solid fa-trash-can"></i></button></td>
  </tr>
  `;
  const eliminarCarrito = document.getElementById(`eliminar${counter}`);
  eliminarCarrito.addEventListener("click", function () {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: producto.nombre + " " + 'eliminado!',
      showConfirmButton: false,
      timer: 2500,
      toast: true
    })

  });
  console.log(eliminarCarrito)
});


const botonVaciarCarrito = document.getElementById("vaciarCarrito");
const contenedorTotalModal = document.getElementById("footerTotal");
const contenedorCarrito = document.getElementById("itemsCarrito");
const packs = document.getElementById('shop');

//OBTENIENDO JSON DE productos.json
async function obtenerProductos() {
  const URLJSON = "../json/productos.json"
  const resp = await fetch(URLJSON)
  const data = await resp.json()
  productos = data;
  mostrar();
}


//Se muestra cada uno de los productos traidos por fetch desde json
function mostrar() {
  productos.forEach(producto => {
    productos.push = new Producto(producto.id, producto.nombre, producto.cantidad, producto.precio);
    packs.innerHTML +=
      `<div class="list-group productos container" >
          <a href="#" class="list-group-item list-group-item-action" aria-current="true" id="boton${producto.id}">
          <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">${producto.nombre}</h5>
            <small>$${producto.precio}</small>
          </div>
          <p class="mb-1">${producto.descripcion}.</p>
          <small>${producto.vencimiento}</small>
        </a>
        </div>
        `;
  })
  //Agregando evento a cada boton para agregar al carrito por cada producto itinerado
  productos.forEach(producto => {
    //evento individial para cada boton
    document.getElementById(`boton${producto.id}`).addEventListener("click", function () { agregarAlCarrito(producto) });
  })
}
//Agregar al carrito, se va a agregar mediante un innerhtml 
function agregarAlCarrito(agregar) {
  carrito.push(agregar);
  // let encontrado = carrito.find(p => p.id == agregar.id);
  // console.log(encontrado)
  // if (encontrado.id == carrito.id) {
  //   Swal.fire(
  //     {
  //       position: 'top-end',
  //       icon: 'success',
  //       title: 'Ya tenes un pack de clases',
  //       showConfirmButton: false,
  //       timer: 2500,
  //       toast: true
  //     })
  // }
//   else {

    Swal.fire(
      {
        position: 'top-end',
        icon: 'success',
        title: 'Agregaste a tu carrito:' + "\n" + agregar.nombre,
        showConfirmButton: false,
        timer: 2500,
        toast: true
      }
    )
    //sumando al modal  elementos del carrito
    contenedorCarrito.innerHTML += `
    <tr>
    <th scope="row">${carrito.length}</th>
    <td>${agregar.nombre}</td>
    <td>${agregar.cantidad}</td>
    <td>${agregar.precio}</td>
    <td><button id="eliminar${carrito.length}" class="btn btn-outline-danger"><i class="fa-solid fa-trash-can"></i></button></td>
    </tr>
    `
    //Agregando evento a cada boton del carrito por cada producto
    const eliminarProducto = document.getElementById(`eliminar${agregar.id}`);
    eliminarProducto.addEventListener("click", function () {
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: agregar.nombre + " " + 'eliminado!',
        showConfirmButton: false,
        timer: 2500,
        toast: true
      })
      eliminarDelCarrito(`eliminar${carrito.length}`)
    });

    //sumando precio total agregado al carrito 
    const total = carrito.reduce((total,precio) => total + precio.precio, 0);
    contenedorTotalModal.innerHTML =`Total $ ${total}`;
    carrito.length === 0 ? contenedorTotalModal.innerHTML = `<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`: contenedorTotalModal.innerHTML = `<th scope="row" colspan="5">Total de la compra: $${total}</th>`;
    //agregando al local storage
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }

//boton eliminar productos
const eliminarDelCarrito = (prodId) => {
  const item = carrito.find((prod) => carrito.id === prodId);
  const indice = carrito.indexOf(item);
  carrito.splice(indice, 1);
  actualizarCarrito();

}


    //SPREAD OPERATOR-agrego una nueva clave y valor a todos los objetos y se muestra por consola
    const origen = "Argentina";
    const construido = productos.map(productos =>{
    return {...productos, origen};
    });
    console.table(construido) 


//VACIAR TOTAL DEL CARRITO-
vaciarCarrito.addEventListener("click", () => {
    if(carrito.length === 0){
        Swal.fire('Todavía no has agregado nada!');
    }else{
        Swal.fire({
            title: 'Se ha vaciado tu carrito!',
            showClass: {
              popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp'
            }
          })
    }
    carrito.length = 0;
    actualizarCarrito();
})

//ACTUALIZAR CARRITO Y SUMAR EL TOTAL-
function actualizarCarrito(){   
  contenedorCarrito.innerHTML = "";
    carrito.forEach((prod) => {
        let div = document.createElement("tr");
        div.innerHTML+=`
                        <td>${prod.id}</td>
                        <td>${prod.nombre}</td>
                        <td>$${prod.precio}</td>
                        <td>${prod.cantidad}</td>
                        <td><button id="eliminar${prod.id}" class="btn btn-outline-danger"><i class="fa-solid fa-trash-can"></i></button></td>
                        `;
                    contenedorCarrito.append(div);
                    //se asigna un botón para eliminar cada producto del carrito
                    const eliminarProducto = document.getElementById(`eliminar${prod.id}`);
                    eliminarProducto.addEventListener("click", function(){
                        Swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            title: prod.nombre+" "+'eliminado!',
                            showConfirmButton: false,
                            timer: 2500,
                            toast : true
                          })
                    eliminarDelCarrito(prod.id)
        }); 
    });         
                //con el método reduce se suma total de todo el carrito
                const total = carrito.reduce((acc,prod) => acc+prod.precio,0);
                //OPERADOR TERNARIO-------------------------
                carrito.length === 0 ? contenedorTotalModal.innerHTML = `<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`: contenedorTotalModal.innerHTML = `<th scope="row" colspan="5">Total de la compra: $${total}</th>`;
                contenedorTotalModal.innerText = carrito.length;
                //se guarda el carrito en el local storage
                localStorage.setItem("carrito",JSON.stringify(carrito));
}

//FINALIZAR COMPRA-al finalizar la compra se vacía el carrito del local storage-
finalizarCompra.addEventListener("click", () =>{
    if(carrito.length === 0){
        Swal.fire('Seleccioná un producto!');
    }else{
        Swal.fire({
            title: 'Compra realizada con éxito!!!',
            text: 'Tu pedido está en proceso...',
            imageWidth: 100,
            imageHeight: 100,
            imageAlt: 'Logo',
          })
    }
    localStorage.removeItem("carrito",JSON.stringify(carrito));
    carrito=[]
    actualizarCarrito();
  })