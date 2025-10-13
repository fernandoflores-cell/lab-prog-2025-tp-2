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
