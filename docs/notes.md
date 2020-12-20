### Steps from receiving the new ratings guide to showing all the wOPS numbers

-   Convert _Ballpark.text_ team by team singles/homers data to _bp_ratings.xlsx_ where the formatted data column can be added to _bp_ratings.sql_, then imported to the _ratings_guide_ database.

-   Convert the hitter and pitcher data files into database ready data:

    -   Open the _Hitters.xls_ and _Pitchers.xls_ files that come in the ratings disk
    -   Save each to: _Hitters.xlsx_ and _Pitchers.xlsx_ (this will use Excel's latest format and protect the original data from alteration).
    -   Rename the lone sheet in each file to _Original_, then copy it to the end and rename the name sheet to _Modified_.
    -   Working from the _Modified_ sheet in each file, set the font to _Calibri_ and _12pt_.
    -   Set the top row to a light gray background, then freeze the top row in each file.
    -   Set the row height for all rows to _18.00_.
    -   Remove all hitters and pitchers that don't have a blank **Location** cell (there will be many that have M or X).
    -   Remove all uncarded players. This will be easy to do for hitters (100+ AB)... harder for pitchers.

Modifying the columns in _Hitters.xls_ and _Pitchers.xls_ files:

-   Insert a _Year_ column to the begining of each file (the MLB year).
-   Add an _rml_team_id_ column to the end of each file.
-   **Notes:**
    -   It's no longer necessary to rename the _Location_ column to _real_team_id_, since that is now calculated by the app when uploading data.
    -   It's also no longer necessary to change the _TM_ column to reflect my preferred team abbreviations (eg: ARIZ instead of ARN) since that is now converted by the app when uploading data.
-   It's important that the _Hitters.xls_ and _hitter_ratings.csv_ files use these exact column names (with no spaces and none of them beginning with a number) because of the csv parser that's being used:
    -   Year, TM, Location, HITTERS, INJ, AB, SO_v_lhp, BB_v_lhp, HIT_v_lhp, OB_v_lhp, TB_v_lhp, HR_v_lhp, BP_v_lhp, CL_v_lhp, DP_v_lhp, SO_v_rhp, BB_v_rhp, HIT_v_rhp, OB_v_rhp, TB_v_rhp, HR_v_rhp, BP_v_rhp, CL_v_rhp, DP_v_rhp, STEALING, STL, SPD, B, H, d_CA, d_1B, d_2B, d_3B, d_SS, d_LF, d_CF, d_RF, FIELDING, rml_team_id


Uploading the data into the database.

-   The files that need to be uploaded are _hitter_ratings.csv_ and _pitcher_ratings.csv_.
-   _hitter_ratings.csv_ must have the proper columns (ie: Year as the first column, INJ after HITTERS and rml_team_id at the end).

**Important:** When uploading hitter and pitcher data (_hitter_ratings.csv_ and _pitcher_ratings.csv_):

-   Use the _pitcher_ratings.xlsx_ file first. Once that is populated with all the new season's data, save the file as _pitcher_ratings.csv_. Do the same thing for the hitters files.
-   While _pitcher_ratings.csv_ is still open, upload the data via the '**Upload Pitcher Data**' link on the website. If you close _pitcher_ratings.csv_ before uploading it, the fielding column will be formatted like dates and it will fail to import properly into the database.
-   I'm not sure if the hitters file has the above issue, but it's not a bad idea to follow the same flow.

---

### Keeping current with the database

Keep an eye on _rml_teams.sql_ and _rml_teams.sql_... making sure they are current.

There are some duplicate teams in the _rml_teams_ table (eg: _Twins-1_ and _Twins-2_). As of December-2020, here's the rundown on the duplicates:

-   Dodgers-1: Roland Centrone's old team (is now the Monarchs).
-   Dodgers-2: Used to be Tom Phillips' Athletics... now run by Mark Berkoff.
-   Indians-1: Dave Scott's old team before changing to Twins-2 (Indians-1 is no longer in existence).
-   Indians-2: The old Mudcats (not Chuck's old Mudcats). They became Indians-2 in the 2017 RML season, then later changed to the River Cats and Stogies (Indians-2 is no longer in existence).
-   Twins-1: Kurt Novak's old team (Twins-1 is no longer in existence).
-   Twins-2: Dave Scott's new team name.
