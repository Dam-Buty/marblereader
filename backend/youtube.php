<?php
  // Call set_include_path() as needed to point to your client library.
require_once 'Google/Client.php';
require_once 'Google/Service/YouTube.php';

function fetch_youtube($screen_name, $account) {
	/*
	* Set $DEVELOPER_KEY to the "API key" value from the "Access" tab of the
	* {{ Google Cloud Console }} <{{ https://cloud.google.com/console }}>
	* Please ensure that you have enabled the YouTube Data API for your project.
	*/
	$DEVELOPER_KEY = 'x';	

	$client = new Google_Client();
	$client->setDeveloperKey($DEVELOPER_KEY);

	// Define an object that will be used to make all API requests.
	$youtube = new Google_Service_YouTube($client);

	try {
		// Call the search.list method to retrieve results matching the specified
		// query term.
		// Récupère l'objet chaine
		
		$response = $youtube->channels->listChannels('id,snippet', array(
		  'forUsername' => $screen_name
		));

		$channels = $response["items"];
		
		$total_videos = [];
	    $files = [];

		foreach($channels as $channel) {
			$done = false;
			$min_date = date(DATE_RFC3339);
			$id = $channel["id"];
		    $count = 0;
			
			while(!$done) {
			    // récupère les vidéos de la chaine
				$response = $youtube->search->listSearch('id,snippet', array(
				  'channelId' => $id,
				  "order" => "date",
				  "maxResults" => 50,
				  "publishedBefore" => $min_date
				));
				
			    array_push($files, "Youtube-" . $screen_name . "-" . $count . ".json");
			    
				$results = $response["modelData"]["items"];
				$video_ids = [];
		        $durations = [];
		        $results_durations = [];
				
				foreach($results as $result) {
					if ($result["id"]["kind"] == "youtube#video") {						
						$min_date = $result["snippet"]["publishedAt"];
						array_push($video_ids, $result["id"]["videoId"]);
					}
				}

                # Call the videos.list method to retrieve location details for each video.
                $durations_response = $youtube->videos->listVideos('id,contentDetails', array(
                    'id' => join(',', $video_ids),
                ));
                
                foreach($durations_response["items"] as $duration_response) {
                    $durations[$duration_response["id"]] = $duration_response["contentDetails"]["duration"];
                }
				
				for($i = 0;$i < count($results);$i++) {
			        $results[$i]["account"] = $account;
				    $results[$i]["duration"] = $durations[$results[$i]["id"]["videoId"]];
				}
				
			    file_put_contents("json/Youtube-" . $screen_name . "-" . $count . ".json", json_encode($results, true));
				
				if (count($results) < 50) {
					$done = true;
				}
		        $count++;
			}
		}
		
		return $files;

	} catch (Exception $e) {
		echo 'Exception reçue : ',  $e->getMessage(), "\n";
	}
}
?>
