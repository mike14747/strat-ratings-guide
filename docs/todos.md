# Todos

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
