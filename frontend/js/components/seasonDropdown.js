"use strict";
class SeasonDropdownComponent extends HTMLElement {
    // eslint-disable-next-line no-useless-constructor
    constructor() {
        super();
        this._data = { seasonList: [], selectedSeason: '', type: '' };
        this._listItems = '';
    }
    static get observedAttributes() {
        return ['data-seasons'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'data-seasons' && oldValue !== newValue && newValue) {
            const parsed = JSON.parse(newValue);
            this._data = parsed;
            this._listItems = this._data.seasonList
                .map((season) => {
                if (season === parseInt(this._data.selectedSeason.toString(), 10)) {
                    return `<li class="viewing">${season}</li>`;
                }
                else {
                    return `<a href="/${this._data.type}-analysis?season=${season}"><li>${season}</li></a>`;
                }
            })
                .join('');
            this.render();
        }
    }
    get dataSeasons() {
        return this._data;
    }
    set dataSeasons(value) {
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
