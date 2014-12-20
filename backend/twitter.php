<?php
function fetch_twitter($screen_name, $account) {
	/** Set access tokens here - see: https://dev.twitter.com/apps/ **/
	$settings = array(		
	    'oauth_access_token' => "1389371203-E2IgGpoILJKZ3zPFr694dWw30hakJoSgrRcVEa0",
		'oauth_access_token_secret' => "idSMnpfyabdCt6hIDBW6dtKlxvhZaBFtGE8vQF578Svi6",
		'consumer_key' => "RYYazi6FcLdEjcE3i548tzyYT",
		'consumer_secret' => "kg2wgKcs5o7eYdZqDXYWUiKFP7Wf7dlEdbH89rG3LESaZ8pxCD"
	);

	/** URL for REST request, see: https://dev.twitter.com/docs/api/1.1/ **/
	$url = 'https://api.twitter.com/1.1/statuses/user_timeline.json';
	$requestMethod = 'GET';
	$count = 100;
	$getfield1 = '?screen_name=' . $screen_name . '&trim_user=true&count=' . $count;
	
	$total_tweets = [];

	/** Perform a GET request and echo the response **/
	/** Note: Set the GET field BEFORE calling buildOauth(); **/
	try {
		$done = false;
		$max_id = "";
		$count = 0;
		$files = [];
		
		while(!$done) {
			$twitter = new TwitterAPIExchange($settings);
				
			$response = $twitter->setGetfield($getfield1 . $max_id)
						 ->buildOauth($url, $requestMethod)
						 ->performRequest(true);
						 
			 array_push($files, "Twitter-" . $screen_name . "-" . $count . ".json");
						 
			 $tweets = json_decode($response);
			
			for($i = 0;$i < count($tweets);$i++) {
			    $tweets[$i]->account = $account;
				$max_id = "&max_id=" . $tweets[$i]->id_str;
			}
			 
			 file_put_contents("json/Twitter-" . $screen_name . "-" . $count . ".json", json_encode($tweets, true));
			
		    $count++;
		    
			if (count($tweets) < 100) {
				$done = true;
			}
		 }
		 
		 return $files;
	} catch (Exception $e) {
		echo 'Exception reçue : ',  $e->getMessage(), "\n";
	}
}
?>
