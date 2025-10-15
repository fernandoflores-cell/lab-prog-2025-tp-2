let productos, carrito;
const obtenerProductos = async () => {
  //obtiene los item del archivo y luego lo parsea de json (aca luego va la api del backend)
  productos = await fetch("items.json").then((res) => res.json());
  carrito = await fetch("carrito.json").then((res) => res.json());
};
const obtenerItems = async () => {
  //obtiene los item del archivo y luego lo parsea de json (aca luego va la api del backend)
  const items = await fetch("items.json").then((res) => res.json());
  console.log(items);

  //este va a ser la seccion que contenga los items. si o si hay que seleccionar por id
  const seccionItems = document.getElementById("items"); //este va a ser el elemento html que va a tener de hijo al html de los prodcutos

  //luego, por cada item, craftea un html
  items.forEach((item) => {
    //va a ser una 'a' porque queremos que todo lo que se muestre del item lo redireccion a la su pagina correspondiente
    const a = document.createElement("a");
    //le agregamos los estilos
    a.classList.add("item", "fade");
    a.href = "product.html";
    a.setAttribute("data-plataforma", item.plataforma);
    a.addEventListener("click", () => {
      localStorage.setItem("item", JSON.stringify(item));
    });

    //imagen del item
    const img = document.createElement("img");
    //esto es para indicar que la imagen que contendra la etiqueta es la del .json
    img.src = item.image;
    img.classList.add("item-imagen");

    //etiqueta que contendra el texto del nombre y el precio
    const contInfo = document.createElement("div");
    contInfo.classList.add("item-info");

    const nombreItem = document.createElement("p");
    nombreItem.classList.add("item-nombre");
    //esto es para indicar que el texto que contendra la etiqueta proviene del .json
    nombreItem.textContent = `${item.nombre}`;

    const nombrePrecio = document.createElement("p");
    nombrePrecio.classList.add("item-precio");
    nombrePrecio.textContent = `$${item.precio}`;

    //ahora se arma el html
    seccionItems.appendChild(a);
    a.appendChild(img);
    a.appendChild(contInfo);
    contInfo.appendChild(nombreItem);
    contInfo.appendChild(nombrePrecio);
  });
};

const listarProductosCarrito = async () => {
  //obtiene los datos del archivo y luego lo parsea de json (aca luego va la api del backend)
  await obtenerProductos();

  const leftSide = document.getElementById("productos");
  const rightSide = document.getElementById("precios");

  //se recorre el arreglo del carrito con un bucle for para darle un id basado en el iterador a cada item en el carrito
  for (let i = 0; i < carrito.cartItems.length; i++) {
    //se guarda el producto actual
    const producto = productos[carrito.cartItems[i].id];

    //se crean los elementos que va a contener cada item en el carrito
    const divCartItem = document.createElement("div");
    const divCartImageBox = document.createElement("div");
    const divCartInfo = document.createElement("div");
    const divQuantity = document.createElement("div");
    const itemImg = document.createElement("img");
    const paragNombre = document.createElement("p");
    const plusButton = document.createElement("button");
    const paragQuantityText = document.createElement("p");
    const minusButton = document.createElement("button");
    const paragSubTotal = document.createElement("p");
    const trashButton = document.createElement("button");
    const trashImg = document.createElement("img");

    //se añaden propiedades a los items
    divCartItem.classList.add("cart-item");
    divCartItem.id = i;

    divCartImageBox.classList.add("cart-item-image-box");
    divCartInfo.classList.add("cart-item-info");

    divQuantity.classList.add("cart-item-quantity");

    itemImg.classList.add("cart-item-image");
    itemImg.src = producto.image;

    paragNombre.classList.add("name");
    paragNombre.textContent = producto.nombre;

    plusButton.classList.add("quantity-button");
    plusButton.textContent = "+";
    plusButton.addEventListener("click", function () {
      sumarCantidad(i, 1);
    });

    paragQuantityText.classList.add("quantity-text");
    paragQuantityText.textContent = carrito.cartItems[i].quantity;

    minusButton.classList.add("quantity-button");
    minusButton.textContent = "-";
    minusButton.addEventListener("click", function () {
      sumarCantidad(i, -1);
    });

    paragSubTotal.classList.add("sub-total-text");
    paragSubTotal.textContent =
      "$" + producto.precio * carrito.cartItems[i].quantity;

    //temporal hasta que se agregue toda la logica del carro (al ingresar o eliminar items del carro se debe de cambiar este valor)
    carrito.totalPrice += producto.precio * carrito.cartItems[i].quantity;

    trashButton.classList.add("trash-button");
    trashButton.addEventListener("click", function () {
      borrarItemCarrito(i);
    });
    trashImg.src = "icons/trash.svg";
    trashImg.alt = "eliminar";

    //se agregan los items como hijos de sus respectivos padres
    leftSide.appendChild(divCartItem);
    divCartItem.appendChild(divCartImageBox);
    divCartItem.appendChild(divCartInfo);
    divCartImageBox.appendChild(itemImg);
    divCartInfo.appendChild(paragNombre);
    divCartInfo.appendChild(trashButton);
    trashButton.appendChild(trashImg);
    divCartInfo.appendChild(divQuantity);
    divQuantity.appendChild(plusButton);
    divQuantity.appendChild(paragQuantityText);
    divQuantity.appendChild(minusButton);
    divCartInfo.appendChild(paragSubTotal);
  }
  //se comienza a crear el contenido de la parte derecha del carro
  const pTotal = document.createElement("p");
  const buttonBuy = document.createElement("button");

  //pTotal.classList.add("");
  pTotal.id = "precioTotal";

  pTotal.textContent = "Total: \n$" + carrito.totalPrice;
  buttonBuy.textContent = "Finalizar compra";

  rightSide.appendChild(pTotal);
  rightSide.appendChild(buttonBuy);
};

