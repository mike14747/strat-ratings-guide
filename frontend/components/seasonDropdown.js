class SeasonDropdownComponent extends HTMLElement {
    constructor() {
        super();
        this._data = {};
    }

    static get observedAttributes() {
        return ['data'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'data' && oldValue !== newValue) {
            this._data = JSON.parse(newValue);
            this._listItems = this._data.seasonList.map(season => {
                if (season === parseInt(this._data.selectedSeason)) {
                    return `<li class="viewing">${season}</li>`;
                } else {
                    return `<a href="/${this._data.type}-analysis?season=${season}"><li>${season}</li></a>`;
                }
            }).join('');
            this.render();
        }
    }

    get data() {
        return this._data;
    }

    set data(value) {
        this.setAttribute('data', JSON.stringify(value));
    }

    render() {
        this.innerHTML = `
        <div class="dropdown">
            <button class="dropbtn">Season<i class="down"></i></button>
            <ul class="dropdown-content">
                ${this._listItems}
            </ul>
        </div>
        `;
    }
}

customElements.define('season-dropdown-component', SeasonDropdownComponent);
