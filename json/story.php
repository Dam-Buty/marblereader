<?php
include("../includes/PDO.php");

$marble = new MARBLESQL();

$params = [
	"story" => $_GET["story"]
];

$story = [
	"title" => "",
	"min" => "",
	"max" => "",
	"chapters" => [],
	"accounts" => []
];

$story["title"] = $marble->query("get_title", $params)[0]["title"];

$minmax = $marble->query("get_minmax", $params);
$story["min"] = strtotime($minmax[0]["min_story"]);
$story["max"] = strtotime($minmax[0]["max_story"]);

$accounts = $marble->query("get_accounts", $params);

foreach($accounts as $account) {
	$story["accounts"][$account["pk_account"]] = $account["handle_account"];
}

$chapters = $marble->query("get_chapters", $params);
$chapters_final = [];

foreach($chapters as $chapter) {
	$chapter["time"] = strtotime($chapter["time"]);
	array_push($chapters_final, $chapter);
}

$story["chapters"] = $chapters_final;

header('Content-Type: application/json');
echo json_encode($story);
?>

