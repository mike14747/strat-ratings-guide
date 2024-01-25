class MyHeader extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
        <header>
            <img src="analyze.png" />
            <p>Strat Ratings Guide Analysis<p>
        </header>
        `;
    }
}

customElements.define('my-header', MyHeader);
