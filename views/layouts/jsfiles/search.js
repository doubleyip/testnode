window.onload =function changeImg(imgNumber)	{
			var myImages = ["Images/Background.jpg", 
			"Images/Background1.jpg", 
			"Images/Background2.jpg", 
			"Images/Background3.jpg", 
			"Images/Background4.jpg"]; 
			var imgShown = document.body.style.backgroundImage;
			var newImgNumber =Math.floor(Math.random()*myImages.length);
			var currImg = document.getElementById("top2");
			//currImg.style.backgroundImage = 'url('+myImages[newImgNumber]+')';
			document.body.style.backgroundImage = 'url('+myImages[newImgNumber]+')';
		}
