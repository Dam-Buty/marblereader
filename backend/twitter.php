<?php
function fetch_twitter($screen_name) {
	/** Set access tokens here - see: https://dev.twitter.com/apps/ **/
	$settings = array(
		'oauth_access_token' => "x",
		'oauth_access_token_secret' => "x",
		'consumer_key' => "x",
		'consumer_secret' => "x"
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
		
		
		while(!$done) {
			$twitter = new TwitterAPIExchange($settings);
				
			$response = $twitter->setGetfield($getfield1 . $max_id)
						 ->buildOauth($url, $requestMethod)
						 ->performRequest(true);
						 
			 file_put_contents("json/Twitter-" . $screen_name . "-" . $count . ".json", $response);
						 
			 $tweets = json_decode($response);
			
			foreach($tweets as $tweet) {
				$max_id = "&max_id=" . $tweet->id_str;
				echo $tweet->id_str . "<br/>";
			}
			
			echo "<u>" . $max_id . "</u>";
			
		    $count++;
		    
			if (count($tweets) <= 100) {
				$done = true;
			}
		 }
		 
		 return $total_tweets;
	} catch (Exception $e) {
		echo 'Exception reçue : ',  $e->getMessage(), "\n";
	}
}
?>
