$(function(){

	//开始游戏前状态
	var header = $(".header");
	var birdOne = $("#bird0");
	var birdTwo = $("#bird1");
	function bounce(){
		var headerTop = header.position().top;
		header.animate({"top":"66px"},200)
			  .animate({"top":"74px"},200);
		if (headerTop <= 70 && headerTop >= 66) {
			birdTwo.hide();
			birdOne.show();
		}
		if (headerTop <= 74 && headerTop >= 70) {
			birdOne.hide();
			birdTwo.show();
		}
	}
	var headTimer = setInterval(bounce,200);

	// 游戏开始小鸟的运动
	var flyBird = $("#flyBird");
	var speed = 0,speedMax = 8;
	var downTimer = null; //下降计时器
	var upTimer = null; //上升计时器
	var isGameBegin = true;
	//小鸟下降
	function down(){
		speed += 1;
		flyBird.attr("id","flyBirdDown");
		//当鸟下落速度达到最大值speedMax时，保持不变
		if(speed >= speedMax) {
			speed = speedMax;
		}
		var speeds = speed + 'px';
		if (flyBird.position().top <= 394) {
			flyBird.animate({"top":"+=" + speeds},10);
		}
		
		boundary();
	}

    //小鸟上升
	function up() {
		speed -= 1;
		flyBird.attr("id","flyBirdUp");
		if(speed <= 0) {
			speed = 0;
			clearInterval(upTimer);
			downTimer = setInterval(down, 30);
		}
		var speeds = speed + 'px';
		flyBird.animate({"top":"-=" + speeds},10);
	}
	//鸟跳动
	function birdJump() {
		speed = speedMax;
		if(isGameBegin) {
			//每次向上跳时，先将向上、向下计时器清楚，防止叠加
			clearInterval(upTimer);
			clearInterval(downTimer); //清除向下的定时器；
			upTimer = setInterval(up, 30);
		}
	}
    

    var score = 0;
	//产生管道的高度
	function rand(min, max) {
		return parseInt(Math.random() * (max - min) + min);
	}
	//创建管道
	var isMove = true;
	var pipeTimer = false;
	function pipe(){
		var isScoreAdd = true;
		var allPipe = $(".allPipe");
		var pipe = $("<div></div>");
		pipe.attr("id","pipe");
		allPipe.append(pipe);
		var topHeight = rand(60, 203);
		var bottomHeight = 363 - 110 - topHeight;
		pipe.html('<div id="upMod" style="height:' + topHeight + 'px"><div id="upPipe" style="top:' + topHeight + 'px"></div></div><div id="downMod" style="height:' + bottomHeight + 'px"><div id="downPipe"></div></div>');
		pipe.css("left","343px");
		pipeTimer = setInterval(function(){
			if (isMove == true) {
				pipe.css("left","+=-1px");
			}
			if (pipe.position().left <= 30 && isScoreAdd == true) {
				score ++;
				showScore(score);
				isScoreAdd = false;
				if (score < 100 && score >= 10) {
					$(".score").css("width","80px");
				}
				if (score <= 1000 && score >= 100) {
					$(".score").css("width","120px");
				}
			}	
			if(pipe.position().left <= -65) {
				clearInterval(pipe.pipeTimer);
				pipe.remove();
			}
		},10);

	}
	//显示分数
	function showScore(score){
		var newScore = score;
		$(".score").html(newScore);
	}
	//游戏下方的滚动条	
	var bnImg = $(".banner_img img");
	function slider(){
		var imgLeft = bnImg.position().left;
		if(imgLeft == -343){
 			bnImg.css("left","0px");
	 	}
	 	bnImg.css("left","+=-1px");
	}
	var timer = setInterval(slider,10);
	// 小鸟与管道相撞
	function crash(){
		var birdLeft = flyBird.position().left;
		var birdRight = birdLeft + flyBird.width();
		var birdTop = flyBird.position().top;
		var birdBottom = birdTop + flyBird.height();
		var conduit = $("#pipe").first();
		var pipeLeft = conduit.position().left;
		var pipeRight = pipeLeft + conduit.width();
		var pipeTop1 = $("#upMod").position().top + 60;
		var pipeBottom1 = pipeTop1 + $("#upMod").height();
		var pipeTop2 = $("#downMod").position().top;
		var pipeBottom2 = pipeTop1 + $("#downMod").height();
		if(birdRight >= pipeLeft && birdLeft <= pipeRight && birdTop <= pipeBottom1) {
			gameOver();
		}
		if(birdRight >= pipeLeft && birdLeft <= pipeRight && birdBottom >= pipeTop2) {
			gameOver();
		}
	}
	//判断是否到达下边界
	function boundary(){
		var lower = flyBird.position().top;
		if (lower > 423) {
			gameOver();
		}
	}
	//开始游戏
	var allPipeTimer = false;
	var crashTimer = false;
	$(".start").click(function(){
		clearInterval(headTimer);
		header.hide();
		$(".start").hide();
		$(".page").click(function(){
    		document.addEventListener('click', birdJump, false);
    	});
    	allPipeTimer = setInterval(pipe, 2000);
    	$(".score").show();
    	crashTimer = setInterval(crash, 1000/6);
	});
	//结束游戏
	function gameOver(){
		flyBird.css("top","394px");
		clearInterval(allPipeTimer);
		clearInterval(pipeTimer);
		clearInterval(timer);
		clearInterval(crashTimer);
		$(".showScore").html(score);
		$(".gameover").show();
		isMove = false;
	}
	//重新开始
	$(".restart").click(function(){
	location.reload();
	})
})