const buscarEnCarro = (cartId) => {
  let retorno,
    i = 0;
  while (retorno == null && i < carrito.cartItems.length) {
    if (carrito.cartItems[i].cartId == cartId) {
      retorno = carrito.cartItems[i];
    }
    i++;
  }
  return retorno;
};

const buscarProducto = (id) => {
  let retorno,
    i = 0;
  while (retorno == null && i < productos.length) {
    if (productos[i].id == id) {
      retorno = productos[i];
    }
    i++;
  }
  return retorno;
};

const sumarCantidad = (cartId, value) => {
  //se buscan los elementos
  const productoCarrito = buscarEnCarro(cartId);
  const producto = buscarProducto(productoCarrito.id);

  //se obtiene el elemento del html
  const cartItem = document.getElementById(cartId);

  //se suma el valor verificando que nunca se pueda dar un valor negativo
  productoCarrito.quantity += value;
  if (productoCarrito.quantity < 0) {
    productoCarrito.quantity = 0;
  }

  //se actualiza el precio total del carro
  carrito.totalPrice += producto.precio * value;

  //se actualiza el contenido del texto en el item
  cartItem.getElementsByClassName("quantity-text")[0].textContent =
    productoCarrito.quantity;

  cartItem.getElementsByClassName("sub-total-text")[0].textContent =
    "$" + producto.precio * productoCarrito.quantity;

  document.getElementById("precioTotal").textContent =
    "Total: \n$" + carrito.totalPrice;
};

const borrarItemCarrito = (cartId) => {
  const productoCarrito = buscarEnCarro(cartId);
  const producto = buscarProducto(productoCarrito.id);

  //se actualiza el precio total del carro
  carrito.totalPrice -= producto.precio * productoCarrito.quantity;
  document.getElementById("precioTotal").textContent =
    "Total: \n$" + carrito.totalPrice;

  //se filtra el arreglo de items en el carrito segun el cartId proporcionado como parametro
  carrito.cartItems = carrito.cartItems.filter(function (item) {
    return item.cartId !== cartId;
  });
  //se busca el item con el cartId en el html y se lo remueve de su padre, actualizando la pagina
  let itemCarrito = document.getElementById(cartId);
  itemCarrito.parentNode.removeChild(document.getElementById(cartId));
};

