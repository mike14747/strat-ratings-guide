DROP DATABASE IF EXISTS ratings_guide_db;
CREATE DATABASE ratings_guide_db;
USE ratings_guide_db;

set foreign_key_checks=0;

-- --------------------------------------------------------

CREATE TABLE `bp_ratings` (
    `bp_rating_id` int unsigned NOT NULL AUTO_INCREMENT,
    `bp_year` int NOT NULL,
    `real_team_id` int unsigned NOT NULL,
    FOREIGN KEY (real_team_id) REFERENCES real_teams(real_team_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    `real_team_league` varchar(2) NOT NULL,
    `real_team_abbrev` varchar(10) NOT NULL,
    `st_si_l` int unsigned NOT NULL,
    `st_si_r` int unsigned NOT NULL,
    `st_hr_l` int unsigned NOT NULL,
    `st_hr_r` int unsigned NOT NULL,
    PRIMARY KEY (`bp_rating_id`)
) AUTO_INCREMENT = 1;

-- --------------------------------------------------------

CREATE TABLE `hitter_ratings` (
    `hitter_id` int unsigned NOT NULL AUTO_INCREMENT,
    `h_year` int NOT NULL,
    `real_team` varchar(10) NOT NULL,
    `real_team_id` int unsigned DEFAULT NULL,
    `hitter_name` varchar(30) NOT NULL,
    `bats` varchar(1) NOT NULL,
    `injury` varchar(1) NOT NULL,
    `ab` int unsigned NOT NULL,
    `so_v_l` int unsigned NOT NULL,
    `bb_v_l` int unsigned NOT NULL,
    `hit_v_l` decimal(4,1) unsigned NOT NULL,
    `ob_v_l` decimal(4,1) unsigned NOT NULL,
    `tb_v_l` decimal(4,1) unsigned NOT NULL,
    `hr_v_l` decimal(4,1) unsigned NOT NULL,
    `bp_hr_v_l` int unsigned NOT NULL,
    `w_v_l` varchar(1) NOT NULL,
    `bp_si_v_l` int unsigned NOT NULL,
    `cl_v_l` int NOT NULL,
    `dp_v_l` int unsigned NOT NULL,
    `so_v_r` int unsigned NOT NULL,
    `bb_v_r` int unsigned NOT NULL,
    `hit_v_r` decimal(4,1) unsigned NOT NULL,
    `ob_v_r` decimal(4,1) unsigned NOT NULL,
    `tb_v_r` decimal(4,1) unsigned NOT NULL,
    `hr_v_r` decimal(4,1) unsigned NOT NULL,
    `bp_hr_v_r` int unsigned NOT NULL,
    `w_v_r` varchar(1) NOT NULL,
    `bp_si_v_r` int unsigned NOT NULL,
    `cl_v_r` int NOT NULL,
    `dp_v_r` int unsigned NOT NULL,
    `stealing` varchar(30) NOT NULL,
    `stl` varchar(1) NOT NULL,
    `spd` int unsigned NOT NULL,
    `bunt` varchar(1) NOT NULL,
    `h_r` varchar(1) NOT NULL,
    `ca_range` varchar(1) NOT NULL,
    `1b_range` varchar(1) NOT NULL,
    `2b_range` varchar(1) NOT NULL,
    `3b_range` varchar(1) NOT NULL,
    `ss_range` varchar(1) NOT NULL,
    `lf_range` varchar(1) NOT NULL,
    `cf_range` varchar(1) NOT NULL,
    `rf_range` varchar(1) NOT NULL,
    `ca_e_num` varchar(2) NOT NULL,
    `1b_e_num` varchar(2) NOT NULL,
    `2b_e_num` varchar(2) NOT NULL,
    `3b_e_num` varchar(2) NOT NULL,
    `ss_e_num` varchar(2) NOT NULL,
    `lf_e_num` varchar(2) NOT NULL,
    `cf_e_num` varchar(2) NOT NULL,
    `rf_e_num` varchar(2) NOT NULL,
    `fielding` varchar(70) NOT NULL,
    `rml_team_id` int unsigned DEFAULT NULL,
    FOREIGN KEY (rml_team_id) REFERENCES rml_teams(rml_team_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    PRIMARY KEY (`hitter_id`)
) AUTO_INCREMENT=1;

-- --------------------------------------------------------

CREATE TABLE `pitcher_ratings` (
    `pitcher_id` int unsigned NOT NULL AUTO_INCREMENT,
    `p_year` int NOT NULL,
    `real_team` varchar(10) NOT NULL,
    `real_team_id` int unsigned DEFAULT NULL,
    `pitcher_name` varchar(30) NOT NULL,
    `throws` varchar(1) NOT NULL,
    `ip` int unsigned NOT NULL,
    `so_v_l` int unsigned NOT NULL,
    `bb_v_l` int unsigned NOT NULL,
    `hit_v_l` decimal(4,1) unsigned NOT NULL,
    `ob_v_l` decimal(4,1) unsigned NOT NULL,
    `tb_v_l` decimal(4,1) unsigned NOT NULL,
    `hr_v_l` decimal(4,1) unsigned NOT NULL,
    `bp_hr_v_l` int unsigned NOT NULL,
    `bp_si_v_l` int unsigned NOT NULL,
    `dp_v_l` int unsigned NOT NULL,
    `so_v_r` int unsigned NOT NULL,
    `bb_v_r` int unsigned NOT NULL,
    `hit_v_r` decimal(4,1) unsigned NOT NULL,
    `ob_v_r` decimal(4,1) unsigned NOT NULL,
    `tb_v_r` decimal(4,1) unsigned NOT NULL,
    `hr_v_r` decimal(4,1) unsigned NOT NULL,
    `bp_hr_v_r` int unsigned NOT NULL,
    `bp_si_v_r` int unsigned NOT NULL,
    `dp_v_r` int unsigned NOT NULL,
    `ho` int NOT NULL,
    `endurance` varchar(20) NOT NULL,
    `p_range` int unsigned NOT NULL,
    `e_num` int unsigned NOT NULL,
    `balk` int unsigned NOT NULL,
    `wp` int unsigned NOT NULL,
    `batting_b` varchar(6) NOT NULL,
    `stl` varchar(1) NOT NULL,
    `spd` int unsigned NOT NULL,
    `rml_team_id` int unsigned DEFAULT NULL,
    FOREIGN KEY (rml_team_id) REFERENCES rml_teams(rml_team_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    PRIMARY KEY (`pitcher_id`)
) AUTO_INCREMENT=1;

-- --------------------------------------------------------

CREATE TABLE `real_teams` (
    `real_team_id` int unsigned NOT NULL AUTO_INCREMENT,
    `real_team_city` varchar(20) NOT NULL,
    `real_team_name` varchar(20) NOT NULL,
    `real_team_abbrev` varchar(10) NOT NULL,
    `strat_abbrev` varchar(10) NOT NULL,
    `real_team_league` varchar(2) NOT NULL,
    PRIMARY KEY (`real_team_id`)
) AUTO_INCREMENT=1;

-- --------------------------------------------------------

CREATE TABLE `rml_teams` (
    `rml_team_id` int unsigned NOT NULL AUTO_INCREMENT,
    `rml_team_name` varchar(20) NOT NULL,
    `rml_team_abbrev` varchar(10) NOT NULL,
    `rml_team_league` varchar(2) NOT NULL,
    PRIMARY KEY (`rml_team_id`)
) AUTO_INCREMENT=1;

-- --------------------------------------------------------

set foreign_key_checks=1;