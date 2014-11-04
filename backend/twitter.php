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
		
		while(!$done) {
			$twitter = new TwitterAPIExchange($settings);
				
			$response = $twitter->setGetfield($getfield1 . $max_id)
						 ->buildOauth($url, $requestMethod)
						 ->performRequest(true);
						 
			 $tweets = json_decode($response);
			 
			 var_dump($tweets);
			
			foreach($tweets as $tweet) {
				$time = date(DATE_RFC3339, strtotime($tweet->created_at));
				array_push($total_tweets, [
					"type" => 1,
					"id" => $tweet->id_str,
					"title" => "",
					"content" => $tweet->text,
					"time" => $time
				]);
				echo $time . "<br/>";
			}
			
			if (count($tweets) == 100) {
				$max_id = "&max_id=" . $tweets[99]->id_str;
			} else {
				$done = true;
			}
		 }
		 
		 return $total_tweets;
	} catch (Exception $e) {
		echo 'Exception reçue : ',  $e->getMessage(), "\n";
	}
}
?>
