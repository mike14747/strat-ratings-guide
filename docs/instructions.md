# Instructions for handling new Ratings Disks

## New ballpark data into the database

-   Convert **Ballpark.txt** team by team singles/homers data to **data/bp_ratings.xlsx**.
-   The formatted data column needs to be added to **data/ratings_guide_db(seeds).sql**.
-   Add the entire **data/ratings_guide_db(seeds).sql** file into the **ratings_guide_db** database with MySQL Workbench using copy/paste/execute.

---

## Convert the hitter and pitcher data files into database ready data

### Getting "Hitters.xlsx" ready

-   Open the **Hitters.xlsx** file that came in the ratings disk.
-   Rename the lone sheet to **Original Hitters**, then copy it to the end and rename the copied sheet to **Carded Hitters**.
-   From this point forward, you'll be working only with the **Carded Hitters** sheet.
-   Set the font to **Calibri** and **12pt**.
-   Set the top row to a light gray background, then freeze the top row in each file.
-   Set the row height for all rows to **18.00**.
-   Set **All Borders** around the data.
-   "Center" and ""left-align" the columns as needed.
-   Remove all the **+** signs from the **CL v lhp** and **CL v rhp** columns (may no longer need to be done).
-   Remove all hitters that have an **M** in the **Location** column. Most players with an **X** in the **Location** column should be deleted too. **HOWEVER**, you might find that a couple low IP, carded pitchers might have been part of the X players group and have to be brought back in from the original file.
-   Remove all uncarded hitters (those without 100+ AB in full 162 game seasons).
-   Make sure the Strat and baseball-reference real team abbreviations haven't changed from what they've been. **eg**: I thought St Louis might have changed from **STN** to **SLN**... but I'm not sure about that. I'm in the process of changing all the data files that use this abbreviation to **SLN**. Also, I need to remove the extra St Louis row I've added to my home pc's **real_teams.xlsx** file and change the original St Louis to SLN.
-   Insert a **Year** column to the beginning of each file (the MLB year).
-   Add an **rml_team_id** column to the end of each file.
-   The **INJ** column might have to get moved to its correct place (immediately after the **HITTERS** column).
-   Delete the **W** column (starting with the 2022 season). This is actual real life walks and is not needed.
 
Column names for the **Hitters.xls**, _hitter_ratings.xlsx_ and especially **hitter_ratings.csv** files must use these exact column names (with no spaces and none of them beginning with a number) because of the csv parser that's being used:

-   Year, TM, Location, HITTERS, INJ, AB, SO_v_lhp, BB_v_lhp, HIT_v_lhp, OB_v_lhp, TB_v_lhp, HR_v_lhp, BP_v_lhp, CL_v_lhp, DP_v_lhp, SO_v_rhp, BB_v_rhp, HIT_v_rhp, OB_v_rhp, TB_v_rhp, HR_v_rhp, BP_v_rhp, CL_v_rhp, DP_v_rhp, STEALING, STL, SPD, B, H, d_CA, d_1B, d_2B, d_3B, d_SS, d_LF, d_CF, d_RF, FIELDING, rml_team_id

### Getting "Pitchers.xlsx" ready

-   Open the **Pitchers.xlsx** file that came in the ratings disk.
-   Rename the lone sheet to **Original Pitchers**, then copy it to the end and rename the copied sheet to **Carded Pitchers**.
-   From this point forward, you'll be working only with the **Carded Pitchers** sheet.
-   Set the font to **Calibri** and **12pt**.
-   Set the top row to a light gray background, then freeze the top row in each file.
-   Set the row height for all rows to **18.00**.
-   Set **All Borders** around the data.
-   "Center" and ""left-align" the columns as needed.
-   Remove all the **+** signs from the **Hold** column (may no longer need to be done).
-   Remove all pitchers that have an **M** in the **Location** column. Most pitchers with an **X** in the **Location** column should be deleted too. **HOWEVER**, you might find that a couple low IP, carded pitchers might have been part of the X players group and have to be brought back in from the original file.
-   Remove all uncarded pitchers.
-   Make sure the Strat and baseball-reference real team abbreviations haven't changed from what they've been. **eg**: I thought St Louis might have changed from **STN** to **SLN**... but I'm not sure about that. I'm in the process of changing all the data files that use this abbreviation to **SLN**. Also, I need to remove the extra St Louis row I've added to my home pc's **real**teams.xlsx** file and change the original St Louis to SLN.
-   Insert a **Year** column to the beginning of each file (the MLB year).
-   Add an **rml_team_id** column to the end of each file.
-   To fix an issue where Excel formats the **FIELD** column as dates once the file is closed, add an apostrophe as a prefix to each pitcher's fielding rating... **eg**: **'3e21**. The apostrophe will be removed as the data is getting uploaded and it will keep Excel from formatting the column as dates.

