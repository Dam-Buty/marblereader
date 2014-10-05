# Recupere tous les chapitres d une histoire
SELECT 
	`pk_chapter` as `pk`,
	`content_chapter` as `content`,
	`fk_account` as `account`,
	`id_chapter` as `id`,
	`time_chapter` as `time`,
	`title_chapter` as `title`,
	`type_chapter` as `type`
FROM `chapter`
WHERE `fk_story` = :story
ORDER BY `time_chapter` ASC
;
