class SeasonDropdownComponent extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
        <nav class="sd">
            <div class="button-container"}>
                <button>
                    <span class="menu-mutton">Seasons</span>
                </button>
            </div>

            <ul class="sd-dropdown-content">
                <li>
                    <a href="/hitter-analysis?season=2023">2023</a>
                </li>

                <li>
                    <a href="/hitter-analysis?season=2022">2022</a>
                </li>
            </ul >
        </nav >
        `;
    }
}

customElements.define('season-dropdown-component', SeasonDropdownComponent);
