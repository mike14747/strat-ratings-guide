# Todos

I'd like to write some functions to have exceljs do a lot of the **Getting "Hitters.xlsx" ready** and **Getting "Pitchers.xlsx" ready** spreadsheet modifications once the ratings disk arrives.

---

I have an excel file with a single sheet called: "Hitters.xlsx". I'd like to use exceljs to make the following modifications to the file.

-   Open the Hitters.xlsx file.
-   Rename the only sheet to "Original Hitters", then copy that sheet to the end and rename the copied sheet to "Carded Hitters".
-   Verify that the original headings are: TM, Location, HITTERS, AB, W, SO v lhp, BBv lhp, HIT v lhp, OB v lhp, TB v lhp, HR v lhp, BP v lhp, CL v lhp, DP v lhp, SO v rhp, BB v rhp, HIT v rhp, OB v rhp, TB v rhp, HR v rhp, BP v rhp, CL v rhp, DP v rhp, STEALING, STL, SPD, B, H, INJ, CA, 1B, 2B, 3B, SS, LF, CF, RF, FIELDING
-   From this point forward, I want to start modifying the "Carded Hitters" sheet only and not touch the original "Original Hitters" sheet.
-   Set the font for the whole sheet to "Calibri" and "12pt".
-   Set the top row to a light gray background, then freeze the top row.
-   Set the row height for all rows to "18.00".
-   Set "All Borders" around every cell that has data.
-   Remove all the "+" signs from cells in the "CL v lhp" and "CL v rhp" columns (if there are any).
-   Remove all rows that have an "M" or an "X" in the "Location" column.
-   Remove all rows where the value in the "AB" column is less than 100.
-   Insert a "Year" column as the first column, then set the value for each cell in that column to be the current 4-digit year minus 1 (eg: 2025 if the real year is 2026).
-   Add an "rml_team_id" column at the far right, but leave all cells in that column blank.
-   Move the "INJ" column to immediately after the "HITTERS" column.
-   Horizontally "Center" and "left-align" the columns as follows: all columns should be center aligned except: HITTERS, STEALING and FIELDING (which should be left-aligned).
-   Delete the "W" column.
-   Column names must be: Year, TM, Location, HITTERS, INJ, AB, SO_v_lhp, BB_v_lhp, HIT_v_lhp, OB_v_lhp, TB_v_lhp, HR_v_lhp, BP_v_lhp, CL_v_lhp, DP_v_lhp, SO_v_rhp, BB_v_rhp, HIT_v_rhp, OB_v_rhp, TB_v_rhp, HR_v_rhp, BP_v_rhp, CL_v_rhp, DP_v_rhp, STEALING, STL, SPD, B, H, d_CA, d_1B, d_2B, d_3B, d_SS, d_LF, d_CF, d_RF, FIELDING, rml_team_id




-   Make sure each multi-team hitter is listed in the regular **/data/hitter_ratings.xlsx** file as being on team **TOT**.

---

Get the login system working.

Convert the frontend of the app to typescript (maybe).

Add a bundler (Vite?) if I ever want to move the app to an online server.

---

## Done

Get the pitcher analysis page working as the hitter analysis page is.

Add season list dropdowns to the hitter and pitcher analysis pages. But, I need to figure out how to send data to the season list dropdown component.

Convert all colors in globals.css to css variables.

Figure out how to have a button to copy all hitter and pitcher data.

Figure out how to upload/process .xlsx files instead of .csv files. (I've chosen exceljs)

Style the buttons.

Remove bcryptjs and implement node functions instead.

Convert the nav dropdown to the same as the season dropdown.

Change the "Copy Data" button to some sort of icon.

Convert all h_year and p_year references to just "year". Also convert all hitter_name and pitcher_name references to just "name".

Get the multi-team uploads working for hitters and pitchers.

When uploading multi-team hitters and pitchers, letter case within player names is important. I had an issue with "Dejong,P" vs "DeJong,P" where it wasn't totaling his ABs **calculateHitterValues.js**. Somehow, I need to set something up to convert to lower case, or just make a note to only have the first letter of last names capitalized in **multi_team_hitters.csv** and **multi_team_pitchers.csv**.

Should I move the cardedPlayers.js data into the database? Done... I moved it.

Figure out how to make hitter injury ratings 0 instead of null when they played in every game.

Figure out how to make the "Copy Data" button not add an extra tab and row to the end of the columns and rows.

Convert the server-side of the app to typescript.

Move the calculation for pitcher defensive impact on wOPS from the function in calculatePitcherValues.ts to use the new fieldingWopsCalculate.ts function.

Fix the bug in why the database is storing hitters with a zero injury rating as 'null'. Also, set the frontend to display a blank value in the injury cell for seasons that predated the ratings guide having injury ratings.
