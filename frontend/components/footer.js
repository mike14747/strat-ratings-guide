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

// <style>
//     .footer {
//         width: 100%;
//         background-color: #d3d3d3;
//         text-align: center;
//         padding: 1rem;
//         margin-top: 2rem;
//     }
// </style>

customElements.define('my-footer', MyFooter);
