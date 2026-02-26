CREATE INDEX i_characters_characterid ON characters(CharacterID);
CREATE INDEX i_characters_userid ON characters(UserID);

-- Run the any of the following if something hasn't correctly carried over from the data dump:
-- CREATE VIEW v_levelstats AS
--     SELECT AVG(weapon.Level) as AverageWeaponLevel,
--            (SELECT AVG(characters.level) FROM characters) as AverageCharacterLevel,
--            (SELECT AVG(artifact.level) FROM artifact) as AverageArtifactLevel
--     FROM weapon;

-- SELECT * FROM v_levelstats;

-- CREATE VIEW v_charactersbyrarity AS
--     SELECT characters.Rarity, COUNT(*) as NumberOfCharacters
--     FROM characters
--     GROUP BY characters.Rarity;


-- CREATE VIEW v_teamswithcharacters AS
--     SELECT team.TeamID, TeamName, FirstCharacterID, SecondCharacterID, ThirdCharacterID, FourthCharacterID,
--            c1.BaseCharacterKey AS FirstCharacterKey, c1.Name AS FirstCharacterName, c1.Level AS FirstCharacterLevel,
--            c2.BaseCharacterKey AS SecondCharacterKey, c2.Name AS SecondCharacterName, c2.Level AS SecondCharacterLevel,
--            c3.BaseCharacterKey AS ThirdCharacterKey, c3.Name AS ThirdCharacterName, c3.Level AS ThirdCharacterLevel,
--            c4.BaseCharacterKey AS FourthCharacterKey, c4.Name AS FourthCharacterName, c4.Level AS FourthCharacterLevel, 
--            team.UserID
--         FROM team
--     LEFT JOIN characters c1 ON team.FirstCharacterID = c1.CharacterID
--     LEFT JOIN characters c2 ON team.SecondCharacterID = c2.CharacterID
--     LEFT JOIN characters c3 ON team.ThirdCharacterID = c3.CharacterID
--     LEFT JOIN characters c4 ON team.FourthCharacterID = c4.CharacterID

-- DROP VIEW IF EXISTS v_buildswithdetails;

-- CREATE VIEW v_buildswithdetails AS
--     SELECT b.BuildID, b.BuildName, b.UserID,
--            b.CharacterID, c.Name AS CharacterName,
--            c.BaseCharacterKey AS CharacterKey,
--            c.Level AS CharacterLevel,
--            b.WeaponID,
--            w.BaseWeaponKey AS WeaponKey,
--            w.Level AS WeaponLevel,
--            w.Refinement AS WeaponRefinement,
--            b.FlowerID, b.FeatherID, b.SandsID, b.GobletID, b.CircletID,
--            a1.SetKey AS FlowerSetKey,
--            a1.MainStatType AS FlowerMainStat,
--            a1.Level AS FlowerLevel,
--            a1.Rarity AS FlowerRarity,
--            a2.SetKey AS FeatherSetKey,
--            a2.MainStatType AS FeatherMainStat,
--            a2.Level AS FeatherLevel,
--            a2.Rarity AS FeatherRarity,
--            a3.SetKey AS SandsSetKey,
--            a3.MainStatType AS SandsMainStat,
--            a3.Level AS SandsLevel,
--            a3.Rarity AS SandsRarity,
--            a4.SetKey AS GobletSetKey,
--            a4.MainStatType AS GobletMainStat,
--            a4.Level AS GobletLevel,
--            a4.Rarity AS GobletRarity,
--            a5.SetKey AS CircletSetKey,
--            a5.MainStatType AS CircletMainStat,
--            a5.Level AS CircletLevel,
--            a5.Rarity AS CircletRarity
--     FROM build b
--     INNER JOIN characters c on b.CharacterID = c.CharacterID
--     LEFT JOIN weapon w on b.WeaponID = w.WeaponID
--     LEFT JOIN artifact a1 ON b.FlowerID = a1.ArtifactID
--     LEFT JOIN artifact a2 ON b.FeatherID = a2.ArtifactID
--     LEFT JOIN artifact a3 ON b.SandsID = a3.ArtifactID
--     LEFT JOIN artifact a4 ON b.GobletID = a4.ArtifactID
--     LEFT JOIN artifact a5 ON b.CircletID = a5.ArtifactID;

