# Recupere le titre d une histoire
SELECT
	`title_story` as `title`
FROM `story`
WHERE `pk_story` = :story
;