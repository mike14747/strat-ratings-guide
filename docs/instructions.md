## Steps from receiving the new ratings guide to showing all the wOPS numbers

Convert _Ballpark.txt_ team by team singles/homers data to _data/bp_ratings.xlsx_ where the formatted data column can be added to _data/ratings_guide_db(seeds).sql_, then imported to the _ratings_guide_ database in MySQL Workbench using copy/paste of the whole _data/ratings_guide_db(seeds).sql_ file.

Convert the hitter and pitcher data files into database ready data:

-   Open the _Hitters.xlsx_ and _Pitchers.xlsx_ files that come in the ratings disk.
-   Rename the lone sheet in each file to _Original Hitters_ and _Original Pitchers_ respectively, then copy each to the end and rename the copied sheets to _Carded Hitters_ and _Carded Pitchers_ respectively.
-   Working from the _Carded_ sheets in each file, set the font to _Calibri_ and _12pt_.
-   Set the top row to a light gray background, then freeze the top row in each file.
-   Set the row height for all rows to _18.00_.
-   Set _All Borders_ around the data.
-   Center and left-align the columns as needed.
-   In the _Pitchers.xlsx_ file, remove all the **+** signs from the **Hold** column.
-   In the _Hitters.xlsx_ file, remove all the **+** signs from the **CL v lhp** and **CL v rhp** columns.
-   Remove all hitters and pitchers that have an **M** in the _Location_ column. Most players with an **X** in the _Location_ column should be deleted too.  **However**, you might find that a couple low IP, carded pitchers might have been part of the X players group and have to be brough back in from the original file.
-   Remove all uncarded players. This will be easy to do for hitters (100+ AB in full 162 game seasons)... harder for pitchers.
-   Make sure Strat's and baseball-reference's real team abbreviations haven't changed from what they've been.

Modifying the columns in _Hitters.xls_ and _Pitchers.xls_ files:

-   Insert a _Year_ column to the begining of each file (the MLB year).
-   Add an _rml_team_id_ column to the end of each file.
-   **Notes:**
    -   It's no longer necessary to rename the _Location_ column to _real_team_id_, since that is now calculated by the app when uploading data.
    -   It's also no longer necessary to change the _TM_ column to reflect my preferred team abbreviations (eg: ARIZ instead of ARN) since that is now converted by the app when uploading data.
-   To fix an issue with the with the _data/pitcher_ratings.csv_ where Excel formats the _FIELD_ column as dates once the file is closed, add an apostrophe as a prefix to each pitcher's fielding rating... eg: _'3e21_. The apostrophe will be removed as the data is getting uploaded and it will keep Excel from formatting the column as dates.
-   **Important:** Every hitter and pitcher that played for multiple teams needs to have their _TM_ column set to _TOT_. In a normal season, there could be well over 100 players that need this team change. But, it's important for now because of the bp stadium ratings for each team have such an impact on the wOPS numbers. Multi-team players will not have wOPS ratings unless they also have their multi-team breakdowns added to _data/multi_team_hitters.xlsx_ and _data/multi_team_pitchers.xlsx_.

---

## Column names for the files

Column names for the _Hitters.xls_, _hitter_ratings.xlsx_ and especially **hitter_ratings.csv** files must use these exact column names (with no spaces and none of them beginning with a number) because of the csv parser that's being used:

-   Year, TM, Location, HITTERS, INJ, AB, SO_v_lhp, BB_v_lhp, HIT_v_lhp, OB_v_lhp, TB_v_lhp, HR_v_lhp, BP_v_lhp, CL_v_lhp, DP_v_lhp, SO_v_rhp, BB_v_rhp, HIT_v_rhp, OB_v_rhp, TB_v_rhp, HR_v_rhp, BP_v_rhp, CL_v_rhp, DP_v_rhp, STEALING, STL, SPD, B, H, d_CA, d_1B, d_2B, d_3B, d_SS, d_LF, d_CF, d_RF, FIELDING, rml_team_id

Column names for the _Pitchers.xls_, _data/pitcher_ratings.xlsx_ and especially **pitcher_ratings.csv** files must use these exact column names (with no spaces and none of them beginning with a number) because of the csv parser that's being used:

-   Year, TM, real_team_id, PITCHERS, IP, SO_v_l, BB_v_l, HIT_v_l, OB_v_l, TB_v_l, HR_v_l, BP_v_l, DP_v_l, SO_v_r, BB_v_r, HIT_v_r, OB_v_r, TB_v_r, HR_v_r, BP_v_r, DP_v_r, HO, ENDURANCE, FIELD, BK, WP, BAT_B, STL, SPD, rml_team_id

---

## Uploading the data into the database.

