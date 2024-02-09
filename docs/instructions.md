# Instructions for handling new Ratings Disks

## Pre Ratings Disk Preparation

### Keeping RML team names current in the database

Keep an eye on **/config/rml_teams.sql**... making sure it is current with RML team name changes from the previous season.

There are some duplicate teams in the **rml_teams** table (eg: **Twins** and **Twins-old**). As of January-2024, comments by each of the duplicate teams have been added to **/config/ratings_guide_db(seeds).sql**.

The **/config/ratings_guide_db(seeds).sql** file will get imported into the database once the new ballpark data (BP singles/homers for each team) arrives in the ratings disk, so there's no need to import it in advance.

---

### Update the Carded Player lists

**NEW**: As of 2024-02-06, you no longer need to copy/paste the formatted data from the Master Roster to Quokka to have each player's IP rounded and their **abbrevName** added.

I've added the following:

-   "carded_players" table in the database and its schema.
-   "carded-players" api route and controller.
-   "cardedPlayers" data models.
-   "carded_players.xlsx" file which will have its data uploaded to the database.
-   Functions to process the uploaded excel data (parsing, rounding IP, adding an abbrevName field, etc).
-   Added html and js files to the frontend for uploading "carded_players.xlsx".

#### Using this new feature

To get the necessary data from the Master Roster file to paste into **carded_players.xlsx**, sort the Master Roster file by "Carded", then by "Name" and use this formula on row 2 of the first column to the right of the "Carded" column:

```text
=IF(INDEX($A$2:$Z$860, ROW($A$1:$A$859), {1,3,19,25})<>"", INDEX($A$2:$Z$860, ROW($A$1:$A$859), {1,3,19,25}), "")
```

**NOTE**: You'll need to adjust the above formula based upon how many carded players are in each season's Master Roster file. The above formula is set for having 859 carded players.

Highlight the formatted column data then copy/paste into the cardedPlayed array in: **/controllers/utils/cardedPlayers.js**. Each player's **abbrevName** will automatically be calculated.

Each time a significant number of RML team changes occur (eg: after drafts), this process can be repeated.

**TIP**: If you have a few players who have blank RML teams, here are some things to watch look for:

-   An erroneous space after the comma in a player's name in Strat's ratings disk.
-   Spaces between last name segments don't match between the Master Roster and the Ratings Disk.
-   "Jr" or "II" suffixes don't match between the Master Roster and the Ratings Disk.
-   AB or IP from the original "Hitters Stats" or "Pitchers Stats" files from the preliminary Baseball-Reference data might be 1 different from what is in the Ratings Disk.

> Try to update the Ratings Disk data in **/data/hitter_ratings.xlsx** and **/data/pitcher_ratings.xlsx** when the issues are with names not matching.
>
> Usually, you'll be updating the **Master Roster** (and thus **/controllers/utils/cardedPlayers.js**) when the issues are with AB or IP not matching.

**NOTE**: If you ever make changes to **/data/carded_players.xlsx**, you'll need to re-upload the hitter and pitcher ratings because the process of uploading them sets their RML teams... which may have changed in the carded player update.

---

### Players with duplicate name abbreviations

**UPDATE**: As of 2024-01-22, you no longer need to be concerned with this. It is handled automatically by the hitter and pitcher controllers. The functions now match not only their abbreviated name, but also their IP and/or AB, so it's unlikely there will ever be a player with the same abbreviated name and IP/AB.

---

### Multi-team Hitters/Pitchers

At the conclusion of each MLB season... far before the ratings disk is set to arrive, the multi-team hitter/pitcher data can be compiled.

Typically, I add **Hitter_Stats_202x.xlsx** and **Pitcher_Stats_202x.xlsx** files following the current RML season folder.

Those files will include the following sheets:

-   Original_with_TOT
-   Original_with_Ind_Teams
-   Carded
-   TOT (this will just be a list of hitters and pitchers whose team is TOT, with their Name, Tm and AB/IP)

> **UPDATE**: On January 8, 2024 I finished a new route and function to generate the above multi-team hitter AB/IP (respectively) on their individual teams.
>
> To use this route/function, you'll first need to update the data objects in **/controllers/utils/convertMultiTeamHittersToXLSX.js** and **/controllers/utils/convertMultiTeamPitchersToXLSX.js** using the current season's data from the **Original_with_Ind_Teams** and **Carded** sheets of **Hitter_Stats_202x.xlsx** and **Pitcher_Stats_202x.xlsx**.
>
> After that, you can run the server-only **npm run server**, then access these routes: **http://localhost:3001/api/hitters/create-multi-team-csv** and **http://localhost:3001/api/pitchers/create-multi-team-csv** using Postman to get the generated csv data for each.
>
> Paste the data into **/data/multi_team_hitters.xlsx** and **/data/multi_team_pitchers.xlsx**... followed by converting the text to columns.

