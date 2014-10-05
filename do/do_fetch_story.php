<?php
include("../includes/PDO.php");
include("../connectors/twitter.php");
include("../connectors/youtube.php");

$story = 1;

$marble = new MARBLESQL();

$params = [
	"story" => $story
];

$marble->query("del_chapters", $params);
$accounts = $marble->query("get_accounts", $params);

foreach($accounts as $account) {
	switch($account["type_account"]) {
		case 1:
			$chapters = fetch_twitter($account["handle_account"]);
			break;
		case 2:
			$chapters = fetch_youtube($account["handle_account"]);
			break;
	}
	
	foreach($chapters as $chapter) {
		$marble->query("insert_chapter", [
			"story" => $story,
			"account" => $account["pk_account"],
			"typechapter" => $chapter["type"],
			"id" => $chapter["id"],
			"title" => $chapter["title"],
			"content" => $chapter["content"],
			"timechapter" => $chapter["time"]
		]);
	}
}

$marble->commit();
 ?>