<? php
//Script to connect to database


$hostname="us-cdbr-iron-east-05.cleardb.net";
$username="b2478bf1068eea";
$password="ed2bdf4f";
$db="heroku_826d2573636328d";
$tablename="lolusers";
$column="matchid";

mysql_connect($hostname,$username,$password);
mysql_select_db($dbname);

//test to access tables to check for data matchid column and print out data
$query="SELECT * FROM $tablename";
$data=mysql_query($query);

if($result)
{
	while($row=mysql_fetch_array($data))
	{
		$user=$row["$column"];
		echo $user;
	}
}

?>
