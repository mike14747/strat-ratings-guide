import React from 'react';

function Home() {
    return (
        <div className="container my-4">
            <h2 className="mb-3">Welcome to my Strat-O-Matic Ratings Guide analysis!</h2>

            <p>If you play Strat-O-Matic baseball and purchase their annual Ratings Guide, many of the numbers you&apos;ll see aren&apos;t exactly what you&apos;ll see on their individual cards… depending upon the rules you and/or your league are implementing.</p>

            <p>In the league which I belong, we don&apos;t use ballparks, weather or even clutch hitting. That makes the numbers in Strat&apos;s publication only minimally useful. The hit, on-base, total base and homer numbers could vary quite substantially since they are affected by the ballpark the player played in.</p>

            <p>What this app does, is to turn Strat&apos;s Ratings Guide numbers into barkpark (and clutch hitting) neutral numbers that correspond with my league&apos;s rules.</p>

            <p>The cherry on top of just converting the numbers to more meaningful ones is to add special columns that basically sum up their card into a single value (one vs lefties and another vs righties) which I call wOPS. It&apos;s kind of a weighted OPS that values OBP more that SLG.</p>

            <p>A basic reference to use would be to just add on-base and total base chances as they appear on their cards (weighted toward on-base chances) with several other things worked into the calculations.</p>

            <p>The wOPS number for pitchers also takes into account extra DP chances, fielding, WP and Balk ratings in calculating the number.</p>

            <p>In the case of hitters, DP and power ratings are included. W rated hitters lose a certain number of wOPS points because of the homers they&apos;ll lose on their rolls on pitcher&apos;s cards, even though it doesn&apos;t necessarily reflect what&apos;s on or not on their own cards.</p>

            <p>Additionally, I do take into account that some players played for multiple teams (and thus in multiple ballparks). I weight their ballpark single/homer numbers based upon their actually AB/IP in each ballpark.</p>

            <p>One caveat to these is numbers is to say that there will be some variation between them and what actually appears on their cards. This is due to the fact that Strat rounds to one significant digit and in the case of DPs, they don&apos;t take into account DPs with split chances. If a player has a single on a split number of a 1 and a DP 2 through 20, it won&apos;t be included as a DP chance, even though that could potentially be nearly 6 DP chances if it appears on a 7.</p>

            <p>Sometimes, I just can&apos;t understand how a player&apos;s card is so different from what I&apos;m expecting it to be. An extreme example of this would be that I expected a pitcher to have 3.5 homer chances vs lefties and they really have 3.8 on their card, even when the difference can&apos;t be accounted for by sheer rounding of the ballpark ratings alone. I just shrug my shoulders in those cases. All in all though, most players are very accurate.</p>

            <p>For now, I&apos;m only including the 2019 results for public viewing. You have to log in to see more than that... and for now, I&apos;m reserving the additional seasons only for myself.</p>
        </div >
    );
}

export default Home;
