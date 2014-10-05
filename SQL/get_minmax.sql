# Recupere le premier et le dernier chapitres
SELECT MIN(`time_chapter`) as `min_story`, MAX(`time_chapter`) as `max_story`
FROM `chapter`
WHERE `fk_story` = :story
;