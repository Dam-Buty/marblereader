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
        
        foreach($accounts as $idx => $account) {
        
            echo $account["type"] . " : " . $account["handle"] . "<br/>";
        
        	switch($account["type"]) {
        		case "twitter":
        			$chapters = fetch_twitter($account["handle"]);
        			var_dump($chapters);
        			break;
        		case "youtube":
        			$chapters = fetch_youtube($account["handle"]);
        			var_dump($chapters);
        			break;
        	}
        }
        
        array_merge($files, $chapters);
        echo json_encode($files, JSON_PRETTY_PRINT);
    }
}
 ?>
