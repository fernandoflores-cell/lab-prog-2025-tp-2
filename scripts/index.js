const obtenerItems = async () => {
  //obtiene los item del archivo y luego lo parsea de json (aca luego va la api del backend)
  const items = await fetch("items.json").then((res) => res.json());
  console.log(items);

  //este va a ser la seccion que contenga los items. si o si hay que seleccionar por id
  const seccionItems = document.getElementById("items"); //este va a ser el elemento html que va a tener de hijo al html de los prodcutos
  seccionItems.classList.add("items-container");
  //luego, por cada item, craftea un html
  items.forEach((item) => {
    //va a ser una 'a' porque queremos que todo lo que se muestre del item lo redireccion a la su pagina correspondiente
    const a = document.createElement("a");
    //le agregamos los estilos
    a.classList.add("item-act", "fade");
    a.href = "product.html";
    a.setAttribute("data-plataforma", item.plataforma);
    a.addEventListener("click", () => {
      localStorage.setItem("item", JSON.stringify(item));
    });
    //imagen arriba
    const fotoCont = document.createElement("div");
    fotoCont.classList.add("item-contFoto");
    const img = document.createElement("img");
    //esto es para indicar que la imagen que contendra la etiqueta es la del .json
    img.src = item.image;
    img.alt = item.nombre; //el alt para la imagen
    img.classList.add("item-imagen");
    fotoCont.appendChild(img);
    //etiqueta que contendra el texto del nombre y el precio
    const contInfo = document.createElement("div");
    contInfo.classList.add("item-info");

    const nombreItem = document.createElement("h3");
    nombreItem.classList.add("item-nombre");
    //esto es para indicar que el texto que contendra la etiqueta proviene del .json
    nombreItem.textContent = item.nombre;
    //para la plataforma y region
    const meta = document.createElement("div");
    meta.classList.add("item-metaDiv");
    //para la plataforma
    const plataforma = document.createElement("span");
    plataforma.textContent = (item.plataforma || "").toUpperCase();
    //separador
    const sep = document.createElement("span");
    sep.textContent = " •";

    //para la region
    const region = document.createElement("span");
    region.textContent = " Global";
    //para el precio
    const precio = document.createElement("div");
    const strong = document.createElement("strong"); //para el precio en negrita
    strong.textContent = Number(item.precio).toLocaleString("es-AR");
    precio.appendChild(strong); // lo meto en la cajita del precio
    precio.append(" AR$"); //luego le agrego el ARS
    //ahora se arma el html
    seccionItems.appendChild(a);
    a.appendChild(fotoCont);
    a.appendChild(contInfo);
    contInfo.appendChild(nombreItem);
    contInfo.appendChild(meta);
    contInfo.appendChild(precio);
    meta.appendChild(plataforma);
    meta.appendChild(sep);
    meta.appendChild(region);
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
      const items = document.querySelectorAll(".item-act");
      //se desaparecen los item si no son de la plataforma seleccionada
      items.forEach((item) => {
        const plataforma = item.getAttribute("data-plataforma");
        if (plataforma === boton.id) {
          item.style.display = "flex";
        } else {
          item.style.display = "none";
        }
      });
    });
  });
};
