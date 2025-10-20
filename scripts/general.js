const mostrarResultadosBusqueda = async () => {
  const items = await fetch("items.json").then((res) => res.json());

  const input = document.getElementById("nav-input");
  const listaResultados = document.getElementById("search-results-container");

  //oculta los resultados al hacer click fuera del input
  document.addEventListener("click", (e) => {
    if (e.target !== input) {
      listaResultados.style.display = "none";
    } else {
      listaResultados.style.display = "block";
    }
  });

  console.log(items);
  //se obtiene el valor del input cada vez que se escribe algo
  input.addEventListener("input", () => {
    const valueInput = input.value.toLowerCase();
    console.log(valueInput);

    //no se muestran resultados si el input esta vacio
    if (valueInput.length === 0) {
      listaResultados.style.display = "none";
    } else {
      listaResultados.style.display = "block";
    }
    //se limpia la lista de resultados antes de mostrar los nuevos resultados
    listaResultados.innerHTML = "";

    //se filtran los items que coincidan con el valor del input
    const resultados = items.filter((item) =>
      item.nombre.toLowerCase().includes(valueInput)
    );
    //luego, por cada item que coincida, se crea un html y se agrega a la lista de resultados
    resultados.forEach((item) => {
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
      div.addEventListener("click", () => {
        localStorage.setItem("item", JSON.stringify(item));
        window.location.href = "product.html";
      });
      listaResultados.appendChild(div);
    });
  });
};
