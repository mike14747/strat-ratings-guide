interface Season {
    year: number;
}

interface Hitter {
    year: number;
    real_team: string;
    name: string;
    bats: string;
    injury?: string | null;
    ab: number;

    so_v_l: number;
    bb_v_l: number;
    hit_v_l: number;
    ob_v_l: number;
    tb_v_l: number;
    hr_v_l: number;
    w_v_l: number;
    dp_v_l: number;
    wops_v_l?: number;

    so_v_r: number;
    bb_v_r: number;
    hit_v_r: number;
    ob_v_r: number;
    tb_v_r: number;
    hr_v_r: number;
    w_v_r: number;
    dp_v_r: number;
    wops_v_r?: number;

    stealing: string;
    spd: number;
    bunt: number;
    h_r: number;

    d_ca: number;
    d_1b: number;
    d_2b: number;
    d_3b: number;
    d_ss: number;
    d_lf: number;
    d_cf: number;
    d_rf: number;

    def_wops_ca_v_l: number;
    def_wops_ca_v_r: number;
    def_wops_1b_v_l: number;
    def_wops_1b_v_r: number;
    def_wops_2b_v_l: number;
    def_wops_2b_v_r: number;
    def_wops_3b_v_l: number;
    def_wops_3b_v_r: number;
    def_wops_ss_v_l: number;
    def_wops_ss_v_r: number;
    def_wops_lf_v_l: number;
    def_wops_lf_v_r: number;
    def_wops_cf_v_l: number;
    def_wops_cf_v_r: number;
    def_wops_rf_v_l: number;
    def_wops_rf_v_r: number;

    fielding: string;
    rml_team_name?: string | null;
}

interface SeasonDropdownElement extends HTMLElement {
    data: {
        type: 'hitter';
        seasonList: number[];
        selectedSeason: number;
    };
}

// dom helper function
function getElement<T extends HTMLElement>(id: string): T {
    const el = document.getElementById(id);
    if (!el) {
        throw new Error(`Element not found: ${id}`);
    }
    return el as T;
}

// utility functions
function displayError(): void {
    getElement<HTMLDivElement>('error-message').textContent =
        'An error occurred fetching data!';
}

function tableToText(tableRows: HTMLElement): string {
    let tableText = '';
    const rows = tableRows.querySelectorAll<HTMLTableRowElement>('tr');

    rows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll<HTMLTableCellElement>('td');

        cells.forEach((cell, cellIndex) => {
            tableText += cell.innerText;
            if (cells.length !== cellIndex + 1) tableText += '\t';
        });

        if (rows.length !== rowIndex + 1) tableText += '\n';
    });

    return tableText;
}

async function copyContent(): Promise<void> {
    const tableRows = getElement<HTMLElement>('data-rows');
    const tableText = tableToText(tableRows);

    await navigator.clipboard.writeText(tableText);
}

