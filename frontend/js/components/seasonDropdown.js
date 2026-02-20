// frontend/js/components/seasonDropdown.ts
class SeasonDropdownComponent extends HTMLElement {
    constructor() {
        super(...arguments);
        this._listItems = '';
    }
    // No constructor needed — ESLint won't complain
    // Setter for database-driven population
    set data(value) {
        this._data = value;
        if (!this._data.seasonList || this._data.seasonList.length === 0) {
            console.warn('Season list is empty!', this._data);
            this._listItems = '';
        }
        else {
            const selected = parseInt(this._data.selectedSeason.toString(), 10);
            this._listItems = this._data.seasonList
                .map(season => {
                if (season === selected) {
                    return `<li class="viewing">${season}</li>`;
                }
                else {
                    return `<a href="/${this._data.type}-analysis?season=${season}"><li>${season}</li></a>`;
                }
            })
                .join('');
        }
        this.render();
    }
    get data() {
        return this._data;
    }
    // Render dropdown HTML
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
// Define the custom element once
if (!customElements.get('season-dropdown-component')) {
    customElements.define('season-dropdown-component', SeasonDropdownComponent);
}
export {};