Column names for the **Pitchers.xls**, **data/pitcher_ratings.xlsx** and especially **pitcher_ratings.csv** files must use these exact column names (with no spaces and none of them beginning with a number) because of the csv parser that's being used:

-   Year, TM, Location, PITCHERS, IP, SO_v_l, BB_v_l, HIT_v_l, OB_v_l, TB_v_l, HR_v_l, BP_v_l, DP_v_l, SO_v_r, BB_v_r, HIT_v_r, OB_v_r, TB_v_r, HR_v_r, BP_v_r, DP_v_r, HO, ENDURANCE, FIELD, BK, WP, BAT_B, STL, SPD, rml_team_id

**NOTES** (for both **Hitters.xlsx** and **Pitchers.xlsx**):
-   It's no longer necessary to rename the **Location** column to **real_team_id**_**, since that is now calculated by the app when uploading data. This is confirmed to be true. In fact, changing the name from **Location** will now generate an error from the Joi schema validation.
-   It's also no longer necessary to change the **TM** column to reflect my preferred team abbreviations (eg: ARIZ instead of ARN) since that is now converted by the app when uploading data.

>   **IMPORTANT** (for both **Hitters.xlsx** and **Pitchers.xlsx**): Every hitter and pitcher that played for multiple teams needs to have their **TM** column set to **TOT**. In a normal season, there could be well over 100 players that need this team change. But, it's important for now because of the bp stadium ratings for each team have such an impact on the wOPS numbers. Multi-team players will not have wOPS ratings unless they also have their multi-team breakdowns added to **data/multi_team_hitters.xlsx** and **data/multi_team_pitchers.xlsx**.

---

## Get RML team ids into the ratings guide

This process has multiple parts.

### Update the Carded Players list

-   Get a list of all carded player names from the Master Roster using this formula: **=""""&A2&""","** on the name column. I use double quotes because some names include single quotes.
-   To convert carded player names from the Master Roster, I use Quokka in VSCode, pasting the names list into the **allPlayers** array, then execute this array method:

```js
const allPlayers = [
    "Abbott, Andrew", // as an example... it will become "Abbot,A"
    // the carded players from the Master Roster go here
];

allPlayers.forEach((player, index) => {
    const nameParts = player.split(', ');
    allPlayers[index] = nameParts[0] + ',' + nameParts[1][0];
});

console.log(allPlayers);
```

-   Copy the abbreviated names (the output of the above step) into the **/data/carded_players_abbrev.xlsx** file. The first and last player names can be trimmed manually to remove the single quote around the player names and the trailing comma. The rest of the players should be done using **Find/Replace**. First do it using "2 spaces and a single quote" and then using "single quote and a comma"... both times replacing with nothing.
-   Add the RML team (which will be in the same order as the player list from the Master Roster) for each carded player to the **/data/carded_players_abbrev.xlsx** file.
-   The "formatted" column data will become the data in **/controllers/utils/cardedPlayers.js** and will need to be refreshed each season.

After viewing the processed rating guide data in a browser, you'll see that there will likely be 10-20 players with no RML teams assigned to them. This will be due to difference in names between the Ratings Guide and my abbreviations... eg:

-   Dejong,P vs DeJong,P
-   Bradley Jr,J vs Bradley,J
-   D'Arnaud,T vs d'Arnaud,T
-   and maybe even some with no apparent reason
 
In these cases, just add their **rml_team_id** manually before reuploading the data.

### Players with duplicate names

The above mentioned **/data/carded_players_abbrev.xlsx** file, will also flag all duplicate players. These duplicate name players will need to have their rml_team_id entered manually before uploading the **hitter_ratings.csv** and **pitcher_ratings.csv** files. After that, all rml teams will be automatically assigned by the app using the data compiled in **/controllers/utils/cardedPlayers.js**.

### Update the RML Teams

The data in **/controllers/utils/rmlTeams.js** will need to be checked for changes each year. In many years, there will be no changes or additions.

---

## Uploading the data into the database.

-   The files that need to be uploaded are **/data/hitter_ratings.csv** and **/data/pitcher_ratings.csv**.
-   **/data/hitter_ratings.csv** must have the proper columns... as just described earlier.

>   **IMPORTANT:** When uploading hitter and pitcher data (**/data/hitter_ratings.csv** and **/data/pitcher_ratings.csv**):