const agregarItemCarrito = (newId) => {
  let yaExiste = false,
    i = 0;
  while (!yaExiste && i < carrito.cartItems.length) {
    if (carrito.cartItems[i].id == newId) {
      console.log("ya existe");
      yaExiste = true;
    }
    i++;
  }

  if (!yaExiste) {
    const producto = buscarProducto(newId);
    const leftSide = document.getElementById("productos");

    let newCartId;
    if (carrito.cartItems.length > 0) {
      newCartId = carrito.cartItems[carrito.cartItems.length - 1].cartId + 1;
    } else {
      newCartId = 0;
    }
    carrito.cartItems.push({ cartId: newCartId, id: newId, quantity: 1 });

    //se crean los elementos que va a contener cada item en el carrito
    const divCartItem = document.createElement("div");
    const divCartImageBox = document.createElement("div");
    const divCartInfo = document.createElement("div");
    const divQuantity = document.createElement("div");
    const itemImg = document.createElement("img");
    const paragNombre = document.createElement("p");
    const plusButton = document.createElement("button");
    const paragQuantityText = document.createElement("p");
    const minusButton = document.createElement("button");
    const paragSubTotal = document.createElement("p");
    const trashButton = document.createElement("button");
    const trashImg = document.createElement("img");

    //se añaden propiedades a los items
    divCartItem.classList.add("cart-item");
    divCartItem.id = newCartId;

    divCartImageBox.classList.add("cart-item-image-box");
    divCartInfo.classList.add("cart-item-info");

    divQuantity.classList.add("cart-item-quantity");

    itemImg.classList.add("cart-item-image");
    itemImg.src = producto.image;

    paragNombre.classList.add("name");
    paragNombre.textContent = producto.nombre;

    plusButton.classList.add("quantity-button");
    plusButton.textContent = "+";
    plusButton.addEventListener("click", function () {
      sumarCantidad(newCartId, 1);
    });

    paragQuantityText.classList.add("quantity-text");
    paragQuantityText.textContent = 1;

    minusButton.classList.add("quantity-button");
    minusButton.textContent = "-";
    minusButton.addEventListener("click", function () {
      sumarCantidad(newCartId, -1);
    });

    paragSubTotal.classList.add("sub-total-text");
    paragSubTotal.textContent = "$" + producto.precio;

    //se actualiza el precio total del carro
    carrito.totalPrice += producto.precio;
    document.getElementById("precioTotal").textContent =
      "Total: \n$" + carrito.totalPrice;

    trashButton.classList.add("trash-button");
    trashButton.addEventListener("click", function () {
      borrarItemCarrito(newCartId);
    });
    trashImg.src = "icons/trash.svg";
    trashImg.alt = "eliminar";

    //se agregan los items como hijos de sus respectivos padres
    leftSide.appendChild(divCartItem);
    divCartItem.appendChild(divCartImageBox);
    divCartItem.appendChild(divCartInfo);
    divCartImageBox.appendChild(itemImg);
    divCartInfo.appendChild(paragNombre);
    divCartInfo.appendChild(trashButton);
    trashButton.appendChild(trashImg);
    divCartInfo.appendChild(divQuantity);
    divQuantity.appendChild(plusButton);
    divQuantity.appendChild(paragQuantityText);
    divQuantity.appendChild(minusButton);
    divCartInfo.appendChild(paragSubTotal);
  }
};

const filtrarPorPlataforma = () => {
  const botones = document.querySelectorAll(".plataform-button");
  botones.forEach((boton) => {
    //se añade el evento click a cada boton
    boton.addEventListener("click", () => {
      //se estila el botones segun la plataforma seleccionada
      botones.forEach((b) => b.classList.remove("active"));
      boton.classList.add("active");
      //luego se obtienen todos lo items
      const items = document.querySelectorAll(".item");
      //se desaparecen los item si no son de la plataforma seleccionada
      items.forEach((item) => {
        const plataforma = item.getAttribute("data-plataforma");
        if (plataforma === boton.id) {
          item.classList.remove("vanish");
        } else {
          item.classList.add("vanish");
        }
      });
    });
  });
};
/* funcion vieja
//function porque con const () => no se porque no anda
function renderizarItemSeleccionado() {
  //toma el item guardado en el local storage
  const item = JSON.parse(localStorage.getItem("item"));
  //luego agrega el contenido en el html
  const imagen = document.querySelector(".item-image img");
  imagen.src = item.image;
  imagen.alt = item.nombre;

  const titulo = document.querySelector(".item-title");
  titulo.textContent = item.nombre;

  const precio = document.querySelector(".item-precio-destacado");
  precio.textContent = `$ ${item.precio}`;

  const carac = document.querySelector(".item-caracteristicas");
  carac.textContent = `${item.plataforma}`;
  const desc = document.querySelector(".item-descripcion");
  desc.textContent = `${item.nombre}`;
}
*/


// para extraer el monto en USD del producto, osea del nombre
const parseMontoUSD = (nombre) => {
  // extrae el número antes de "USD"
  const m = nombre.match(/(\d+)\s*usd/i);
  return m ? Number(m[1]) : null;
};

// para extraer el nombre del producto sin el monto
const baseKey = (nombre) => nombre.replace(/\s*\d+\s*usd/i, "").trim();

