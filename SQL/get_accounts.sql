# Recupere les comptes d une histoire
SELECT * FROM `account`
WHERE `fk_story` = :story 
;