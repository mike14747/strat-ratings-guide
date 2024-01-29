class SeasonDropdownComponent extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
        <div class="dropdown">
            <button class="dropbtn">Season<i class="down"></i></button>
            <ul class="dropdown-content">
                <a href="/hitter-analysis?season=2023"><li>2023</li></a>
                <a href="/hitter-analysis?season=2022"><li>2022</li></a>
                <a href="/hitter-analysis?season=2021"><li>2021</li></a>
                <a href="/hitter-analysis?season=2020"><li>2020</li></a>
                <a href="/hitter-analysis?season=2019"><li>2019</li></a>
                <a href="/hitter-analysis?season=2018"><li>2018</li></a>
            </ul>
        </div>
        `;
    }
}

customElements.define('season-dropdown-component', SeasonDropdownComponent);
