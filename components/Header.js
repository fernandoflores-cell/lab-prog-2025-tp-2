class Header extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `  <header class="header">
      <nav>
        <div class="nav-left-section">
          <a class="nav-logo" href="index.html"
            ><img
              class="nav-logo-image"
              src="img/vector-degradado-logotipo-colorido-pajaro_343694-1365.jpg"
              alt=""
          /></a>
        </div>
        <div class="nav-middle-section">
          <input class="nav-input" type="text" placeholder="Buscar productos" />
          <button class="nav-button-search">
            <i class="fa fa-search"></i>
          </button>
        </div>
        <div class="nav-right-section">
          <a class="nav-menu nav-crear-cuenta" href="">Crear cuenta</a>
          <a class="nav-menu nav-ingresar" href="">Ingresar</a>
          <a class="nav-menu nav-carrito" href="shopping-cart.html"
            ><img
              class="nav-carrito-icon"
              src="icons/shopping-cart-white.svg"
              alt="Carrito"
          /></a>
        </div>
      </nav>
    </header>`;
  }
}

customElements.define("app-header", Header);
