# Insere un chapitre dans une histoire
INSERT INTO `chapter` (
	`type_chapter`, 
	`title_chapter`, 
	`id_chapter`, 
	`content_chapter`, 
	`time_chapter`,
	`fk_story`,
	`fk_account`
) VALUES (
	:typechapter,
	:title,
	:id,
	:content,
	:timechapter,
	:story,
	:account
);