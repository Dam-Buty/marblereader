<?php
require_once('../includes/TwitterAPIExchange.php');

function fetch_twitter($screen_name) {
	/** Set access tokens here - see: https://dev.twitter.com/apps/ **/
	$settings = array(
		'oauth_access_token' => "1389371203-ZQ591J8RwThAALr0J4ry6dDCxxrmcSeGRhYs4II",
		'oauth_access_token_secret' => "vt4YeorZcwN1HmgT8gyClvgeZpitA2y8Vwdm7GDjYZuP7",
		'consumer_key' => "v45fb9zmGQgkJOLqwBmwNJqPa",
		'consumer_secret' => "0aCcSC12xu7WQCHNB3RMDqFAhoVFVscRsfLi9T3F1k5WD60r7H"
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

// header('Content-Type: application/json');
// echo json_encode(json_decode($test), true);; 
 ?>