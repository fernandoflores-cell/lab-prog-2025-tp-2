let productos, carrito;
const obtenerProductos = async () => {
  //obtiene los item del archivo y luego lo parsea de json (aca luego va la api del backend)
  productos = await fetch("productos.json").then((res) => res.json());
  carrito = await fetch("carrito.json").then((res) => res.json());
};

const listarProductos = async () => {
  await obtenerProductos();
  //este va a ser la seccion que contenga los producto. si o si hay que seleccionar por cartId
  const seccionProductos = document.getElementById("productos"); //este va a ser el elemento html que va a tener de hijo al html de los prodcutos

  //luego, por cada producto, craftea un html
  productos.forEach((producto) => {
    //va a ser una 'a' porque queremos que todo lo que se muestre del producto lo redireccion a la su pagina correspondiente
    const a = document.createElement("a");
    //le agregamos los estilos
    a.classList.add("item", "fade");
    a.href = "product.html";
    //a.target = "_blank";

    //imagen del producto
    const img = document.createElement("img");
    //esto es para indicar que la imagen que contendra la etiqueta es la del .json
    img.src = producto.image;
    img.classList.add("item-imagen");

    //etiqueta que contendra el texto del nombre y el precio
    const contInfo = document.createElement("div");
    contInfo.classList.add("item-info");

    const nombreProducto = document.createElement("p");
    nombreProducto.classList.add("item-nombre");
    //esto es para indicar que el texto que contendra la etiqueta proviene del .json
    nombreProducto.textContent = `${producto.nombre}`;

    const nombrePrecio = document.createElement("p");
    nombrePrecio.classList.add("item-precio");
    nombrePrecio.textContent = `$${producto.precio}`;

    //ahora se arma el html
    seccionProductos.appendChild(a);
    a.appendChild(img);
    a.appendChild(contInfo);
    contInfo.appendChild(nombreProducto);
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