async function getData(): Promise<void> {
    const seasonUrl = '/api/hitters/season-list';

    const seasonListJSON: Season[] | undefined = await fetch(seasonUrl)
        .then(res => res.json())
        .catch(error => {
            console.error(error);
            return undefined;
        });

    if (!seasonListJSON) {
        displayError();
        return;
    }

    const seasonList = seasonListJSON.map(s => s.year);
    const latestSeason = Math.max(...seasonList);

    const urlParams = new URLSearchParams(window.location.search);
    const selectedSeason = Number(urlParams.get('season')) || latestSeason;

    if (!selectedSeason) {
        displayError();
        return;
    }

    getElement<HTMLHeadingElement>('page-heading').innerHTML = `Hitter Analysis (${selectedSeason})`;

    // start season-dropdown properties
    getElement<HTMLDivElement>('season-dropdown').innerHTML = '<season-dropdown-component id="seasonDropdown"></season-dropdown-component>';

    const seasonDropdown = getElement<SeasonDropdownElement>('seasonDropdown');

    seasonDropdown.data = {
        type: 'hitter',
        seasonList,
        selectedSeason,
    };
    // end season-dropdown properties

    const dataUrl = `/api/hitters/${selectedSeason}`;

    const dataJSON: Hitter[] | undefined = await fetch(dataUrl)
        .then(res => res.json())
        .catch(err => {
            console.error(err);
            return undefined;
        });

    if (!dataJSON || dataJSON.length === 0) {
        displayError();
        return;
    }

    const copyIcon = '<svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24" height="1.50rem" width="1.50rem"><path d="M9 2 H15 A1 1 0 0 1 16 3 V5 A1 1 0 0 1 15 6 H9 A1 1 0 0 1 8 5 V3 A1 1 0 0 1 9 2 z" /><path d="M8 4H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2v-2M16 4h2a2 2 0 012 2v4M21 14H11" /><path d="M15 10l-4 4 4 4" /></svg>';

    getElement<HTMLDivElement>('copy-button-container').innerHTML = `<button title="Copy to Clipboard" class="btn-copy" onclick="copyContent()">${copyIcon}</button>`;

    getElement<HTMLButtonElement>('copy-button-container')
        .querySelector('button')!
        .addEventListener('click', copyContent);

    const thLabels: string[] = ['Year', 'Team', 'Hitter', 'Bats', 'INJ', 'AB', 'SOvL', 'BBvL', 'HitvL', 'OBvL', 'TBvL', 'HRvL', 'wSIvL', 'DPvL', 'wOPSvL', 'SOvR', 'BBvR', 'HitvR', 'OBvR', 'TBvR', 'HRvR', 'wSIvR', 'DPvR', 'wOPSvR', 'Stealing', 'Speed', 'Bunt', 'H&R', 'CA', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'CAvL', 'CA_R', '1BvL', '1B_R', '2BvL', '2B_R', '3BvL', '3B_R', 'SSvL', 'SS_R', 'LFvL', 'LF_R', 'CFvL', 'CF_R', 'RFvL', 'RF_R', 'Fielding', 'RML Team'];

    const thHTML = thLabels.map(th => `<th>${th}</th>`).join('');

    const tableRowsHTML = dataJSON.map(player => (
        `<tr>
            <td>${player.year}</td>
            <td class="text-left">${player.real_team}</td>
            <td class="text-left ${!player.wops_v_l || !player.wops_v_r ? 'missing-data' : ''}">${player.name}</td>
            <td>${player.bats}</td>
            <td>${player.injury ?? ''}</td>
            <td>${player.ab}</td>
            <td>${player.so_v_l}</td>
            <td>${player.bb_v_l}</td>
            <td>${player.hit_v_l}</td>
            <td>${player.ob_v_l}</td>
            <td>${player.tb_v_l}</td>
            <td>${player.hr_v_l}</td>
            <td>${player.w_v_l}</td>
            <td>${player.dp_v_l}</td>
            <td><b>${player.wops_v_l}<b></td>
            <td>${player.so_v_r}</td>
            <td>${player.bb_v_r}</td>
            <td>${player.hit_v_r}</td>
            <td>${player.ob_v_r}</td>
            <td>${player.tb_v_r}</td>
            <td>${player.hr_v_r}</td>
            <td>${player.w_v_r}</td>
            <td>${player.dp_v_r}</td>
            <td><b>${player.wops_v_r}</b></td>
            <td class="text-left">${player.stealing}</td>
            <td>${player.spd}</td>
            <td>${player.bunt}</td>
            <td>${player.h_r}</td>
            <td>${player.d_ca}</td>
            <td>${player.d_1b}</td>
            <td>${player.d_2b}</td>
            <td>${player.d_3b}</td>
            <td>${player.d_ss}</td>
            <td>${player.d_lf}</td>
            <td>${player.d_cf}</td>
            <td>${player.d_rf}</td>
            <td>${player.def_wops_ca_v_l}</td>
            <td>${player.def_wops_ca_v_r}</td>
            <td>${player.def_wops_1b_v_l}</td>
            <td>${player.def_wops_1b_v_r}</td>
            <td>${player.def_wops_2b_v_l}</td>
            <td>${player.def_wops_2b_v_r}</td>
            <td>${player.def_wops_3b_v_l}</td>
            <td>${player.def_wops_3b_v_r}</td>
            <td>${player.def_wops_ss_v_l}</td>
            <td>${player.def_wops_ss_v_r}</td>
            <td>${player.def_wops_lf_v_l}</td>
            <td>${player.def_wops_lf_v_r}</td>
            <td>${player.def_wops_cf_v_l}</td>
            <td>${player.def_wops_cf_v_r}</td>
            <td>${player.def_wops_rf_v_l}</td>
            <td>${player.def_wops_rf_v_r}</td>
            <td class="text-left">${player.fielding}</td>
            <td class="text-left ${!player.rml_team_name ? 'missing-data' : ''}">${player.rml_team_name}</td>
        </tr>`
    )).join('');

    getElement<HTMLDivElement>('table-container').innerHTML = `<table class="table small"><thead><tr>${thHTML}</tr></thead><tbody id="data-rows">${tableRowsHTML}</tbody></table>`;
}

getData();
