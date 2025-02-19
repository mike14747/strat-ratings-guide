function displayError() {
    document.getElementById('error-message').textContent = 'An error occurred fetching data!';
}

function tableToText(tableRows) {
    let tableText = '';
    const rows = tableRows.querySelectorAll('tr');

    rows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll('td');
        cells.forEach((cell, cellIndex) => {
            tableText += cell.innerText; // Use tab as a delimiter
            if (cells.length !== cellIndex + 1) tableText += '\t';
        });
        if (rows.length !== rowIndex + 1) tableText += '\n';
    });

    return tableText;
}

// eslint-disable-next-line no-unused-vars
async function copyContent() {
    const tableRows = document.getElementById('data-rows');
    const tableText = tableToText(tableRows);

    await navigator.clipboard.writeText(tableText);
}

async function getData() {
    const url = '/api/pitchers/season-list';
    const seasonListJSON = await fetch(url).then((res) => res.json().catch((error) => console.error(error)));

    if (!seasonListJSON) {
        displayError();
        return;
    }

    const seasonList = seasonListJSON.map(s => s.year);

    const latestSeason = Math.max(...seasonList);

    const urlParams = new URLSearchParams(window.location.search);
    const selectedSeason = urlParams.get('season') || latestSeason;

    if (!selectedSeason) {
        displayError();
        return;
    }

    document.getElementById('page-heading').innerHTML = `Pitcher Analysis (${selectedSeason})`;

    // start season-dropdown properties
    document.getElementById('season-dropdown').innerHTML = '<season-dropdown-component id="seasonDropdown"></season-dropdown-component>';

    const data = {
        type: 'pitcher',
        seasonList,
        selectedSeason,
    };

    const seasonDropdown = document.getElementById('seasonDropdown');
    seasonDropdown.data = data;
    // end season-dropdown properties

    const url2 = `/api/pitchers/${parseInt(selectedSeason)}`;
    const dataJSON = await fetch(url2).then((res) => res.json().catch((error) => console.error(error)));

    if (!dataJSON) {
        displayError();
        return;
    } else if (dataJSON.length === 0) {
        document.getElementById('error-message').textContent = 'An error occurred fetching data!';
        return;
    }

    const copyIcon = '<svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24" height="1.50rem" width="1.50rem"><path d="M9 2 H15 A1 1 0 0 1 16 3 V5 A1 1 0 0 1 15 6 H9 A1 1 0 0 1 8 5 V3 A1 1 0 0 1 9 2 z" /><path d="M8 4H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2v-2M16 4h2a2 2 0 012 2v4M21 14H11" /><path d="M15 10l-4 4 4 4" /></svg>';

    document.getElementById('copy-button-container').innerHTML = `<button title="Copy to Clipboard" class="btn-copy" onclick="copyContent()">${copyIcon}</button>`;

    const thLabels = ['Year', 'Team', 'Pitcher', 'Throws', 'IP', 'SO v L', 'BB v L', 'Hit v L', 'OB v L', 'TB v L', 'HR v L', 'si v L', 'DP v L', 'wOPS v L', 'SO v R', 'BB v R', 'Hit v R', 'OB v R', 'TB v R', 'HR v R', 'si v R', 'DP v R', 'wOPS v R', 'Hold', 'Endurance', 'Fielding', 'Balk', 'WP', 'Batting', 'Stl', 'Spd', 'RML Team'];

    const thHTMLArr = thLabels.map(th => {
        return `<th>${th}</th>`;
    });
    const thHTML = thHTMLArr.join('');

    const tableDataArr = dataJSON.map(player => (
        `<tr>
            <td>${player.year}</td>
            <td class="text-left">${player.real_team}</td>
            <td class="text-left ${!player.wops_v_l || !player.wops_v_r ? 'missing-data' : ''}">${player.name}</td>
            <td>${player.throws}</td>
            <td>${player.ip}</td>
            <td>${player.so_v_l}</td>
            <td>${player.bb_v_l}</td>
            <td>${player.hit_v_l}</td>
            <td>${player.ob_v_l}</td>
            <td>${player.tb_v_l}</td>
            <td>${player.hr_v_l}</td>
            <td>${player.bp_v_l}</td>
            <td>${player.dp_v_l}</td>
            <td><b>${player.wops_v_l}</b></td>
            <td>${player.so_v_r}</td>
            <td>${player.bb_v_r}</td>
            <td>${player.hit_v_r}</td>
            <td>${player.ob_v_r}</td>
            <td>${player.tb_v_r}</td>
            <td>${player.hr_v_r}</td>
            <td>${player.bp_v_r}</td>
            <td>${player.dp_v_r}</td>
            <td><b>${player.wops_v_r}</b></td>
            <td>${player.hold}</td>
            <td class="text-left">${player.endurance}</td>
            <td class="text-left">${player.fielding}</td>
            <td>${player.balk}</td>
            <td>${player.wp}</td>
            <td>${player.batting_b}</td>
            <td>${player.stl}</td>
            <td>${player.spd}</td>
            <td class="text-left ${!player.rml_team_name ? 'missing-data' : ''}">${player.rml_team_name}</td>
        </tr>`
    ));
    const tableData = tableDataArr.join('');

    const tableContent = `<table class="table small"><thead><tr>${thHTML}</tr></thead><tbody id="data-rows">${tableData}</tbody></table>`;

    const tableContainer = document.getElementById('table-container');
    tableContainer.innerHTML = tableContent;
}

getData();
