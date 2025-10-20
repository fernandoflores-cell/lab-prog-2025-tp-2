const listarProductosCarrito = () => {
  let precioTotal = 0;
  //obtiene los datos del archivo y luego lo parsea de json (aca luego va la api del backend)

  const leftSide = document.getElementById("productos");
  const rightSide = document.getElementById("precios");

  //se recorre el arreglo del carrito con un bucle for para darle un id basado en el iterador a cada item en el carrito
  const carrito = JSON.parse(localStorage.getItem("carrito"));
  for (let i = 0; i < carrito.length; i++) {
    //se guarda el producto actual
    const item = carrito[i];

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
    divCartItem.id = item.id;

    divCartImageBox.classList.add("cart-item-image-box");
    divCartInfo.classList.add("cart-item-info");

    divQuantity.classList.add("cart-item-quantity");

    itemImg.classList.add("cart-item-image");
    itemImg.src = item.image;
    itemImg.alt = item.nombre; //el alt para la imagen

    paragNombre.classList.add("name");
    paragNombre.textContent = item.nombre;

    plusButton.classList.add("quantity-button");
    plusButton.textContent = "+";
    plusButton.addEventListener("click", function () {
      sumarCantidad(item.id, 1);
    });

    paragQuantityText.classList.add("quantity-text");
    paragQuantityText.textContent = item.cantidad;

    minusButton.classList.add("quantity-button");
    minusButton.textContent = "-";
    minusButton.addEventListener("click", function () {
      sumarCantidad(item.id, -1);
    });

    paragSubTotal.classList.add("sub-total-text");
    paragSubTotal.textContent = "$" + item.precio * item.cantidad;

    //temporal hasta que se agregue toda la logica del carro (al ingresar o eliminar items del carro se debe de cambiar este valor)
    precioTotal = precioTotal + Number(item.precio) * Number(item.cantidad);

    trashButton.classList.add("trash-button");
    trashButton.addEventListener("click", function () {
      borrarItemCarrito(item.id);
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

  pTotal.classList.add("precioTotal");
  pTotal.id = "precioTotal";

  pTotal.textContent = "Total: \n$" + precioTotal;
  buttonBuy.textContent = "Finalizar compra";

  rightSide.appendChild(pTotal);
  rightSide.appendChild(buttonBuy);
};


const sumarCantidad = (cartId, value) => {
  const carrito = JSON.parse(localStorage.getItem("carrito"));
  //se busca el item en el carrito
  let item = carrito.find((i) => i.id === cartId);
  console.log(item);

  //se obtiene el elemento del html
  const cartItem = document.getElementById(cartId);

  //se suma el valor verificando que nunca se pueda dar un valor negativo
  item.cantidad += value;
  if (item.cantidad <= 0) {
    borrarItemCarrito(cartId);
    return;
  }

  //se actualiza el precio total del carro
  //nota:'reduce' recorre el arreglo y va acumulando el total
  precioTotal = carrito.reduce(
    (total, item) => total + item.precio * item.cantidad,
    0
  );

  //se actualiza el contenido del texto en el item
  cartItem.getElementsByClassName("quantity-text")[0].textContent =
    item.cantidad;

  cartItem.getElementsByClassName("sub-total-text")[0].textContent =
    "$" + item.precio * item.cantidad;

  document.getElementById("precioTotal").textContent = "Total: $" + precioTotal;
  //se guarda el carrito actualizado en el localstorage
  localStorage.setItem("carrito", JSON.stringify(carrito));
};

const borrarItemCarrito = (cartId) => {
  //se obtiene el carrito del localstorage
  const carrito = JSON.parse(localStorage.getItem("carrito"));
  //se elimina el item del carrito
  const indice = carrito.findIndex((i) => i.id === cartId);
  if (indice > -1) {
    carrito.splice(indice, 1);
  }

  //se actualiza el precio total del carro
  let precioTotal = carrito.reduce(
    (total, item) => total + item.precio * item.cantidad,
    0
  );

  document.getElementById("precioTotal").textContent =
    "Total: \n$" + precioTotal;
  //se busca el item con el cartId en el html y se lo remueve de su padre, actualizando la pagina
  let itemCarrito = document.getElementById(cartId);
  itemCarrito.parentNode.removeChild(document.getElementById(cartId));
  //se guarda el carrito actualizado en el localstorage
  localStorage.setItem("carrito", JSON.stringify(carrito));
};
