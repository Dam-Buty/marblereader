<?php
  // Call set_include_path() as needed to point to your client library.
require_once 'Google/Client.php';
require_once 'Google/Service/YouTube.php';

function fetch_youtube($account) {
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
		$response = $youtube->channels->listChannels('id,snippet', array(
		  'forUsername' => $account
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
				$response = $youtube->search->listSearch('id,snippet', array(
				  'channelId' => $id,
				  "order" => "date",
				  "maxResults" => 50,
				  "publishedBefore" => $min_date
				));
				
			    array_push($files, "Youtube-" . $account . "-" . $count . "-model.json");
			    
			    json_encode($response["modelData"], true);
				
				$results = $response["items"];
				
				foreach($results as $result) {
					if ($result["id"]["kind"] == "youtube#video") {
						array_push($total_videos, [
							"type" => 2,
							"id" => $result["id"]["videoId"],
							"title" => $result["snippet"]["title"],
							"content" => $result["snippet"]["description"],
							"time" => $result["snippet"]["publishedAt"]
						]);
						
						$min_date = $result["snippet"]["publishedAt"];
					}
				}
				
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
