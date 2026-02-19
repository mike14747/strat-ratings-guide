class SeasonDropdownComponent extends HTMLElement {
    private _data: any;
    private _listItems: string;

    constructor() {
        super();
        this._data = {};
        this._listItems = '';
    }

    static get observedAttributes() {
        return ['data-seasons'];
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === 'data-seasons' && oldValue !== newValue) {
            this._data = JSON.parse(newValue);
            this._listItems = this._data.seasonList.map((season: number) => {
                if (season === parseInt(this._data.selectedSeason)) {
                    return `<li class="viewing">${season}</li>`;
                } else {
                    return `<a href="/${this._data.type}-analysis?season=${season}"><li>${season}</li></a>`;
                }
            }).join('');
            this.render();
        }
    }

    get dataSeasons() {
        return this._data;
    }

    set dataSeasons(value: any) {
        this.setAttribute('data-seasons', JSON.stringify(value));
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
