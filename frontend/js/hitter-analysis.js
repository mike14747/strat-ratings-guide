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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// dom helper function
function getElement(id) {
    var el = document.getElementById(id);
    if (!el) {
        throw new Error("Element not found: ".concat(id));
    }
    return el;
}
// utility functions
function displayError() {
    getElement('error-message').textContent =
        'An error occurred fetching data!';
}
function tableToText(tableRows) {
    var tableText = '';
    var rows = tableRows.querySelectorAll('tr');
    rows.forEach(function (row, rowIndex) {
        var cells = row.querySelectorAll('td');
        cells.forEach(function (cell, cellIndex) {
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
    return __awaiter(this, void 0, void 0, function () {
        var tableRows, tableText;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tableRows = getElement('data-rows');
                    tableText = tableToText(tableRows);
                    return [4 /*yield*/, navigator.clipboard.writeText(tableText)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function getData() {
    return __awaiter(this, void 0, void 0, function () {
        var seasonUrl, seasonListJSON, seasonList, latestSeason, urlParams, selectedSeason, seasonDropdown, dataUrl, dataJSON, copyIcon, thLabels, thHTML, tableRowsHTML;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    seasonUrl = '/api/hitters/season-list';
                    return [4 /*yield*/, fetch(seasonUrl)
                            .then(function (res) { return res.json(); })
                            .catch(function (error) {
                            console.error(error);
                            return undefined;
                        })];
                case 1:
                    seasonListJSON = _a.sent();
                    if (!seasonListJSON) {
                        displayError();
                        return [2 /*return*/];
                    }
                    seasonList = seasonListJSON.map(function (s) { return s.year; });
                    latestSeason = Math.max.apply(Math, seasonList);
                    urlParams = new URLSearchParams(window.location.search);
                    selectedSeason = Number(urlParams.get('season')) || latestSeason;
                    if (!selectedSeason) {
                        displayError();
                        return [2 /*return*/];
                    }
                    getElement('page-heading').innerHTML = "Hitter Analysis (".concat(selectedSeason, ")");
                    // start season-dropdown properties
                    getElement('season-dropdown').innerHTML = '<season-dropdown-component id="seasonDropdown"></season-dropdown-component>';
                    seasonDropdown = getElement('seasonDropdown');
                    seasonDropdown.data = {
                        type: 'hitter',
                        seasonList: seasonList,
                        selectedSeason: selectedSeason,
                    };
                    dataUrl = "/api/hitters/".concat(selectedSeason);
                    return [4 /*yield*/, fetch(dataUrl)
                            .then(function (res) { return res.json(); })
                            .catch(function (err) {
                            console.error(err);
                            return undefined;
                        })];
                case 2:
                    dataJSON = _a.sent();
                    if (!dataJSON || dataJSON.length === 0) {
                        displayError();
                        return [2 /*return*/];
                    }
                    copyIcon = '<svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24" height="1.50rem" width="1.50rem"><path d="M9 2 H15 A1 1 0 0 1 16 3 V5 A1 1 0 0 1 15 6 H9 A1 1 0 0 1 8 5 V3 A1 1 0 0 1 9 2 z" /><path d="M8 4H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2v-2M16 4h2a2 2 0 012 2v4M21 14H11" /><path d="M15 10l-4 4 4 4" /></svg>';
                    getElement('copy-button-container').innerHTML = "<button title=\"Copy to Clipboard\" class=\"btn-copy\" onclick=\"copyContent()\">".concat(copyIcon, "</button>");
                    getElement('copy-button-container')
                        .querySelector('button')
                        .addEventListener('click', copyContent);
                    thLabels = ['Year', 'Team', 'Hitter', 'Bats', 'INJ', 'AB', 'SOvL', 'BBvL', 'HitvL', 'OBvL', 'TBvL', 'HRvL', 'wSIvL', 'DPvL', 'wOPSvL', 'SOvR', 'BBvR', 'HitvR', 'OBvR', 'TBvR', 'HRvR', 'wSIvR', 'DPvR', 'wOPSvR', 'Stealing', 'Speed', 'Bunt', 'H&R', 'CA', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'CAvL', 'CA_R', '1BvL', '1B_R', '2BvL', '2B_R', '3BvL', '3B_R', 'SSvL', 'SS_R', 'LFvL', 'LF_R', 'CFvL', 'CF_R', 'RFvL', 'RF_R', 'Fielding', 'RML Team'];
                    thHTML = thLabels.map(function (th) { return "<th>".concat(th, "</th>"); }).join('');
                    tableRowsHTML = dataJSON.map(function (player) {
                        var _a;
                        return ("<tr>\n            <td>".concat(player.year, "</td>\n            <td class=\"text-left\">").concat(player.real_team, "</td>\n            <td class=\"text-left ").concat(!player.wops_v_l || !player.wops_v_r ? 'missing-data' : '', "\">").concat(player.name, "</td>\n            <td>").concat(player.bats, "</td>\n            <td>").concat((_a = player.injury) !== null && _a !== void 0 ? _a : '', "</td>\n            <td>").concat(player.ab, "</td>\n            <td>").concat(player.so_v_l, "</td>\n            <td>").concat(player.bb_v_l, "</td>\n            <td>").concat(player.hit_v_l, "</td>\n            <td>").concat(player.ob_v_l, "</td>\n            <td>").concat(player.tb_v_l, "</td>\n            <td>").concat(player.hr_v_l, "</td>\n            <td>").concat(player.w_v_l, "</td>\n            <td>").concat(player.dp_v_l, "</td>\n            <td><b>").concat(player.wops_v_l, "<b></td>\n            <td>").concat(player.so_v_r, "</td>\n            <td>").concat(player.bb_v_r, "</td>\n            <td>").concat(player.hit_v_r, "</td>\n            <td>").concat(player.ob_v_r, "</td>\n            <td>").concat(player.tb_v_r, "</td>\n            <td>").concat(player.hr_v_r, "</td>\n            <td>").concat(player.w_v_r, "</td>\n            <td>").concat(player.dp_v_r, "</td>\n            <td><b>").concat(player.wops_v_r, "</b></td>\n            <td class=\"text-left\">").concat(player.stealing, "</td>\n            <td>").concat(player.spd, "</td>\n            <td>").concat(player.bunt, "</td>\n            <td>").concat(player.h_r, "</td>\n            <td>").concat(player.d_ca, "</td>\n            <td>").concat(player.d_1b, "</td>\n            <td>").concat(player.d_2b, "</td>\n            <td>").concat(player.d_3b, "</td>\n            <td>").concat(player.d_ss, "</td>\n            <td>").concat(player.d_lf, "</td>\n            <td>").concat(player.d_cf, "</td>\n            <td>").concat(player.d_rf, "</td>\n            <td>").concat(player.def_wops_ca_v_l, "</td>\n            <td>").concat(player.def_wops_ca_v_r, "</td>\n            <td>").concat(player.def_wops_1b_v_l, "</td>\n            <td>").concat(player.def_wops_1b_v_r, "</td>\n            <td>").concat(player.def_wops_2b_v_l, "</td>\n            <td>").concat(player.def_wops_2b_v_r, "</td>\n            <td>").concat(player.def_wops_3b_v_l, "</td>\n            <td>").concat(player.def_wops_3b_v_r, "</td>\n            <td>").concat(player.def_wops_ss_v_l, "</td>\n            <td>").concat(player.def_wops_ss_v_r, "</td>\n            <td>").concat(player.def_wops_lf_v_l, "</td>\n            <td>").concat(player.def_wops_lf_v_r, "</td>\n            <td>").concat(player.def_wops_cf_v_l, "</td>\n            <td>").concat(player.def_wops_cf_v_r, "</td>\n            <td>").concat(player.def_wops_rf_v_l, "</td>\n            <td>").concat(player.def_wops_rf_v_r, "</td>\n            <td class=\"text-left\">").concat(player.fielding, "</td>\n            <td class=\"text-left ").concat(!player.rml_team_name ? 'missing-data' : '', "\">").concat(player.rml_team_name, "</td>\n        </tr>"));
                    }).join('');
                    getElement('table-container').innerHTML = "<table class=\"table small\"><thead><tr>".concat(thHTML, "</tr></thead><tbody id=\"data-rows\">").concat(tableRowsHTML, "</tbody></table>");
                    return [2 /*return*/];
            }
        });
    });
}
getData();
