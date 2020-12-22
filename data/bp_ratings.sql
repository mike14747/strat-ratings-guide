USE ratings_guide_db;
DROP TABLE IF EXISTS `bp_ratings`;

CREATE TABLE `bp_ratings` (
  `bp_rating_id` int unsigned NOT NULL AUTO_INCREMENT,
  `bp_year` int NOT NULL,
  `real_team_id` int unsigned NOT NULL,
  `real_team_league` varchar(2) NOT NULL,
  `real_team_abbrev` varchar(10) NOT NULL,
  `st_si_l` int unsigned NOT NULL,
  `st_si_r` int unsigned NOT NULL,
  `st_hr_l` int unsigned NOT NULL,
  `st_hr_r` int unsigned NOT NULL,
  PRIMARY KEY (`bp_rating_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

--
-- Dumping data for table `bp_ratings`
--

INSERT INTO `bp_ratings` (`bp_year`, `real_team_id`, `real_team_league`, `real_team_abbrev`, `st_si_l`, `st_si_r`, `st_hr_l`, `st_hr_r`) VALUES
(2013, 2, 'NL', 'ARIZ', 11, 11, 11, 11),
(2013, 3, 'NL', 'ATL', 14, 8, 11, 5),
(2013, 4, 'AL', 'BAL', 12, 6, 18, 13),
(2013, 5, 'AL', 'BOS', 18, 18, 2, 8),
(2013, 6, 'AL', 'CHI(A)', 6, 6, 16, 16),
(2013, 7, 'NL', 'CHI(N)', 9, 9, 9, 9),
(2013, 8, 'NL', 'CIN', 5, 5, 19, 19),
(2013, 9, 'AL', 'CLE', 8, 4, 17, 5),
(2013, 10, 'NL', 'COL', 19, 19, 16, 16),
(2013, 11, 'AL', 'DET', 13, 13, 9, 9),
(2013, 12, 'AL', 'HOU', 5, 5, 11, 11),
(2013, 13, 'AL', 'KC', 11, 11, 5, 5),
(2013, 14, 'AL', 'LA(A)', 3, 7, 4, 4),
(2013, 15, 'NL', 'LA(N)', 8, 4, 13, 7),
(2013, 16, 'NL', 'MIA', 12, 12, 1, 1),
(2013, 17, 'NL', 'MIL', 9, 9, 17, 17),
(2013, 18, 'AL', 'MIN', 7, 13, 2, 8),
(2013, 19, 'AL', 'NY(A)', 9, 6, 16, 13),
(2013, 20, 'NL', 'NY(N)', 1, 1, 12, 12),
(2013, 21, 'AL', 'OAK', 1, 6, 1, 6),
(2013, 22, 'NL', 'PHI', 6, 2, 18, 10),
(2013, 23, 'NL', 'PIT', 8, 8, 1, 1),
(2013, 24, 'NL', 'SD', 2, 2, 1, 4),
(2013, 25, 'NL', 'SF', 6, 6, 1, 1),
(2013, 26, 'AL', 'SEA', 1, 1, 5, 1),
(2013, 27, 'NL', 'STL', 11, 4, 8, 4),
(2013, 28, 'AL', 'TB', 2, 2, 6, 6),
(2013, 29, 'AL', 'TEX', 14, 14, 13, 13),
(2013, 30, 'AL', 'TOR', 10, 10, 11, 14),
(2013, 31, 'NL', 'WASH', 15, 15, 8, 8),
(2014, 2, 'NL', 'ARIZ', 13, 9, 12, 12),
(2014, 3, 'NL', 'ATL', 8, 8, 8, 8),
(2014, 4, 'AL', 'BAL', 9, 9, 18, 10),
(2014, 5, 'AL', 'BOS', 16, 16, 1, 7),
(2014, 6, 'AL', 'CHI(A)', 3, 9, 14, 14),
(2014, 7, 'NL', 'CHI(N)', 14, 6, 5, 11),
(2014, 8, 'NL', 'CIN', 1, 6, 19, 19),
(2014, 9, 'AL', 'CLE', 7, 2, 12, 7),
(2014, 10, 'NL', 'COL', 19, 19, 16, 16),
(2014, 11, 'AL', 'DET', 9, 14, 10, 10),
(2014, 12, 'AL', 'HOU', 2, 5, 11, 11),
(2014, 13, 'AL', 'KC', 11, 11, 6, 6),
(2014, 14, 'AL', 'LA(A)', 6, 6, 4, 4),
(2014, 15, 'NL', 'LA(N)', 8, 1, 12, 12),
(2014, 16, 'NL', 'MIA', 8, 13, 1, 1),
(2014, 17, 'NL', 'MIL', 7, 7, 18, 18),
(2014, 18, 'AL', 'MIN', 12, 12, 5, 8),
(2014, 19, 'AL', 'NY(A)', 10, 4, 17, 14),
(2014, 20, 'NL', 'NY(N)', 1, 1, 10, 10),
(2014, 21, 'AL', 'OAK', 3, 9, 3, 6),
(2014, 22, 'NL', 'PHI', 2, 2, 13, 16),
(2014, 23, 'NL', 'PIT', 9, 9, 1, 1),
(2014, 24, 'NL', 'SD', 1, 1, 10, 2),
(2014, 25, 'NL', 'SF', 10, 4, 1, 1),
(2014, 26, 'AL', 'SEA', 4, 4, 8, 8),
(2014, 27, 'NL', 'STL', 11, 7, 6, 6),
(2014, 28, 'AL', 'TB', 4, 4, 5, 5),
(2014, 29, 'AL', 'TEX', 11, 11, 12, 8),
(2014, 30, 'AL', 'TOR', 7, 7, 11, 15),
(2014, 31, 'NL', 'WASH', 17, 17, 4, 4),
(2015, 2, 'NL', 'ARIZ', 11, 11, 12, 7),
(2015, 3, 'NL', 'ATL', 5, 5, 7, 7),
(2015, 4, 'AL', 'BAL', 8, 8, 18, 11),
(2015, 5, 'AL', 'BOS', 16, 16, 1, 7),
(2015, 6, 'AL', 'CHI(A)', 1, 4, 12, 12),
(2015, 7, 'NL', 'CHI(N)', 13, 6, 8, 14),
(2015, 8, 'NL', 'CIN', 6, 6, 19, 13),
(2015, 9, 'AL', 'CLE', 12, 9, 10, 10),
(2015, 10, 'NL', 'COL', 19, 19, 14, 14),
(2015, 11, 'AL', 'DET', 9, 12, 7, 7),
(2015, 12, 'AL', 'HOU', 3, 6, 13, 13),
(2015, 13, 'AL', 'KC', 12, 12, 5, 5),
(2015, 14, 'AL', 'LA(A)', 6, 6, 6, 6),
(2015, 15, 'NL', 'LA(N)', 2, 2, 11, 11),
(2015, 16, 'NL', 'MIA', 10, 10, 2, 2),
(2015, 17, 'NL', 'MIL', 8, 8, 16, 16),
(2015, 18, 'AL', 'MIN', 12, 12, 7, 7),
(2015, 19, 'AL', 'NY(A)', 10, 4, 16, 16),
(2015, 20, 'NL', 'NY(N)', 1, 1, 11, 11),
(2015, 21, 'AL', 'OAK', 3, 10, 2, 5),
(2015, 22, 'NL', 'PHI', 2, 2, 12, 18),
(2015, 23, 'NL', 'PIT', 10, 10, 7, 2),
(2015, 24, 'NL', 'SD', 1, 1, 12, 3),
(2015, 25, 'NL', 'SF', 11, 5, 1, 1),
(2015, 26, 'AL', 'SEA', 3, 3, 7, 7),
(2015, 27, 'NL', 'STL', 9, 9, 6, 6),
(2015, 28, 'AL', 'TB', 4, 4, 11, 5),
(2015, 29, 'AL', 'TEX', 11, 11, 8, 8),
(2015, 30, 'AL', 'TOR', 5, 5, 14, 14),
(2015, 31, 'NL', 'WASH', 11, 17, 5, 5),
(2016, 2, 'NL', 'ARIZ', 13, 13, 11, 11),
(2016, 3, 'NL', 'ATL', 6, 6, 5, 5),
(2016, 4, 'AL', 'BAL', 8, 8, 13, 10),
(2016, 5, 'AL', 'BOS', 19, 16, 1, 10),
(2016, 6, 'AL', 'CHI(A)', 1, 6, 11, 11),
(2016, 7, 'NL', 'CHI(N)', 4, 4, 3, 12),
(2016, 8, 'NL', 'CIN', 5, 5, 17, 12),
(2016, 9, 'AL', 'CLE', 19, 13, 11, 11),
(2016, 10, 'NL', 'COL', 19, 19, 15, 15),
(2016, 11, 'AL', 'DET', 1, 10, 9, 9),
(2016, 12, 'AL', 'HOU', 1, 4, 9, 9),
(2016, 13, 'AL', 'KC', 13, 13, 3, 3),
(2016, 14, 'AL', 'LA(A)', 3, 3, 7, 7),
(2016, 15, 'NL', 'LA(N)', 1, 1, 15, 9),
(2016, 16, 'NL', 'MIA', 10, 10, 2, 2),
(2016, 17, 'NL', 'MIL', 9, 2, 19, 13),
(2016, 18, 'AL', 'MIN', 12, 12, 9, 9),
(2016, 19, 'AL', 'NY(A)', 3, 3, 19, 16),
(2016, 20, 'NL', 'NY(N)', 1, 1, 11, 11),
(2016, 21, 'AL', 'OAK', 8, 8, 4, 4),
(2016, 22, 'NL', 'PHI', 1, 1, 13, 13),
(2016, 23, 'NL', 'PIT', 11, 11, 9, 3),
(2016, 24, 'NL', 'SD', 7, 7, 6, 11),
(2016, 25, 'NL', 'SF', 11, 11, 1, 1),
(2016, 26, 'AL', 'SEA', 1, 1, 10, 10),
(2016, 27, 'NL', 'STL', 10, 10, 6, 6),
(2016, 28, 'AL', 'TB', 3, 3, 8, 5),
(2016, 29, 'AL', 'TEX', 13, 13, 9, 9),
(2016, 30, 'AL', 'TOR', 8, 8, 11, 11),
(2016, 31, 'NL', 'WASH', 10, 10, 4, 9),
(2017, 2, 'NL', 'ARIZ', 15, 15, 11, 11),
(2017, 3, 'NL', 'ATL', 14, 8, 14, 14),
(2017, 4, 'AL', 'BAL', 8, 8, 13, 13),
(2017, 5, 'AL', 'BOS', 19, 19, 1, 9),
(2017, 6, 'AL', 'CHI(A)', 1, 1, 12, 12),
(2017, 7, 'NL', 'CHI(N)', 6, 6, 3, 12),
(2017, 8, 'NL', 'CIN', 5, 5, 14, 11),
(2017, 9, 'AL', 'CLE', 19, 16, 9, 9),
(2017, 10, 'NL', 'COL', 19, 19, 13, 13),
(2017, 11, 'AL', 'DET', 5, 11, 9, 9),
(2017, 12, 'AL', 'HOU', 1, 1, 11, 11),
(2017, 13, 'AL', 'KC', 12, 12, 3, 3),
(2017, 14, 'AL', 'LA(A)', 3, 3, 8, 8),
(2017, 15, 'NL', 'LA(N)', 3, 3, 13, 7),
(2017, 16, 'NL', 'MIA', 1, 1, 4, 4),
(2017, 17, 'NL', 'MIL', 9, 3, 17, 11),
(2017, 18, 'AL', 'MIN', 12, 12, 6, 12),
(2017, 19, 'AL', 'NY(A)', 1, 1, 19, 14),
(2017, 20, 'NL', 'NY(N)', 1, 1, 8, 8),
(2017, 21, 'AL', 'OAK', 6, 6, 5, 5),
(2017, 22, 'NL', 'PHI', 2, 2, 15, 15),
(2017, 23, 'NL', 'PIT', 6, 12, 10, 4),
(2017, 24, 'NL', 'SD', 6, 6, 5, 8),
(2017, 25, 'NL', 'SF', 9, 12, 1, 1),
(2017, 26, 'AL', 'SEA', 2, 2, 8, 8),
(2017, 27, 'NL', 'STL', 10, 10, 7, 4),
(2017, 28, 'AL', 'TB', 2, 2, 6, 6),
(2017, 29, 'AL', 'TEX', 18, 18, 10, 10),
(2017, 30, 'AL', 'TOR', 9, 9, 8, 8),
(2017, 31, 'NL', 'WASH', 4, 13, 5, 11),
(2018, 2, 'NL', 'ARIZ', 15, 9, 8, 8),
(2018, 3, 'NL', 'ATL', 11, 11, 6, 6),
(2018, 4, 'AL', 'BAL', 7, 7, 9, 12),
(2018, 5, 'AL', 'BOS', 19, 19, 2, 8),
(2018, 6, 'AL', 'CHI(A)', 1, 7, 10, 10),
(2018, 7, 'NL', 'CHI(N)', 10, 10, 3, 12),
(2018, 8, 'NL', 'CIN', 3, 3, 15, 15),
(2018, 9, 'AL', 'CLE', 19, 12, 13, 7),
(2018, 10, 'NL', 'COL', 19, 19, 15, 15),
(2018, 11, 'AL', 'DET', 4, 13, 9, 9),
(2018, 12, 'AL', 'HOU', 1, 1, 8, 11),
(2018, 13, 'AL', 'KC', 15, 12, 3, 3),
(2018, 14, 'AL', 'LA(A)', 1, 1, 16, 10),
(2018, 15, 'NL', 'LA(N)', 4, 4, 15, 9),
(2018, 16, 'NL', 'MIA', 1, 1, 5, 2),
(2018, 17, 'NL', 'MIL', 5, 5, 16, 10),
(2018, 18, 'AL', 'MIN', 5, 5, 15, 9),
(2018, 19, 'AL', 'NY(A)', 3, 9, 17, 14),
(2018, 20, 'NL', 'NY(N)', 1, 1, 6, 9),
(2018, 21, 'AL', 'OAK', 4, 7, 4, 4),
(2018, 22, 'NL', 'PHI', 1, 1, 16, 16),
(2018, 23, 'NL', 'PIT', 12, 12, 9, 3),
(2018, 24, 'NL', 'SD', 9, 6, 5, 8),
(2018, 25, 'NL', 'SF', 9, 15, 1, 1),
(2018, 26, 'AL', 'SEA', 2, 2, 9, 9),
(2018, 27, 'NL', 'STL', 8, 8, 8, 5),
(2018, 28, 'AL', 'TB', 3, 3, 6, 6),
(2018, 29, 'AL', 'TEX', 19, 19, 11, 11),
(2018, 30, 'AL', 'TOR', 10, 10, 8, 8),
(2018, 31, 'NL', 'WASH', 12, 12, 7, 13),
(2019, 2, 'NL', 'ARIZ', 15, 6, 7, 7),
(2019, 3, 'NL', 'ATL', 10, 10, 8, 8),
(2019, 4, 'AL', 'BAL', 10, 7, 11, 14),
(2019, 5, 'AL', 'BOS', 14, 14, 3, 6),
(2019, 6, 'AL', 'CHI(A)', 2, 2, 14, 11),
(2019, 7, 'NL', 'CHI(N)', 13, 10, 5, 11),
(2019, 8, 'NL', 'CIN', 4, 4, 14, 14),
(2019, 9, 'AL', 'CLE', 12, 6, 11, 8),
(2019, 10, 'NL', 'COL', 19, 19, 15, 15),
(2019, 11, 'AL', 'DET', 7, 16, 6, 9),
(2019, 12, 'AL', 'HOU', 3, 3, 12, 12),
(2019, 13, 'AL', 'KC', 19, 11, 3, 3),
(2019, 14, 'AL', 'LA(A)', 2, 2, 14, 8),
(2019, 15, 'NL', 'LA(N)', 4, 4, 14, 11),
(2019, 16, 'NL', 'MIA', 1, 7, 3, 3),
(2019, 17, 'NL', 'MIL', 4, 4, 11, 11),
(2019, 18, 'AL', 'MIN', 12, 12, 8, 8),
(2019, 19, 'AL', 'NY(A)', 4, 7, 13, 10),
(2019, 20, 'NL', 'NY(N)', 1, 1, 5, 8),
(2019, 21, 'AL', 'OAK', 2, 8, 5, 5),
(2019, 22, 'NL', 'PHI', 4, 4, 16, 16),
(2019, 23, 'NL', 'PIT', 9, 9, 8, 5),
(2019, 24, 'NL', 'SD', 6, 3, 4, 7),
(2019, 25, 'NL', 'SF', 6, 9, 1, 1),
(2019, 26, 'AL', 'SEA', 3, 3, 7, 7),
(2019, 27, 'NL', 'STL', 7, 7, 8, 5),
(2019, 28, 'AL', 'TB', 2, 5, 6, 6),
(2019, 29, 'AL', 'TEX', 19, 19, 11, 11),
(2019, 30, 'AL', 'TOR', 5, 5, 12, 12),
(2019, 31, 'NL', 'WASH', 17, 14, 13, 13);