Each hitter/pitcher name will need to be changed to match the exact name Strat uses in the ratings guide (since that will be how the ratings guide links the multi-team hitters to this data). Strat's name format is **last name, comma, then first initial**... without a space after the comma... eg: **Doe,J**. Strat does include spaces in last names for some players (eg: De Los Santos,E).

---

### Multi-team hitters

Get each multi-team hitter's **teams** and **AB** per team from [Baseball Reference](https://www.baseball-reference.com/).

It's going to take some data manipulation to get that info into **/data/multi_team_hitters.xlsx**. What this includes:

The final data needs to have these columns (and a row for each team played for):

-   Year
-   Name
-   Bats
-   Tm
-   AB

-   Keep the [Baseball Reference](https://www.baseball-reference.com/) team names as they are... they will be converted to **real_team_id** by the app before getting loaded into the database.

-   The **Bats** column data can be extracted from the hitter's name from [Baseball Reference](https://www.baseball-reference.com/). They use the following system:

    -   '\*' after their name means L
    -   '#' after their name means S
    -   neither of the above after their name means R

Once the data is in the proper format and gets added to: **/data/multi_team_hitters.xlsx**. **UPDATE**: as of 2024-02-02, it's no longer necessary to then save the file as .csv. The new parser now works with .xlsx files.

Now the whole file can get uploaded from the **Upload Multi-Team Hitter Data** page. This process will truncate the current **multi_team_hitters** table in the database and replace it with the new file's data.

---

### Multi-team pitchers

Get each multi-team pitcher's **teams** and **IP** per team from [Baseball Reference](https://www.baseball-reference.com/).

It's going to take some data manipulation to get that info into **/data/multi_team_pitchers.xlsx**. What this includes:

The final data needs to have these columns (and a row for each team played for):

-   Year
-   Name
-   Throws
-   Tm
-   IP

-   Keep the [Baseball Reference](https://www.baseball-reference.com/) team names as they are... they will be converted to **real_team_id** by the app before getting loaded into the database.

-   Each pitcher's name will need to be changed to match the exact name Strat uses in the ratings guide (since that will be how the ratings guide links the multi-team pitchers to this data). Strat's name format is **last name, comma, then first initial**... without a space after the comma... eg: _Doe,J_.

-   The **Throws** column data can be extracted from the pitcher's name from [Baseball Reference](https://www.baseball-reference.com/). They use the following system:

    -   '\*' after their name means L
    -   '#' after their name means S
    -   neither of the above after their name means R

Once the data is in the proper format and gets added to: **/data/multi_team_pitchers.xlsx**. **UPDATE**: as of 2024-02-02, it's no longer necessary to then save the file as .csv. The new parser now works with .xlsx files.

Now the whole file can get uploaded from the **Upload Multi-Team Pitcher Data** page. This process will truncate the current **multi_team_pitchers** table in the database and replace it with the new file's data.

### File upload sheet names

For all the following files that will be uploading data, make sure to name the single sheet in these files the same as the file name minus the extension.

-   /data/hitter_ratings.xlsx --> sheet name: hitter_ratings
-   /data/pitcher_ratings.xlsx --> sheet name: pitcher_ratings
-   /data/multi_team_hitters.xlsx --> sheet name: multi_team_hitters
-   /data/multi_team_pitchers.xlsx --> sheet name: multi_team_pitchers

---

## Once the Ratings Disk arrives

### New ballpark data into the database

-   Convert **Ballpark.txt** team by team singles/homers data to **data/bp_ratings.xlsx**.
-   The formatted data column needs to be added to **/config/ratings_guide_db(seeds).sql**.
-   Add the entire **/config/ratings_guide_db(seeds).sql** file into the **ratings_guide_db** database with MySQL Workbench using copy/paste/execute.

---

### NOTES for both Hitters.xlsx and Pitchers.xlsx

-   It's no longer necessary to rename the **Location** column to **real_team_id**, since that is now calculated by the app when uploading data. This is confirmed to be true. In fact, changing the name from **Location** will now generate an error from the Joi schema validation.
-   It's also no longer necessary to change the **TM** column to reflect my preferred team abbreviations (eg: ARIZ instead of ARN) since that is now converted by the app when uploading data.
-   Make sure the Strat and baseball-reference real team abbreviations haven't changed from what they've been. I had some issues with St Louis in the past... (falsely?) thinking they used to be listed as **STN** instead of **SLN** in the past. Also, I removed the extra St Louis row (real_team_id = 32) from **real_teams.xlsx** file and change the original (real_team_id = 27) St Louis to SLN.

> **IMPORTANT** (for both **Hitters.xlsx** and **Pitchers.xlsx**): Every hitter and pitcher that played for multiple teams needs to have their **TM** column manually set to **TOT**.
>
> In a normal season, there could be well over 100 players that need this team change. But, it's important to do because of the bp stadium ratings for each team have such an impact on the wOPS numbers.
>
> Multi-team players will not have wOPS ratings unless they also have their multi-team breakdowns added to **data/multi_team_hitters.xlsx** and **data/multi_team_pitchers.xlsx**.

---

### Getting "Hitters.xlsx" ready

-   Open the **Hitters.xlsx** file that came in the ratings disk.
-   Rename the lone sheet to **Original Hitters**, then copy it to the end and rename the copied sheet to **Carded Hitters**.
-   From this point forward, you'll be working only with the **Carded Hitters** sheet.
-   Set the font to **Calibri** and **12pt**.
-   Set the top row to a light gray background, then freeze the top row.
-   Set the row height for all rows to **18.00**.
-   Set **All Borders** around the data.
-   "Center" and ""left-align" the columns as needed.
-   Remove all the **+** signs from the **CL v lhp** and **CL v rhp** columns (may no longer need to be done).
-   Remove all hitters that have an **M** in the **Location** column. All hitters with an **X** in the **Location** column should be deleted too, but double-check that one or two don't have 100+ ABs.
-   Remove all uncarded hitters (those without 100+ AB in full 162 game seasons).
-   Insert a **Year** column to the beginning of each file (the MLB year).
-   Add an **rml_team_id** column to the end of each file.
-   The **INJ** column might have to get moved to its correct place (immediately after the **HITTERS** column).
-   Delete the **W** column (starting with the 2022 season). This is actual real life walks and is not needed.
-   Make sure each multi-team hitter is listed in the regular **/data/hitter_ratings.xlsx** file as being on team **TOT**.

Column names for the **/data/hitter_ratings.xlsx** file must use these exact column names (with no spaces and none of them beginning with a number) because of the parser that's being used:

-   Year, TM, Location, HITTERS, INJ, AB, SO_v_lhp, BB_v_lhp, HIT_v_lhp, OB_v_lhp, TB_v_lhp, HR_v_lhp, BP_v_lhp, CL_v_lhp, DP_v_lhp, SO_v_rhp, BB_v_rhp, HIT_v_rhp, OB_v_rhp, TB_v_rhp, HR_v_rhp, BP_v_rhp, CL_v_rhp, DP_v_rhp, STEALING, STL, SPD, B, H, d_CA, d_1B, d_2B, d_3B, d_SS, d_LF, d_CF, d_RF, FIELDING, rml_team_id

---

### Getting "Pitchers.xlsx" ready

-   Open the **Pitchers.xlsx** file that came in the ratings disk.
-   Rename the lone sheet to **Original Pitchers**, then copy it to the end and rename the copied sheet to **Carded Pitchers**.
-   From this point forward, you'll be working only with the **Carded Pitchers** sheet.
-   Set the font to **Calibri** and **12pt**.
-   Set the top row to a light gray background, then freeze the top row.
-   Set the row height for all rows to **18.00**.
-   Set **All Borders** around the data.
-   "Center" and ""left-align" the columns as needed.
-   Remove all the **+** signs from the **Hold** column (may no longer need to be done).
-   Remove all pitchers that have an **M** in the **Location** column. Most pitchers with an **X** in the **Location** column should be deleted too. **HOWEVER**, you might find that a couple low IP, carded pitchers might have been part of the X players group and have to be brought back in from the original file.
-   Remove all uncarded pitchers (this is a tedious task for pitchers).
-   Insert a **Year** column to the beginning of each file (the MLB year).
-   Add an **rml_team_id** column to the end of each file.
-   To fix an issue where Excel formats the **FIELD** column as dates once the file is closed, add an apostrophe as a prefix to each pitcher's fielding rating... **eg**: **'3e21**. The apostrophe will be removed as the data is getting uploaded and it will keep Excel from formatting the column as dates.
-   Make sure each multi-team pitcher is listed in the regular **/data/pitcher_ratings.xlsx** file as being on team **TOT**.

Column names for the **/data/pitcher_ratings.xlsx** file must use these exact column names (with no spaces and none of them beginning with a number) because of the parser that's being used:

-   Year, TM, Location, PITCHERS, IP, SO_v_l, BB_v_l, HIT_v_l, OB_v_l, TB_v_l, HR_v_l, BP_v_l, DP_v_l, SO_v_r, BB_v_r, HIT_v_r, OB_v_r, TB_v_r, HR_v_r, BP_v_r, DP_v_r, HO, ENDURANCE, FIELD, BK, WP, BAT_B, STL, SPD, rml_team_id

---

### Adding some RML team ids for RML teams that show up as blank

After viewing the processed rating guide data in a browser, you'll see that there will likely be 10-20 players with no RML teams assigned to them. This will be due to difference in names between the Ratings Guide and my name abbreviations... eg:

-   Dejong,P vs DeJong,P
-   Bradley Jr,J vs Bradley,J
-   D'Arnaud,T vs d'Arnaud,T
-   and maybe even some with no apparent reason

In these cases, just add their **rml_team_id** manually before reuploading the data.

---

### Uploading the data into the database.

-   The files that need to be uploaded are **/data/hitter_ratings.xlsx** and **/data/pitcher_ratings.xlsx**.
-   Both files must have the proper columns... as just described earlier.
