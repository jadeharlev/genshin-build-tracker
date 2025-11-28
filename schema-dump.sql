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
  `SecondArtifactStatID` int NOT NULL,
  `ThirdArtifactStatID` int NOT NULL,
  `FourthArtifactStatID` int NOT NULL,
  PRIMARY KEY (`ArtifactID`),
  KEY `FirstArtifactStatID` (`FirstArtifactStatID`),
  KEY `SecondArtifactStatID` (`SecondArtifactStatID`),
  KEY `ThirdArtifactStatID` (`ThirdArtifactStatID`),
  KEY `FourthArtifactStatID` (`FourthArtifactStatID`),
  CONSTRAINT `artifact_ibfk_1` FOREIGN KEY (`FirstArtifactStatID`) REFERENCES `artifactstat` (`ArtifactStatID`),
  CONSTRAINT `artifact_ibfk_2` FOREIGN KEY (`SecondArtifactStatID`) REFERENCES `artifactstat` (`ArtifactStatID`),
  CONSTRAINT `artifact_ibfk_3` FOREIGN KEY (`ThirdArtifactStatID`) REFERENCES `artifactstat` (`ArtifactStatID`),
  CONSTRAINT `artifact_ibfk_4` FOREIGN KEY (`FourthArtifactStatID`) REFERENCES `artifactstat` (`ArtifactStatID`),
  CONSTRAINT `artifact_chk_1` CHECK ((`Level` >= 0)),
  CONSTRAINT `artifact_chk_2` CHECK ((`Level` <= 20))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
  `FlowerID` int NOT NULL,
  `FeatherID` int NOT NULL,
  `SandsID` int NOT NULL,
  `GobletID` int NOT NULL,
  `CircletID` int NOT NULL,
  `UserID` int NOT NULL,
  PRIMARY KEY (`BuildID`),
  KEY `CharacterID` (`CharacterID`),
  KEY `FlowerID` (`FlowerID`),
  KEY `FeatherID` (`FeatherID`),
  KEY `SandsID` (`SandsID`),
  KEY `GobletID` (`GobletID`),
  KEY `CircletID` (`CircletID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `build_ibfk_1` FOREIGN KEY (`CharacterID`) REFERENCES `characters` (`CharacterID`),
  CONSTRAINT `build_ibfk_2` FOREIGN KEY (`FlowerID`) REFERENCES `artifact` (`ArtifactID`),
  CONSTRAINT `build_ibfk_3` FOREIGN KEY (`FeatherID`) REFERENCES `artifact` (`ArtifactID`),
  CONSTRAINT `build_ibfk_4` FOREIGN KEY (`SandsID`) REFERENCES `artifact` (`ArtifactID`),
  CONSTRAINT `build_ibfk_5` FOREIGN KEY (`GobletID`) REFERENCES `artifact` (`ArtifactID`),
  CONSTRAINT `build_ibfk_6` FOREIGN KEY (`CircletID`) REFERENCES `artifact` (`ArtifactID`),
  CONSTRAINT `build_ibfk_7` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
  CONSTRAINT `characters_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`),
  CONSTRAINT `characters_chk_1` CHECK ((`Level` >= 0)),
  CONSTRAINT `characters_chk_2` CHECK ((`Ascension` >= 0)),
  CONSTRAINT `characters_chk_3` CHECK ((`Ascension` <= 6)),
  CONSTRAINT `characters_chk_4` CHECK ((`ConstellationLevel` >= 0)),
  CONSTRAINT `characters_chk_5` CHECK ((`ConstellationLevel` <= 6))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `weapon`
--

DROP TABLE IF EXISTS `weapon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `weapon` (
  `WeaponID` int NOT NULL AUTO_INCREMENT,
  `BaseWeaponKey` varchar(50) NOT NULL,
  `Rarity` enum('1','2','3','4','5') NOT NULL,
  `WeaponType` enum('sword','polearm','claymore','bow','catalyst') NOT NULL,
  `Level` int NOT NULL,
  `Ascension` int NOT NULL,
  `Refinement` int NOT NULL,
  `UserID` int NOT NULL,
  PRIMARY KEY (`WeaponID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `weapon_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-27 19:30:34
