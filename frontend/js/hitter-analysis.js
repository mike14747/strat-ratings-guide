async function getData() {
    const url = '/api/hitters/season-list';
    const seasonListJSON = await fetch(url).then((res) => res.json().catch((error) => console.log(error)));

    if (!seasonListJSON) {
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = 'An error occurred fetching data!';
        return;
    }

    const latestSeason = Math.max(...seasonListJSON.map(y => y.h_year));

    const pageHeading = document.getElementById('page-heading');
    pageHeading.innerHTML = `Hitter Analysis (${latestSeason})`;

    // const seasonList = seasonListJSON.map(s => s.h_year);
    // console.log(seasonList);

    const url2 = `/api/hitters/${latestSeason}`;
    const dataJSON = await fetch(url2).then((res) => res.json().catch((error) => console.log(error)));

    if (!dataJSON) {
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = 'An error occurred fetching data!';
        return;
    }

    const thLabels = ['Year', 'Team', 'Hitter', 'Bats', 'INJ', 'AB', 'SO v L', 'BB v L', 'Hit v L', 'OB v L', 'TB v L', 'HR v L', 'wSI v L', 'DP v L', 'wOPS v L', 'SO v R', 'BB v R', 'Hit v R', 'OB v R', 'TB v R', 'HR v R', 'wSI v R', 'DP v R', 'wOPS v R', 'Stealing', 'Speed', 'Bunt', 'H&R', 'CA', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'Fielding', 'RML Team'];
    const thHTMLArr = thLabels.map(th => {
        return `<th>${th}</th>`;
    });
    const thHTML = thHTMLArr.join('');

    const tableDataArr = dataJSON.map(player => (
        `<tr>
            <td>${player.h_year}</td>
            <td class="text-left">${player.real_team}</td>
            <td class="text-left">${player.hitter_name}</td>
            <td>${player.bats}</td>
            <td>${player.injury}</td>
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
            <td class="text-left">${player.fielding}</td>
            <td class="text-left">${player.rml_team_name}</td>
        </tr>`
    ));
    const tableData = tableDataArr.join('');

    const tableContent = `<table class="table small"><thead><tr>${thHTML}</tr></thead><tbody>${tableData}</tbody></table>`;

    const tableContainer = document.getElementById('table-container');
    tableContainer.innerHTML = tableContent;
}

getData();
