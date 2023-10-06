# Calculating multi-team AB and IP

## Redesign flow chart

I want to have a page to upload hitter stats and pitcher stats as they were downloaded from baseball-reference as a .csv file... with multi-team data not hidden.

The files should be edited in these ways:

-   Accented characters should be removed.
-   bats and throws data should extracted into their own columns.
-   char(160) non-breaking spaces should be converted to regular spaces.
-   Player names should be formatted to "LastName, FirstName".

### Hitter Stats file

The page should have a page to upload the _csv_ file.

The data should be parsed this way:

-   Each row should be checked to see whether the team is listed as **TOT** and their **ABs** are at least 100 or more.
-   Once a match as described above is made, add certain columns into an object (Name-additional and AB).

The above parsed data object should then be checked against the original file to pull out matches where the team is not list as **TOT**.

When matches are found, they should be added to an object in this format:

```json
const multiTeamHitters = {
    // Year	Name	Bats	Tm	AB
    year: 2023,
    name: hitter.Name,
    bats,
    team: hitter.Tm,
    ab: hitter.AB,
};
```

### Data Retrieval

At this point, the resulting object should either be:

-   Output as a _csv_ file,
-   Displayed in a table that could be copied/pasted into a _csv_ file.
-   Accessed as an output using Postman... without using a file upload.

## Old new flow

-   Upload a .csv file with multi-team hitter data.
-   Get real team names from the database.
-   Parse the uploaded multi-team hitter data from uploaded file.
-   Check that the data format matches the Joi schema.
-   Send the parsed data and real team array to **processMultiTeamHittersInsertData()** where a match is made for a valid real team name, where the real_team_id is used. The data, if valid, is returned to the controller as an array of arrays.
-   The controller then sends the data to the hitter model to be inserted into the database.
