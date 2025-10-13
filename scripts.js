const obtenerProductos = async () => {
  //obtiene los item del archivo y luego lo parsea de json (aca luego va la api del backend)
  const productos = await fetch("productos.json").then((res) => res.json());
  console.log(productos);

  //este va a ser la seccion que contenga los producto. si o si hay que seleccionar por id
  const seccionProductos = document.getElementById("productos"); //este va a ser el elemento html que va a tener de hijo al html de los prodcutos

  //luego, por cada producto, craftea un html
  productos.forEach((producto) => {
    //va a ser una 'a' porque queremos que todo lo que se muestre del producto lo redireccion a la su pagina correspondiente
    const a = document.createElement("a");
    //le agregamos los estilos
    a.classList.add("item", "fade");
    a.href = "product.html";
    a.target = "_blank";
    a.setAttribute("data-plataforma", producto.plataforma);

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
