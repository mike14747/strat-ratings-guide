"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// dom helper function
function getElement(id) {
    const el = document.getElementById(id);
    if (!el) {
        throw new Error(`Element not found: ${id}`);
    }
    return el;
}
// utility functions
function displayError() {
    getElement('error-message').textContent =
        'An error occurred fetching data!';
}
function tableToText(tableRows) {
    let tableText = '';
    const rows = tableRows.querySelectorAll('tr');
    rows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll('td');
        cells.forEach((cell, cellIndex) => {
            tableText += cell.innerText;
            if (cells.length !== cellIndex + 1)
                tableText += '\t';
        });
        if (rows.length !== rowIndex + 1)
            tableText += '\n';
    });
    return tableText;
}
function copyContent() {
    return __awaiter(this, void 0, void 0, function* () {
        const tableRows = getElement('data-rows');
        const tableText = tableToText(tableRows);
        yield navigator.clipboard.writeText(tableText);
    });
}
function getData() {
    return __awaiter(this, void 0, void 0, function* () {
        const seasonUrl = '/api/hitters/season-list';
        const seasonListJSON = yield fetch(seasonUrl)
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
        getElement('page-heading').innerHTML = `Hitter Analysis (${selectedSeason})`;
        // start season-dropdown properties
        getElement('season-dropdown').innerHTML = '<season-dropdown-component id="seasonDropdown"></season-dropdown-component>';
        const seasonDropdown = getElement('seasonDropdown');
        seasonDropdown.data = {
            type: 'hitter',
            seasonList,
            selectedSeason,
        };
        // end season-dropdown properties
        const dataUrl = `/api/hitters/${selectedSeason}`;
        const dataJSON = yield fetch(dataUrl)
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
        getElement('copy-button-container').innerHTML = `<button title="Copy to Clipboard" class="btn-copy" onclick="copyContent()">${copyIcon}</button>`;
        getElement('copy-button-container')
            .querySelector('button')
            .addEventListener('click', copyContent);
        const thLabels = ['Year', 'Team', 'Hitter', 'Bats', 'INJ', 'AB', 'SOvL', 'BBvL', 'HitvL', 'OBvL', 'TBvL', 'HRvL', 'wSIvL', 'DPvL', 'wOPSvL', 'SOvR', 'BBvR', 'HitvR', 'OBvR', 'TBvR', 'HRvR', 'wSIvR', 'DPvR', 'wOPSvR', 'Stealing', 'Speed', 'Bunt', 'H&R', 'CA', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'CAvL', 'CA_R', '1BvL', '1B_R', '2BvL', '2B_R', '3BvL', '3B_R', 'SSvL', 'SS_R', 'LFvL', 'LF_R', 'CFvL', 'CF_R', 'RFvL', 'RF_R', 'Fielding', 'RML Team'];
        const thHTML = thLabels.map(th => `<th>${th}</th>`).join('');
        const tableRowsHTML = dataJSON.map(player => {
            var _a;
            return (`<tr>
            <td>${player.year}</td>
            <td class="text-left">${player.real_team}</td>
            <td class="text-left ${!player.wops_v_l || !player.wops_v_r ? 'missing-data' : ''}">${player.name}</td>
            <td>${player.bats}</td>
            <td>${(_a = player.injury) !== null && _a !== void 0 ? _a : ''}</td>
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
        </tr>`);
        }).join('');
        getElement('table-container').innerHTML = `<table class="table small"><thead><tr>${thHTML}</tr></thead><tbody id="data-rows">${tableRowsHTML}</tbody></table>`;
    });
}
getData();
