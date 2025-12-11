-- MySQL dump 10.13  Distrib 9.4.0, for Linux (aarch64)
--
-- Host: localhost    Database: ayaka_db
-- ------------------------------------------------------
-- Server version	9.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `artifact`
--

DROP TABLE IF EXISTS `artifact`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `artifact` (
  `ArtifactID` int NOT NULL AUTO_INCREMENT,
  `ArtifactType` enum('Flower','Feather','Goblet','Sands','Circlet') NOT NULL,
  `Rarity` enum('1','2','3','4','5') NOT NULL,
  `SetKey` varchar(50) NOT NULL,
  `Level` int NOT NULL,
  `MainStatType` enum('ATK%','ATK','HP%','HP','DEF%','EM','ER%','Pyro%','Dendro%','Anemo%','Electro%','Cryo%','Hydro%','Physical%','HealingBonus','CritRate','CritDMG') NOT NULL,
  `FirstArtifactStatID` int NOT NULL,
  `SecondArtifactStatID` int DEFAULT NULL,
  `ThirdArtifactStatID` int DEFAULT NULL,
  `FourthArtifactStatID` int DEFAULT NULL,
  `UserID` int NOT NULL,
  PRIMARY KEY (`ArtifactID`),
  KEY `FirstArtifactStatID` (`FirstArtifactStatID`),
  KEY `SecondArtifactStatID` (`SecondArtifactStatID`),
  KEY `ThirdArtifactStatID` (`ThirdArtifactStatID`),
  KEY `FourthArtifactStatID` (`FourthArtifactStatID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `artifact_ibfk_1` FOREIGN KEY (`FirstArtifactStatID`) REFERENCES `artifactstat` (`ArtifactStatID`),
  CONSTRAINT `artifact_ibfk_2` FOREIGN KEY (`SecondArtifactStatID`) REFERENCES `artifactstat` (`ArtifactStatID`),
  CONSTRAINT `artifact_ibfk_3` FOREIGN KEY (`ThirdArtifactStatID`) REFERENCES `artifactstat` (`ArtifactStatID`),
  CONSTRAINT `artifact_ibfk_4` FOREIGN KEY (`FourthArtifactStatID`) REFERENCES `artifactstat` (`ArtifactStatID`),
  CONSTRAINT `artifact_ibfk_5` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`),
  CONSTRAINT `artifact_chk_1` CHECK ((`Level` >= 0)),
  CONSTRAINT `artifact_chk_2` CHECK ((`Level` <= 20))
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `artifactstat`
--

DROP TABLE IF EXISTS `artifactstat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `artifactstat` (
  `ArtifactStatID` int NOT NULL AUTO_INCREMENT,
  `StatType` enum('ATK%','ATK','HP%','HP','DEF%','DEF','EM','ER%','Pyro%','Dendro%','Anemo%','Electro%','Cryo%','Hydro%','Physical%','HealingBonus','CritRate','CritDMG') NOT NULL,
  `Value` decimal(5,2) NOT NULL,
  PRIMARY KEY (`ArtifactStatID`)
) ENGINE=InnoDB AUTO_INCREMENT=109 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `build`
--

DROP TABLE IF EXISTS `build`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `build` (
  `BuildID` int NOT NULL AUTO_INCREMENT,
  `BuildName` varchar(255) NOT NULL,
  `CharacterID` int NOT NULL,
  `FlowerID` int DEFAULT NULL,
  `FeatherID` int DEFAULT NULL,
  `SandsID` int DEFAULT NULL,
  `GobletID` int DEFAULT NULL,
  `CircletID` int DEFAULT NULL,
  `UserID` int NOT NULL,
  `WeaponID` int DEFAULT NULL,
  PRIMARY KEY (`BuildID`),
  KEY `CharacterID` (`CharacterID`),
  KEY `FlowerID` (`FlowerID`),
  KEY `FeatherID` (`FeatherID`),
  KEY `SandsID` (`SandsID`),
  KEY `GobletID` (`GobletID`),
  KEY `CircletID` (`CircletID`),
  KEY `UserID` (`UserID`),
  KEY `build_ibfk_8` (`WeaponID`),
  CONSTRAINT `build_ibfk_1` FOREIGN KEY (`CharacterID`) REFERENCES `characters` (`CharacterID`),
  CONSTRAINT `build_ibfk_2` FOREIGN KEY (`FlowerID`) REFERENCES `artifact` (`ArtifactID`),
  CONSTRAINT `build_ibfk_3` FOREIGN KEY (`FeatherID`) REFERENCES `artifact` (`ArtifactID`),
  CONSTRAINT `build_ibfk_4` FOREIGN KEY (`SandsID`) REFERENCES `artifact` (`ArtifactID`),
  CONSTRAINT `build_ibfk_5` FOREIGN KEY (`GobletID`) REFERENCES `artifact` (`ArtifactID`),
  CONSTRAINT `build_ibfk_6` FOREIGN KEY (`CircletID`) REFERENCES `artifact` (`ArtifactID`),
  CONSTRAINT `build_ibfk_7` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`),
  CONSTRAINT `build_ibfk_8` FOREIGN KEY (`WeaponID`) REFERENCES `weapon` (`WeaponID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `characters`
--

DROP TABLE IF EXISTS `characters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `characters` (
  `CharacterID` int NOT NULL AUTO_INCREMENT,
  `BaseCharacterKey` varchar(50) NOT NULL,
  `Rarity` enum('4','5') NOT NULL,
  `Name` varchar(30) NOT NULL,
  `Level` int NOT NULL,
  `Ascension` int NOT NULL,
  `TalentLevel1` int NOT NULL,
  `TalentLevel2` int NOT NULL,
  `TalentLevel3` int NOT NULL,
  `ConstellationLevel` int NOT NULL,
  `UserID` int NOT NULL,
  PRIMARY KEY (`CharacterID`),
  KEY `UserID` (`UserID`),
  KEY `i_characters` (`CharacterID`),
  CONSTRAINT `characters_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`),
  CONSTRAINT `characters_chk_1` CHECK ((`Level` >= 0)),
  CONSTRAINT `characters_chk_2` CHECK ((`Ascension` >= 0)),
  CONSTRAINT `characters_chk_3` CHECK ((`Ascension` <= 6)),
  CONSTRAINT `characters_chk_4` CHECK ((`ConstellationLevel` >= 0)),
  CONSTRAINT `characters_chk_5` CHECK ((`ConstellationLevel` <= 6))
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `team`
--

DROP TABLE IF EXISTS `team`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `team` (
  `TeamID` int NOT NULL AUTO_INCREMENT,
  `TeamName` varchar(255) NOT NULL,
  `FirstCharacterID` int DEFAULT NULL,
  `SecondCharacterID` int DEFAULT NULL,
  `ThirdCharacterID` int DEFAULT NULL,
  `FourthCharacterID` int DEFAULT NULL,
  `UserID` int NOT NULL,
  PRIMARY KEY (`TeamID`),
  KEY `FirstCharacterID` (`FirstCharacterID`),
  KEY `SecondCharacterID` (`SecondCharacterID`),
  KEY `ThirdCharacterID` (`ThirdCharacterID`),
  KEY `FourthCharacterID` (`FourthCharacterID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `team_ibfk_1` FOREIGN KEY (`FirstCharacterID`) REFERENCES `characters` (`CharacterID`),
  CONSTRAINT `team_ibfk_2` FOREIGN KEY (`SecondCharacterID`) REFERENCES `characters` (`CharacterID`),
  CONSTRAINT `team_ibfk_3` FOREIGN KEY (`ThirdCharacterID`) REFERENCES `characters` (`CharacterID`),
  CONSTRAINT `team_ibfk_4` FOREIGN KEY (`FourthCharacterID`) REFERENCES `characters` (`CharacterID`),
  CONSTRAINT `team_ibfk_5` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `UserID` int NOT NULL AUTO_INCREMENT,
  `GoogleID` varchar(255) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `DisplayName` varchar(255) NOT NULL,
  `AdventureRank` int DEFAULT NULL,
  `AccountName` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`UserID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary view structure for view `v_buildswithdetails`
--

DROP TABLE IF EXISTS `v_buildswithdetails`;
/*!50001 DROP VIEW IF EXISTS `v_buildswithdetails`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_buildswithdetails` AS SELECT 
 1 AS `BuildID`,
 1 AS `BuildName`,
 1 AS `UserID`,
 1 AS `CharacterID`,
 1 AS `CharacterName`,
 1 AS `CharacterKey`,
 1 AS `CharacterLevel`,
 1 AS `WeaponID`,
 1 AS `WeaponKey`,
 1 AS `WeaponLevel`,
 1 AS `WeaponRefinement`,
 1 AS `FlowerID`,
 1 AS `FeatherID`,
 1 AS `SandsID`,
 1 AS `GobletID`,
 1 AS `CircletID`,
 1 AS `FlowerSetKey`,
 1 AS `FlowerMainStat`,
 1 AS `FlowerLevel`,
 1 AS `FlowerRarity`,
 1 AS `FeatherSetKey`,
 1 AS `FeatherMainStat`,
 1 AS `FeatherLevel`,
 1 AS `FeatherRarity`,
 1 AS `SandsSetKey`,
 1 AS `SandsMainStat`,
 1 AS `SandsLevel`,
 1 AS `SandsRarity`,
 1 AS `GobletSetKey`,
 1 AS `GobletMainStat`,
 1 AS `GobletLevel`,
 1 AS `GobletRarity`,
 1 AS `CircletSetKey`,
 1 AS `CircletMainStat`,
 1 AS `CircletLevel`,
 1 AS `CircletRarity`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_charactersbyrarity`
--

DROP TABLE IF EXISTS `v_charactersbyrarity`;
/*!50001 DROP VIEW IF EXISTS `v_charactersbyrarity`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_charactersbyrarity` AS SELECT 
 1 AS `Rarity`,
 1 AS `NumberOfCharacters`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_levelstats`
--

DROP TABLE IF EXISTS `v_levelstats`;
/*!50001 DROP VIEW IF EXISTS `v_levelstats`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_levelstats` AS SELECT 
 1 AS `AverageWeaponLevel`,
 1 AS `AverageCharacterLevel`,
 1 AS `AverageArtifactLevel`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_teamswithcharacters`
--

DROP TABLE IF EXISTS `v_teamswithcharacters`;
/*!50001 DROP VIEW IF EXISTS `v_teamswithcharacters`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_teamswithcharacters` AS SELECT 
 1 AS `TeamID`,
 1 AS `TeamName`,
 1 AS `FirstCharacterID`,
 1 AS `SecondCharacterID`,
 1 AS `ThirdCharacterID`,
 1 AS `FourthCharacterID`,
 1 AS `FirstCharacterKey`,
 1 AS `FirstCharacterName`,
 1 AS `FirstCharacterLevel`,
 1 AS `SecondCharacterKey`,
 1 AS `SecondCharacterName`,
 1 AS `SecondCharacterLevel`,
 1 AS `ThirdCharacterKey`,
 1 AS `ThirdCharacterName`,
 1 AS `ThirdCharacterLevel`,
 1 AS `FourthCharacterKey`,
 1 AS `FourthCharacterName`,
 1 AS `FourthCharacterLevel`,
 1 AS `UserID`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `weapon`
--

DROP TABLE IF EXISTS `weapon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `weapon` (
  `WeaponID` int NOT NULL AUTO_INCREMENT,
  `BaseWeaponKey` varchar(50) NOT NULL,
  `Level` int NOT NULL,
  `Ascension` int NOT NULL,
  `Refinement` int NOT NULL,
  `UserID` int NOT NULL,
  PRIMARY KEY (`WeaponID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `weapon_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping routines for database 'ayaka_db'
--
/*!50003 DROP PROCEDURE IF EXISTS `sp_createartifact` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`ayaka_user`@`%` PROCEDURE `sp_createartifact`(
    IN ca_artifact_type VARCHAR(10),
    IN ca_rarity VARCHAR(1),
    IN ca_set_key VARCHAR(50),
    IN ca_level INT,
    IN ca_main_stat_type VARCHAR(20),
    IN ca_user_id INT,
    IN ca_stat1_type VARCHAR(20),
    IN ca_stat1_value DECIMAL(5,2),
    IN ca_stat2_type VARCHAR(20),
    IN ca_stat2_value DECIMAL(5,2),
    IN ca_stat3_type VARCHAR(20),
    IN ca_stat3_value DECIMAL(5,2),
    IN ca_stat4_type VARCHAR(20),
    IN ca_stat4_value DECIMAL(5,2),
    OUT ca_artifact_id INT
)
BEGIN
    DECLARE ca_stat1_id INT;
    DECLARE ca_stat2_id INT DEFAULT NULL;
    DECLARE ca_stat3_id INT DEFAULT NULL;
    DECLARE ca_stat4_id INT DEFAULT NULL;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
        BEGIN
            ROLLBACK;
            RESIGNAL;
        END;
    
    START TRANSACTION;
    
    INSERT INTO artifactstat(StatType, Value) 
        VALUES(ca_stat1_type, ca_stat1_value);
    SET ca_stat1_id = LAST_INSERT_ID();
    
    IF ca_stat2_type IS NOT NULL AND ca_stat2_type != '' THEN
        INSERT INTO artifactstat(StatType, Value) 
            VALUES (ca_stat2_type, ca_stat2_value);
        SET ca_stat2_id = LAST_INSERT_ID(); 
    END IF;
    
    IF ca_stat3_type IS NOT NULL AND ca_stat3_type != '' THEN
        INSERT INTO artifactstat(StatType, Value) 
            VALUES (ca_stat3_type, ca_stat3_value);
        SET ca_stat3_id = LAST_INSERT_ID(); 
    END IF;
    
    IF ca_stat4_type IS NOT NULL AND ca_stat4_type != '' THEN
        INSERT INTO artifactstat(StatType, Value) 
            VALUES (ca_stat4_type, ca_stat4_value);
        SET ca_stat4_id = LAST_INSERT_ID(); 
    END IF;
    
    INSERT INTO artifact(ArtifactType, Rarity, SetKey, Level, MainStatType, FirstArtifactStatID, SecondArtifactStatID, ThirdArtifactStatID, FourthArtifactStatID, UserID) 
        VALUES(ca_artifact_type, ca_rarity, ca_set_key, ca_level, ca_main_stat_type, ca_stat1_id, ca_stat2_id, ca_stat3_id, ca_stat4_id, ca_user_id); 
    
    SET ca_artifact_id = LAST_INSERT_ID();
    
    COMMIT;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Final view structure for view `v_buildswithdetails`
--

/*!50001 DROP VIEW IF EXISTS `v_buildswithdetails`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`ayaka_user`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `v_buildswithdetails` AS select `b`.`BuildID` AS `BuildID`,`b`.`BuildName` AS `BuildName`,`b`.`UserID` AS `UserID`,`b`.`CharacterID` AS `CharacterID`,`c`.`Name` AS `CharacterName`,`c`.`BaseCharacterKey` AS `CharacterKey`,`c`.`Level` AS `CharacterLevel`,`b`.`WeaponID` AS `WeaponID`,`w`.`BaseWeaponKey` AS `WeaponKey`,`w`.`Level` AS `WeaponLevel`,`w`.`Refinement` AS `WeaponRefinement`,`b`.`FlowerID` AS `FlowerID`,`b`.`FeatherID` AS `FeatherID`,`b`.`SandsID` AS `SandsID`,`b`.`GobletID` AS `GobletID`,`b`.`CircletID` AS `CircletID`,`a1`.`SetKey` AS `FlowerSetKey`,`a1`.`MainStatType` AS `FlowerMainStat`,`a1`.`Level` AS `FlowerLevel`,`a1`.`Rarity` AS `FlowerRarity`,`a2`.`SetKey` AS `FeatherSetKey`,`a2`.`MainStatType` AS `FeatherMainStat`,`a2`.`Level` AS `FeatherLevel`,`a2`.`Rarity` AS `FeatherRarity`,`a3`.`SetKey` AS `SandsSetKey`,`a3`.`MainStatType` AS `SandsMainStat`,`a3`.`Level` AS `SandsLevel`,`a3`.`Rarity` AS `SandsRarity`,`a4`.`SetKey` AS `GobletSetKey`,`a4`.`MainStatType` AS `GobletMainStat`,`a4`.`Level` AS `GobletLevel`,`a4`.`Rarity` AS `GobletRarity`,`a5`.`SetKey` AS `CircletSetKey`,`a5`.`MainStatType` AS `CircletMainStat`,`a5`.`Level` AS `CircletLevel`,`a5`.`Rarity` AS `CircletRarity` from (((((((`build` `b` join `characters` `c` on((`b`.`CharacterID` = `c`.`CharacterID`))) left join `weapon` `w` on((`b`.`WeaponID` = `w`.`WeaponID`))) left join `artifact` `a1` on((`b`.`FlowerID` = `a1`.`ArtifactID`))) left join `artifact` `a2` on((`b`.`FeatherID` = `a2`.`ArtifactID`))) left join `artifact` `a3` on((`b`.`SandsID` = `a3`.`ArtifactID`))) left join `artifact` `a4` on((`b`.`GobletID` = `a4`.`ArtifactID`))) left join `artifact` `a5` on((`b`.`CircletID` = `a5`.`ArtifactID`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_charactersbyrarity`
--

/*!50001 DROP VIEW IF EXISTS `v_charactersbyrarity`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`ayaka_user`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `v_charactersbyrarity` AS select `characters`.`Rarity` AS `Rarity`,count(0) AS `NumberOfCharacters` from `characters` group by `characters`.`Rarity` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_levelstats`
--

/*!50001 DROP VIEW IF EXISTS `v_levelstats`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`ayaka_user`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `v_levelstats` AS select avg(`weapon`.`Level`) AS `AverageWeaponLevel`,(select avg(`characters`.`Level`) from `characters`) AS `AverageCharacterLevel`,(select avg(`artifact`.`Level`) from `artifact`) AS `AverageArtifactLevel` from `weapon` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_teamswithcharacters`
--

/*!50001 DROP VIEW IF EXISTS `v_teamswithcharacters`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`ayaka_user`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `v_teamswithcharacters` AS select `team`.`TeamID` AS `TeamID`,`team`.`TeamName` AS `TeamName`,`team`.`FirstCharacterID` AS `FirstCharacterID`,`team`.`SecondCharacterID` AS `SecondCharacterID`,`team`.`ThirdCharacterID` AS `ThirdCharacterID`,`team`.`FourthCharacterID` AS `FourthCharacterID`,`c1`.`BaseCharacterKey` AS `FirstCharacterKey`,`c1`.`Name` AS `FirstCharacterName`,`c1`.`Level` AS `FirstCharacterLevel`,`c2`.`BaseCharacterKey` AS `SecondCharacterKey`,`c2`.`Name` AS `SecondCharacterName`,`c2`.`Level` AS `SecondCharacterLevel`,`c3`.`BaseCharacterKey` AS `ThirdCharacterKey`,`c3`.`Name` AS `ThirdCharacterName`,`c3`.`Level` AS `ThirdCharacterLevel`,`c4`.`BaseCharacterKey` AS `FourthCharacterKey`,`c4`.`Name` AS `FourthCharacterName`,`c4`.`Level` AS `FourthCharacterLevel`,`team`.`UserID` AS `UserID` from ((((`team` left join `characters` `c1` on((`team`.`FirstCharacterID` = `c1`.`CharacterID`))) left join `characters` `c2` on((`team`.`SecondCharacterID` = `c2`.`CharacterID`))) left join `characters` `c3` on((`team`.`ThirdCharacterID` = `c3`.`CharacterID`))) left join `characters` `c4` on((`team`.`FourthCharacterID` = `c4`.`CharacterID`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-11 18:06:06
