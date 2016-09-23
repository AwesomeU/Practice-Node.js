var http=require('http')
var cheerio=require('cheerio')
var url='http://www.imooc.com/learn/348'

function filterChapters(html){
	var $=cheerio.load(html)//将html装载到cheerio中
	var chapters=$('.chapter')//拿到大章的内容
	//声明一个空数组，放置小节的内容
	var courseData=[];
	chapters.each(function(item) {
		var chapter=$(this)
		var chapterTitle=chapter.find('strong').text()
		var videos=chapter.find('.video').children('li')
		var chapterData={
			chapterTitle:chapterTitle,
			videos:[]
		}
		videos.each(function(item) {
			var video=$(this).find('.J-media-item')
			var videoTitle=video.text()
			//只截取后半部分的内容，用video/作为分隔符
			var id=video.attr('href').split('video/')[1]
			chapterData.videos.push({
				title:videoTitle,
				id:id
			})
			courseData.push(chapterData)
		});
	});
	return courseData;
}

function printInfo(courseData){
	//数组里的遍历
	courseData.forEach(function(item){
		chapterTitle=item.chapterTitle;
			console.log(chapterTitle+'\n')
		item.videos.forEach(function(video){
			console.log('['+video.id+']'+video.title)
		})
	})
}

http.get(url,function(res){
	var html=''
	//有data事件触发时，回调函数
	res.on('data',function(data){
		html+=data
	})
	res.on('end',function(){
	  var courseData=filterChapters(html);
	  printInfo(courseData);

	})
}).on('error',function(){
		console.log('获取数据出错')
	})