-   Use the **/data/pitcher_ratings.xlsx** file first. Once that is populated with all the new season's data, save the file as **/data/pitcher_ratings.csv**. Do the same thing for the hitters files.
-   **NOTE:** This next step isn't necessary if you added an apostrophe as a prefix to each pitcher's fielding rating.
    -   While **/data/pitcher_ratings.csv** is still open, upload the data via the '**Upload Pitcher Data**' link on the website. If you close **/data/pitcher_ratings.csv** before uploading it, the fielding column will be formatted like dates and it will fail to import properly into the database.

---

## Keeping current with the database

Keep an eye on **/data/rml_teams.xlsx** and **/config/rml_teams.sql**... making sure they are current.

There are some duplicate teams in the **rml_teams** table (eg: **Twins** and **Twins-old**). As of January-2024, comments by each of the duplicate teams have been added to **/data/ratings_guide_db(seeds).sql**.

---

## Multi-team hitters

The first consideration is to make sure each multi-team hitter is listed in the regular _data/hitter_ratings.csv_ file as being on team **TOT**.

Then it's time to move on to getting each multi-team hitter's _teams_ and _AB_ per team from [Baseball Reference](https://www.baseball-reference.com/).

It's going to take some data manipulation to get that info into _data/multi_team_hitters.xlsx_. What this includes:

-   The final data needs to have these columns (and a row for each team played for):

    -   Year
    -   Name
    -   Bats
    -   Tm
    -   AB

>   **UPDATE**: On January 8, 2024 I finished a new route and function to generate the above multi-team hitter AB on their individual teams. To use this route/function, you'll first need to update the data objects in "_/controllers/utils/convertMultiTeamHittersToCsv.js_" using the current season's data. After that, you can run the server-only "_npm run server_", then access this route: **http://localhost:3001/api/hitters/create-multi-team-csv** and paste the data into the **multi_team_hitters.xlsx** file... followed by converting the text to columns.

-   Keep the [Baseball Reference](https://www.baseball-reference.com/) team names as they are... they will be converted to **real_team_id**_** by the app before getting loaded into the database.

-   Each hitter's name will need to be changed to match the exact name Strat uses in the ratings guide (since that will be how the ratings guide links the multi-team hitters to this data). Strat's name format is **last name, comma, then first initial**... without a space after the comma... eg: _Doe,J_.

-   The **Bats** column data can be extracted from the hitter's name from [Baseball Reference](https://www.baseball-reference.com/). They use the following system:

    -   '\*' after their name means L
    -   '#' after their name means S
    -   neither of the above after their name means R

Once the data is in the proper format and gets added to: **/data/multi_team_hitters.xlsx**, save the file, then save it as: **/data/hitter_ratings.csv**.

Now the whole file can get uploaded from the **Upload Multi-Team Hitter Data** page. This process will truncate the current **multi_team_hitters** table in the database and replace it with the new file's data.

---

## Multi-team pitchers

The first consideration is to make sure each multi-team pitcher is listed in the regular **/data/pitcher_ratings.csv** file as being on team **TOT**.

Then it's time to move on to getting each multi-team pitcher's _teams_ and _IP_ per team from [Baseball Reference](https://www.baseball-reference.com/).

It's going to take some data manipulation to get that info into **/data/multi_team_pitchers.xlsx**. What this includes:

-   The final data needs to have these columns (and a row for each team played for):

    -   Year
    -   Name
    -   Throws
    -   Tm
    -   IP

>   **UPDATE**: On January 8, 2024 I finished a new route and function to generate the above multi-team pitchers AB on their individual teams. To use this route/function, you'll first need to update the data objects in **/controllers/utils/convertMultiTeamPitchersToCsv.js** using the current season's data. After that, you can run the server-only **npm run server**, then access this route: **http://localhost:3001/api/pitchers/create-multi-team-csv** and paste the data into the **multi_team_pitchers.xlsx** file... followed by converting the text to columns.

-   Keep the [Baseball Reference](https://www.baseball-reference.com/) team names as they are... they will be converted to **real_team_id** by the app before getting loaded into the database.

-   Each pitcher's name will need to be changed to match the exact name Strat uses in the ratings guide (since that will be how the ratings guide links the multi-team pitchers to this data). Strat's name format is **last name, comma, then first initial**... without a space after the comma... eg: _Doe,J_.

-   The **Throws** column data can be extracted from the pitcher's name from [Baseball Reference](https://www.baseball-reference.com/). They use the following system:

    -   '\*' after their name means L
    -   '#' after their name means S
    -   neither of the above after their name means R

Once the data is in the proper format and gets added to: **/data/multi_team_pitchers.xlsx**, save the file, then save it as: **/data/pitcher_ratings.csv**.

Now the whole file can get uploaded from the **Upload Multi-Team Pitcher Data** page. This process will truncate the current **multi_team_pitchers** table in the database and replace it with the new file's data.
