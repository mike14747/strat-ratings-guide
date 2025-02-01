# Analysis

## Impacts on wOPS of a pitcher extras

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

    -   The range of possible values is 1e0 through 5e51.
    -   The best rating (1e0) is assumed as having zero impact on wOPS.
    -   The worst rating (5e51) adds (through a fairly complex calculation) 4.4 to their wOPS.

-   BK rating:

    -   The range of possible values is 0 through 20.
    -   The best rating (0) is assumed as having zero impact on wOPS.
    -   Each increment on their BK rating is calculated as being worth .103 wOPS points.
    -   The worst rating (20) adds 2.1 to their wOPS.

-   WP rating:

    -   The range of possible values is 0 through 20.
    -   The best rating (0) is assumed as having zero impact on wOPS.
    -   Each increment on their WP rating is calculated as being worth .205 wOPS points.
    -   The worst rating (20) adds 4.1 to their wOPS.

-   DPs:
    -   This is the only of the pitcher's extras that has an inverse effect and can lower their wOPS.
    -   The range of possible values is 0 through 14.
    -   The worst rating (0) is assumed as having zero impact on wOPS.
    -   Each increment on their DP rating is calculated as being worth deducting .2222 wOPS points.
    -   The best rating (14) subtracts 3.1 from their wOPS.

Considering best and worst ratings/values () the maximum combined impact of a pitcher's _extras_ on their wOPS would be 13.7 (-3.1 through +10.6).

It should be noted that even though balk and wild pitches have the same effect on advancing baserunners, the WP rating has the chance of occurring twice as often by means of the single die roll, so it gets twice the multiplier in the calculation.

---

## Clutch hitting

---

## Tired pitchers

There are either 10 or 11 **dot chances** on each side of a pitcher's card.

Assuming OB and TB values of 1.2 and .845, the impact of using a tired pitcher is between 23 and 25 wOPS points per side.

Assuming OB and TB values of 1.259 and 0.7407, the impact of using a tired pitcher is between ? and ? wOPS points per side (probably very similar to the numbers using the old 1.2 and .845).

---

## Merging Defense into wOPS

2021 PA: 181818
2021 PA/Team: 6060.6
2021 PA/Team/9 (PA/lineup_slot... eg: avg for #5 hitter): 673.4

2021 AB: 161941
2021 PA/Team/9 (AB/lineup_slot... eg: avg for #5 hitter): 599.8

2021 IP: 42615
2021 IP/Team: 1420.5

2021 INN/PA (avg for #5 hitter): 2.11 INN per 1 PA
2021 INN/AB (avg for #5 hitter): 2.37 INN per AB

2021 PA/Team/INN: 4.2665
2021 opponent's PA where their defense is on the field vs each offensive PA: 10.11

Example of a 3B:

-   They will get a GB(X)3B rolled 87.22 times per season (1458 INN and 6280 rolls per season as a base... which would give them 697.78 PA).
-   A 3e21 will add 1.26 OB, 1.58 TB and 0.56 DP chances to each roll on the pitcher's card.
-   A 3e21 will add (1.26 / 216) * 10.11 OB per each of their offensive PA.
-   A 3e21 will add (1.58 / 216) * 10.11 TB per each of their offensive PA.
-   A 3e21 will add (0.56 / 216) * 10.11 DP per each of their offensive PA.
-   They are going to allow 39.69 base runners, 46.03 total bases and 2.82 DP per season (1458 INN and 6280 rolls per season as a base).

The effect of pitcher's defense on their wOPS:

-   5e51 will add 4.415 to their wOPS
-   3e0 will add 0.800 to their wOPS
-   4e0 will add 1.200 to their wOPS
-   1e39 will add 2.860 to their wOPS
-   2e0 will add 0.400 to their wOPS
-   2e51 will add 3.908 to their wOPS
-   2e20 will add 1.776 to their wOPS
-   3e10 will add 1.442 to their wOPS
-   1e0 will add 0 to their wOPS (this means I haven't incorporated DPs pitcher's defense into their wOPS)

---
