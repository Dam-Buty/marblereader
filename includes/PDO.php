<?php
//////////////////////////
///// based on DINOSQL v1.0
//////////////////////////

class MARBLESQL {
#    private $hostname = "127.0.0.1";
#    private $username = "dino_prod_root";
#    private $dbname = "dino_prod";
#    private $password = "G00D_2-e4t-1000_yrz!"; 
#####################
#    private $hostname = "127.0.0.1";
#    private $username = "dino_baby_root";
#    private $dbname = "dino_baby";
#    private $password = "C4dillac5"; 
#####################
    private $hostname = "localhost";
    private $username = "root";
    private $dbname = "marble";
    private $password = "C4dillac5";
    
    private $options = [
        PDO::ATTR_PERSISTENT         => true,
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET time_zone = '-06:00'"
    ];
    
    private $dsn;
    private $dbh;
    
    public function __construct() {
        try {
            $this->dsn = "mysql:host=" . $this->hostname . ";dbname=" . $this->dbname . ";charset=utf8";
            $this->dbh = new PDO($this->dsn, $this->username, $this->password, $this->options);
            
            $this->dbh->beginTransaction();
        } catch (PDOException $e) { // Erreur connection BdD
            
            throw new Exception("Erreur de connection", 1);
        }
    }
    
    public function query($query_name, $params = [], $substitutions = []) {
        $query_array = explode("\n", file_get_contents("../SQL/" . $query_name . ".sql"));
        
        $message = array_shift($query_array);
        $query = implode("\n", $query_array);
        
        $query_type = substr(trim(explode("\n", $query)[0]), 0, 6);
            
        $stmt = $this->dbh->prepare($query);
        
        try {
            $stmt->execute($params);
			
            switch($query_type) {
                case "SELECT":
                    return $stmt->fetchAll(PDO::FETCH_ASSOC);
                case "INSERT":
                    return $this->dbh->lastInsertId();
                case "UPDATE":
                    return $stmt->rowCount();
                case "DELETE":
                    return $stmt->rowCount();
            }
        } catch (Exception $e) {   
            throw new Exception("Erreur de requete : " . $e->getMessage(), 2);
        }
    }
    
    public function commit($destroy = true) {
        $this->dbh->commit();
        if ($destroy) {
            $this->dbh = null; 
        } else {
            $this->dbh->beginTransaction();
        }
    }
    
    public function rollback() {
        $this->dbh->rollback();
        $this->dbh = null;
    }
}
?>
