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
  const items = await fetch("items.json").then((r) => r.json());

  // Extraigo el nombre del producto sin el monto
  const key = baseKey(itemSel.nombre);
  //Busco todas las variantes del mismo producto, basandonos en el mismo nombre del producto sin el monto
  const variantes = items
    .filter(
      (it) => baseKey(it.nombre) === key && it.plataforma === itemSel.plataforma
    )
    .map((it) => ({
      ...it,
      precioNum: Number(it.precio), //extraigo el precio que viene del json como string
      montoUSD: parseMontoUSD(it.nombre), //extraigo el monto en USD
    }))
    //ordeno las variantes obtenidas por monto en USD
    .sort((a, b) => a.montoUSD - b.montoUSD);
  console.log(variantes);
  // Agrego el contenido al html con el item seleccionado, buscando en el DOM por sus clases y poniendo la informacion del item seleccionado
  const imagen = document.querySelector(".item-image img"); // busco en product.html el primer elemento del DOM que coincida
  imagen.src = itemSel.image;
  imagen.alt = itemSel.nombre;

  document.querySelector(".item-title").textContent = itemSel.nombre;
  document.querySelector(".item-precio-destacado").textContent = `$ ${Number(
    itemSel.precio
  ).toLocaleString("es-AR")}`;
  document.querySelector(".item-caracteristicas").textContent =
    itemSel.plataforma;
  document.querySelector(".item-descripcion").textContent = key; // o lo que quieras mostrar

  // --- hago todas las cajitas de montos ---
  const grid = document.getElementById("var-cantidad-cajita");
  // limpio el grid por si habia algo
  grid.innerHTML = "";
  //Para cada variante creo un boton, creando el elemento en memoria
  if (variantes.length > 1) {
    variantes.forEach((v) => {
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
        grid
          .querySelectorAll(".estilo-btn")
          .forEach((b) => b.setAttribute("aria-selected", "false"));
        //marco este boton como seleccionado
        btn.setAttribute("aria-selected", "true");

        // actualizar precio y textos con esa variante
        document.querySelector(
          ".item-precio-destacado"
        ).textContent = `$ ${v.precioNum.toLocaleString("es-AR")}`;
        document.querySelector(".item-title").textContent = v.nombre;
        imagen.src = v.image;
        imagen.alt = v.nombre;

        // guardo la seleccion en el local storage para que si se agrega al carrito sea con esa variante
        localStorage.setItem("item", JSON.stringify(v));
      });
      //agrego el boton al grid
      grid.appendChild(btn);
    });
  } else {
    //si es un item sin variantes, oculto el texto
    const textoVariante = document.querySelector(".texto-variantes");
    textoVariante.style.display = "none";
  }
  // seleccionar por defecto el monto del item con el que llegaste
  const montoInicial = parseMontoUSD(itemSel.nombre);
  const btnInicial =
    [...grid.querySelectorAll(".estilo-btn")].find(
      (b) => Number(b.dataset.monto) === montoInicial
    ) || grid.querySelector(".estilo-btn");
  //si no lo encuentro, selecciono el primero
  if (btnInicial) btnInicial.click();
}
const agregarItemCarrito = () => {
  //se obtiene el carro del localstorage o se crea uno nuevo si no existe
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  //se obtiene el item del localstorage
  let item = JSON.parse(localStorage.getItem("item"));
  //se busca el item en el carrito
  itemEnCarrito = carrito.find((i) => i.id == item.id);
  //si el item ya existe en el carrito, se aumenta la cantidad
  if (itemEnCarrito) {
    itemEnCarrito.cantidad++;
  } else {
    //si el item no existe, se agrega al carrito
    carrito.push({ ...item, cantidad: 1 });
  }
  //se guarda el carrito actualizado en el localstorage
  localStorage.setItem("carrito", JSON.stringify(carrito));
  //animacion de carrito
  const iconoCarrito = document.querySelector(".nav-carrito-icon");
  if (iconoCarrito) {
    iconoCarrito.classList.add("animar");
    setTimeout(() => iconoCarrito.classList.remove("animar"), 450);
  }
};
