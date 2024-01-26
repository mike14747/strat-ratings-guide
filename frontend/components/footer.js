class MyFooter extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
        <footer class="footer">
            &copy; 2020 Strat Ratings Guide
        </footer>
        `;
    }
}

customElements.define('my-footer', MyFooter);
