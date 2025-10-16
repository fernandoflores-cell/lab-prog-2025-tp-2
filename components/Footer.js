class Footer extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `<footer>
      <div class="footer-content">
        <div class="footer-section">
          <h3 class="footer-section-title">¿¿¿</h3>
          <p>¿descripcion de la tienda?</p>
        </div>
        <div class="footer-section">
          <h4 class="footer-section-title">Navegación</h4>
          <ul>
            <li><a href="index.html">Inicio</a></li>
            <li><a href="shopping-cart.html">Carrito</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4 class="footer-section-title">Contacto</h4>
          <ul>
            <li>Fernando: fernando@gmail.com</li>
            <li>Joaquin: joaquin@gmail.com</li>
            <li>Ignacio: ignacio@gmail.com</li>
          </ul>
        </div>
      </div>
    </footer>`;
    }
}
customElements.define("app-footer", Footer);