-   The files that need to be uploaded are _data/hitter_ratings.csv_ and _data/pitcher_ratings.csv_.
-   _data/hitter_ratings.csv_ must have the proper columns... as just described earlier.

**Important:** When uploading hitter and pitcher data (_data/hitter_ratings.csv_ and _data/pitcher_ratings.csv_):

-   Use the _data/pitcher_ratings.xlsx_ file first. Once that is populated with all the new season's data, save the file as _data/pitcher_ratings.csv_. Do the same thing for the hitters files.
-   **Note:** This next step isn't necessary if you added an apostrophe as a prefix to each pitcher's fielding rating.
    -   While _data/pitcher_ratings.csv_ is still open, upload the data via the '**Upload Pitcher Data**' link on the website. If you close _data/pitcher_ratings.csv_ before uploading it, the fielding column will be formatted like dates and it will fail to import properly into the database.

---

## Keeping current with the database

Keep an eye on _config/rml_teams.sql_ and _config/rml_teams.sql_... making sure they are current.

There are some duplicate teams in the _rml_teams_ table (eg: _Twins-1_ and _Twins-2_). As of December-2020, here's the rundown on the duplicates:

-   Dodgers-1: Roland Centrone's old team (is now the Monarchs).
-   Dodgers-2: Used to be Tom Phillips' Athletics... now run by Mark Berkoff.
-   Indians-1: Dave Scott's old team before changing to Twins-2 (Indians-1 is no longer in existence).
-   Indians-2: The old Mudcats (not Chuck's old Mudcats). They became Indians-2 in the 2017 RML season, then later changed to the River Cats and Stogies (Indians-2 is no longer in existence).
-   Twins-1: Kurt Novak's old team (Twins-1 is no longer in existence).
-   Twins-2: Dave Scott's new team name.

---

## Multi-team hitters

The first consideration is to make sure each multi-team hitter is listed in the regular _data/hitter_ratings.csv_ file as being on team **TOT**.

Then it's time to move on to getting each multi-team hitter's _teams_ and _AB_ per team from [baseball-reference.com].

It's going to take some data manipulation to get that info into _data/multi_team_hitters.xlsx_. What this includes:

-   The final data needs to have these columns (and a row for each team played for):

    -   Year
    -   Name
    -   Bats
    -   Tm
    -   AB

-   Keep the [baseball-reference.com] team names as they are... they will be converted to _real_team_id_ by the app before getting loaded into the database.

-   Each hitter's name will need to be changed to match the exact name Strat uses in the ratings guide (since that will be how the ratings guide links the multi-team hitters to this data). Strat's name format is _last name, comma, then first initial_... without a space after the comma... eg: _Doe,J_.

-   The _Bats_ column data can be extracted from the hitter's name from [baseball-reference.com]. They use the following system:

    -   '\*' aftre their name means L
    -   '#' after their name means S
    -   neither of the above after their name means R

Once the data is in the proper format and gets added to: _data/multi_team_hitters.xlsx_, save the file, then save it as: _data/hitter_ratings.csv_.

Now the whole file can get uploaded from the _Upload Multi-Team Hitter Data_ page. This process will truncate the current _multi_team_hitters_ table in the database and replace it with the new file's data.

---

## Multi-team pitchers

The first consideration is to make sure each multi-team pitcher is listed in the regular _data/pitcher_ratings.csv_ file as being on team **TOT**.

Then it's time to move on to getting each multi-team pitcher's _teams_ and _IP_ per team from [baseball-reference.com].

It's going to take some data manipulation to get that info into _data/multi_team_pitchers.xlsx_. What this includes:

-   The final data needs to have these columns (and a row for each team played for):

    -   Year
    -   Name
    -   Throws
    -   Tm
    -   IP

-   Keep the [baseball-reference.com] team names as they are... they will be converted to _real_team_id_ by the app before getting loaded into the database.

-   Each pitcher's name will need to be changed to match the exact name Strat uses in the ratings guide (since that will be how the ratings guide links the multi-team pitchers to this data). Strat's name format is _last name, comma, then first initial_... without a space after the comma... eg: _Doe,J_.

-   The _Throws_ column data can be extracted from the pitcher's name from [baseball-reference.com]. They use the following system:

    -   '\*' aftre their name means L
    -   '#' after their name means S
    -   neither of the above after their name means R

Once the data is in the proper format and gets added to: _data/multi_team_pitchers.xlsx_, save the file, then save it as: _data/pitcher_ratings.csv_.

Now the whole file can get uploaded from the _Upload Multi-Team Pitcher Data_ page. This process will truncate the current _multi_team_pitchers_ table in the database and replace it with the new file's data.
