# Efface les chapitres d une histoire
DELETE FROM `chapter`
WHERE `fk_story` = :story
;