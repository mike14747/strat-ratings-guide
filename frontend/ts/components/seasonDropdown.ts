type SeasonData = {
    seasonList: number[];
    selectedSeason: string | number;
    type: string;
};

class SeasonDropdownComponent extends HTMLElement {
    private _data: SeasonData = { seasonList: [], selectedSeason: '', type: '' };
    private _listItems: string = '';

    // eslint-disable-next-line no-useless-constructor
    constructor() {
        super();
    }

    static get observedAttributes() {
        return ['data-seasons'];
    }

    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
        if (name === 'data-seasons' && oldValue !== newValue && newValue) {
            const parsed: SeasonData = JSON.parse(newValue);
            this._data = parsed;

            this._listItems = this._data.seasonList
                .map((season: number) => {
                    if (season === parseInt(this._data.selectedSeason.toString(), 10)) {
                        return `<li class="viewing">${season}</li>`;
                    } else {
                        return `<a href="/${this._data.type}-analysis?season=${season}"><li>${season}</li></a>`;
                    }
                })
                .join('');

            this.render();
        }
    }

    get dataSeasons(): SeasonData {
        return this._data;
    }

    set dataSeasons(value: SeasonData) {
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