-- # NOTE: using procedural variables: https://stackoverflow.com/questions/18832005/mysql-stored-procedures-variable-declaration-and-conditional-statements
-- # NOTE: had to get rid of enums for this because they'll be validated later anyway, and the enums are too restrictive (no blank strings).
-- # NOTE: namespaced all variables to avoid duplicate names
-- # NOTE: rollback on exception: https://stackoverflow.com/questions/19905900/mysql-transaction-roll-back-on-any-exception
-- DELIMITER $$
-- CREATE PROCEDURE sp_createartifact(
--     IN ca_artifact_type VARCHAR(10),
--     IN ca_rarity VARCHAR(1),
--     IN ca_set_key VARCHAR(50),
--     IN ca_level INT,
--     IN ca_main_stat_type VARCHAR(20),
--     IN ca_user_id INT,
--     IN ca_stat1_type VARCHAR(20),
--     IN ca_stat1_value DECIMAL(5,2),
--     IN ca_stat2_type VARCHAR(20),
--     IN ca_stat2_value DECIMAL(5,2),
--     IN ca_stat3_type VARCHAR(20),
--     IN ca_stat3_value DECIMAL(5,2),
--     IN ca_stat4_type VARCHAR(20),
--     IN ca_stat4_value DECIMAL(5,2),
--     OUT ca_artifact_id INT
-- )
-- BEGIN
--     DECLARE ca_stat1_id INT;
--     DECLARE ca_stat2_id INT DEFAULT NULL;
--     DECLARE ca_stat3_id INT DEFAULT NULL;
--     DECLARE ca_stat4_id INT DEFAULT NULL;

--     DECLARE EXIT HANDLER FOR SQLEXCEPTION
--         BEGIN
--             ROLLBACK;
--             RESIGNAL;
--         END;
    
--     START TRANSACTION;
    
--     INSERT INTO artifactstat(StatType, Value) 
--         VALUES(ca_stat1_type, ca_stat1_value);
--     SET ca_stat1_id = LAST_INSERT_ID();
    
--     IF ca_stat2_type IS NOT NULL AND ca_stat2_type != '' THEN
--         INSERT INTO artifactstat(StatType, Value) 
--             VALUES (ca_stat2_type, ca_stat2_value);
--         SET ca_stat2_id = LAST_INSERT_ID(); 
--     END IF;
    
--     IF ca_stat3_type IS NOT NULL AND ca_stat3_type != '' THEN
--         INSERT INTO artifactstat(StatType, Value) 
--             VALUES (ca_stat3_type, ca_stat3_value);
--         SET ca_stat3_id = LAST_INSERT_ID(); 
--     END IF;
    
--     IF ca_stat4_type IS NOT NULL AND ca_stat4_type != '' THEN
--         INSERT INTO artifactstat(StatType, Value) 
--             VALUES (ca_stat4_type, ca_stat4_value);
--         SET ca_stat4_id = LAST_INSERT_ID(); 
--     END IF;
    
--     INSERT INTO artifact(ArtifactType, Rarity, SetKey, Level, MainStatType, FirstArtifactStatID, SecondArtifactStatID, ThirdArtifactStatID, FourthArtifactStatID, UserID) 
--         VALUES(ca_artifact_type, ca_rarity, ca_set_key, ca_level, ca_main_stat_type, ca_stat1_id, ca_stat2_id, ca_stat3_id, ca_stat4_id, ca_user_id); 
    
--     SET ca_artifact_id = LAST_INSERT_ID();
    
--     COMMIT;
-- END $$
-- DELIMITER ;