async function renderizarItemSeleccionado() {
  // busco el item que se selecciono en el listado, en el local storage, si no existe corto para prevenir errores
  const itemSel = JSON.parse(localStorage.getItem("item"));
  if (!itemSel) return;
  
  // cargo toda la lista de items que esta en el items.json
  const items = await fetch("items.json").then(r => r.json());
  
  // Extraigo el nombre del producto sin el monto
  const key = baseKey(itemSel.nombre);
  //Busco todas las variantes del mismo producto, basandonos en el mismo nombre del producto sin el monto
  const variantes = items
  .filter(it => baseKey(it.nombre) === key && it.plataforma === itemSel.plataforma)
  .map(it => ({
      ...it,
      precioNum: Number(it.precio),        //extraigo el precio que viene del json como string
      montoUSD: parseMontoUSD(it.nombre), //extraigo el monto en USD
    }))
    //ordeno las variantes obtenidas por monto en USD
    .sort((a,b) => a.montoUSD - b.montoUSD);
    
  // Agrego el contenido al html con el item seleccionado, buscando en el DOM por sus clases y poniendo la informacion del item seleccionado
  const imagen = document.querySelector(".item-image img"); // busco en product.html el primer elemento del DOM que coincida
  imagen.src = itemSel.image;
  imagen.alt = itemSel.nombre;
  
  document.querySelector(".item-title").textContent = itemSel.nombre;
  document.querySelector(".item-precio-destacado").textContent =
  `$ ${Number(itemSel.precio).toLocaleString("es-AR")}`;
  document.querySelector(".item-caracteristicas").textContent = itemSel.plataforma;
  document.querySelector(".item-descripcion").textContent = key; // o lo que quieras mostrar
  
  // --- hago todas las cajitas de montos ---
  const grid = document.getElementById("var-cantidad-cajita");
  // limpio el grid por si habia algo
  grid.innerHTML = "";
  //Para cada variante creo un boton, creando el elemento en memoria
  variantes.forEach(v => {
    //esto crea en el documento un <button></button>
    const btn = document.createElement("button");
    btn.type = "button";
    //le asigno el css
    btn.className = "estilo-btn";
    //guardo el id y el monto en usd en atributos data
    btn.dataset.id = v.id;
    btn.dataset.monto = v.montoUSD;
    //le agrego al boton el monto en usd
    btn.innerHTML = `<div>${v.montoUSD} USD</div>`;
    //cada vez que se clickee...
    btn.addEventListener("click", () => {
      //veo todos los botones del grid y los marco como no seleccionados
      grid.querySelectorAll(".estilo-btn").forEach(b => b.setAttribute("aria-selected","false"));
      //marco este boton como seleccionado
      btn.setAttribute("aria-selected","true");

      // actualizar precio y textos con esa variante
      document.querySelector(".item-precio-destacado").textContent =
      `$ ${v.precioNum.toLocaleString("es-AR")}`;
      document.querySelector(".item-title").textContent = v.nombre;
      imagen.src = v.image;
      imagen.alt = v.nombre;
      
      // guardo la seleccion en el local storage para que si se agrega al carrito sea con esa variante
      localStorage.setItem("item", JSON.stringify(v));
    });
//agrego el boton al grid
    grid.appendChild(btn);
  });

  // seleccionar por defecto el monto del item con el que llegaste
  const montoInicial = parseMontoUSD(itemSel.nombre);
  const btnInicial =
    [...grid.querySelectorAll(".estilo-btn")].find(b => Number(b.dataset.monto) === montoInicial)
    || grid.querySelector(".estilo-btn");
    //si no lo encuentro, selecciono el primero
  if (btnInicial) btnInicial.click();
}

// para que se cargue el scripto despues de que se cargo el html
//NO ES NECESARIA ESTA LINEA, por que lo usamos al final
/* document.addEventListener("DOMContentLoaded", renderizarItemSeleccionado); */
const mostrarResultadosBusqueda = async()=>{
  const items = await fetch("items.json").then(res=>res.json());
  
  const input = document.getElementById("nav-input");
  const listaResultados = document.getElementById("search-results-container");
   
  //oculta los resultados al hacer click fuera del input
  document.addEventListener("click", (e)=>{
    if(e.target !== input){
      listaResultados.style.display = "none";
    }else{
      listaResultados.style.display = "block";
    }
  });

  console.log(items);
  //se obtiene el valor del input cada vez que se escribe algo
  input.addEventListener("input", ()=>{
    const valueInput = input.value.toLowerCase();
    console.log(valueInput);

    //no se muestran resultados si el input esta vacio
    if(valueInput.length === 0){
      listaResultados.style.display = "none";
    } else{
      listaResultados.style.display = "block";
    }
    //se limpia la lista de resultados antes de mostrar los nuevos resultados
    listaResultados.innerHTML = "";
    
    //se filtran los items que coincidan con el valor del input
    const resultados = items.filter(item => item.nombre.toLowerCase().includes(valueInput));
    //luego, por cada item que coincida, se crea un html y se agrega a la lista de resultados
    resultados.forEach(item => {
      const div = document.createElement("div");
      div.classList.add("result-item");
      const img = document.createElement("img");
      img.src = item.image;
      img.alt = item.nombre;
      img.classList.add("result-image");
      const nombre = document.createElement("span");
      nombre.textContent = item.nombre;
      nombre.classList.add("result-name");
      div.appendChild(img);
      div.appendChild(nombre);
      div.addEventListener("click", ()=>{
        localStorage.setItem("item", JSON.stringify(item));
        window.location.href = "product.html";
      });
      listaResultados.appendChild(div);
    });
  });
}
