<?php
include("TwitterAPIExchange.php");
include("twitter.php");
include("youtube.php");

foreach (new DirectoryIterator('.') as $manifest) {
    if(!$manifest->isDot() && $manifest->getExtension() == "manifest") {
        $story = [
            "title" => "",
            "min" => "",
            "max" => "",
            "chapters" => []
        ];
        
        $json = $manifest->getBasename(".manifest") . ".json";
        
        $storyInfo = json_decode(file_get_contents($manifest->getFilename()), true);
        
        var_dump($storyInfo);
        
        $story["title"] = $storyInfo["title"];        
        $accounts = $storyInfo["accounts"];
        
        foreach($accounts as $idx => $account) {
        
            var_dump($account);
        
        	switch($account["type"]) {
        		case 1:
        			$chapters = fetch_twitter($account["handle"]);
        			break;
        		case 2:
        			$chapters = fetch_youtube($account["handle"]);
        			break;
        	}
        	
        	var_dump($chapters);
        	
        	foreach($chapters as $idx => $chapter) {
        	    $story["min"] = min($story["min"], $chapter["time"]);
        	    $story["max"] = max($story["max"], $chapter["time"]);
        	    
        	    array_push($story["chapters"], [
        			"account" => $idx,
        			"type" => $chapter["type"],
        			"id" => $chapter["id"],
        			"title" => $chapter["title"],
        			"content" => $chapter["content"],
        			"timechapter" => $chapter["time"]
        	    ]);
        	}
        }
    }
}
 ?>
