<?php
ini_set('display_errors', 1);
require_once('TwitterAPIExchange.php');

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
$getfield1 = '?screen_name=marblehornets&trim_user=true&count=100';
$getfield2 = '?screen_name=marblehornets&trim_user=true&count=100';

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
		file_put_contents("timeline.json", json_encode($tweets, JSON_PRETTY_PRINT), FILE_APPEND);
		
		echo count($tweets) . " twits par ci <br/>";
		
		if (count($tweets) == 100) {
			$max_id = "&max_id=" . $tweets[99]->id_str;
			echo "On y revient avec " . $max_id . "<br/>";
		} else {
			$done = true;
		}
	 }
} catch (Exception $e) {
    echo 'Exception reçue : ',  $e->getMessage(), "\n";
}

// header('Content-Type: application/json');
// echo json_encode(json_decode($test), true);; 
 ?>