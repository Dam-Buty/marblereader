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
        
        $story["title"] = $storyInfo["title"];        
        $accounts = $storyInfo["accounts"];
        $files = [];
        $account = 0;
        
        foreach($accounts as $idx => $account) {
        
        	switch($account["type"]) {
        		case "twitter":
        			$chapters = fetch_twitter($account["handle"], $account);
        			break;
        		case "youtube":
        			$chapters = fetch_youtube($account["handle"], $account);
        			break;
        	}
        	
            $files = array_merge($files, $chapters);
            $account++;
        }
        
        header('Content-Type: application/json');
        echo json_encode($files, JSON_PRETTY_PRINT);
    }
}
 ?>
