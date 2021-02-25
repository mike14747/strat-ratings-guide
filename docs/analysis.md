### Impacts on wOPS of a pitcher extras

What are the difference between what I'm calling a pitcher's _extras_ (for the purposes on calculating their wOPS) from what I've traditionally called a pitcher's _top_?

I generally define a pitcher's top as being all the things literally on the top of their card... above all the dice roll chances.

-   Fielding rating
-   BK rating
-   WP rating
-   Hold rating

A pitcher's extras include much of the above plus extra DPs.

-   Fielding rating
-   BK rating
-   WP rating
-   DPs

I haven't yet figured out a way to incorporate their _Hold_ rating... partly because it's so non-linear.

Using the formulas and values I'm currently using, the maximum impact of each of the pitcher's _extras_ are:

-   Fielding rating:
    -   The range of posssible values is 1e0 through 5e51.
    -   The best rating (1e0) is assumed as having zero impact on wOPS.
    -   The worst rating (5e51) adds (through a fairly complex calculation) 4.4 to their wOPS.

-   BK rating:
    -   The range of posssible values is 0 through 20.
    -   The best rating (0) is assumed as having zero impact on wOPS.
    -   Each increment on their BK rating is calculated as being worth .103 wOPS points.
    -   The worst rating (20) adds 2.1 to their wOPS.

-   WP rating:
    -   The range of posssible values is 0 through 20.
    -   The best rating (0) is assumed as having zero impact on wOPS.
    -   Each increment on their WP rating is calculated as being worth .205 wOPS points.
    -   The worst rating (20) adds 4.1 to their wOPS.

-   DPs:
    -   This is the only of the pitcher's extras that has an inverse effect and can lower their wOPS.
    -   The range of posssible values is 0 through 14.
    -   The worst rating (0) is assumed as having zero impact on wOPS.
    -   Each increment on their DP rating is calculated as being worth deducting .2222 wOPS points.
    -   The best rating (14) subtracts 3.1 from their wOPS.

Considering best and worst ratings/values () the maximum combined impact of a pitcher's _extras_ on their wOPS would be 13.7 (-3.1 through +10.6).

It should be noted that even though balk and wild pitches have the same effect on advancing baserunners, the WP rating has the chance of occurring twice as often by means of the single die roll, so it gets twice the multiplier in the calculation.

---

### Clutch hitting
