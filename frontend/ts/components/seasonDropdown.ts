// frontend/js/components/seasonDropdown.ts

// Type describing the data structure from your database
type SeasonData = {
    type: string;
    seasonList: number[];
    selectedSeason: number | string;
};

// Extend HTMLElement to type the element properly
type SeasonDropdownElement = HTMLElement & {
    data: SeasonData;
};

class SeasonDropdownComponent extends HTMLElement {
    private _data!: SeasonData; // definite assignment operator avoids null issues
    private _listItems: string = '';

    // No constructor needed — ESLint won't complain

    // Setter for database-driven population
    set data(value: SeasonData) {
        this._data = value;

        if (!this._data.seasonList || this._data.seasonList.length === 0) {
            console.warn('Season list is empty!', this._data);
            this._listItems = '';
        } else {
            const selected = parseInt(this._data.selectedSeason.toString(), 10);
            this._listItems = this._data.seasonList
                .map(season => {
                    if (season === selected) {
                        return `<li class="viewing">${season}</li>`;
                    } else {
                        return `<a href="/${this._data.type}-analysis?season=${season}"><li>${season}</li></a>`;
                    }
                })
                .join('');
        }

        this.render();
    }

    get data(): SeasonData {
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

export type { SeasonDropdownElement, SeasonData };
