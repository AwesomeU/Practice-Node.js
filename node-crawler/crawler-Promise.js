var http=require('http')
var Promise=require('bluebird')
var cheerio=require('cheerio')
var baseurl='http://www.imooc.com/learn/'
//var url='http://www.imooc.com/learn/348'
var videoIds=[348,359,197,134]

function filterChapters(html){
	var $=cheerio.load(html)//将html装载到cheerio中
	var chapters=$('.chapter')//拿到大章的内容
	var title=$('.path span').text()
	var number=parseInt($('.js-learn-num').text().trim(),10)
	//声明一个空数组，放置小节的内容
	var courseData={
		title:title,
		number:number,
		videos:[]
	}
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
			courseData.videos.push(chapterData);
		});
	});
	return courseData;
}

function printInfo(coursesData){
	coursesData.forEach(function(courseData){
		console.log(coursesData.number+'人学过'+courseData.title+'\n')
	})
	//数组里的遍历
	coursesData.forEach(function(courseData){
		console.log('###'+courseData.title+'\n')
		courseData.videos.forEach(function(item){
			chapterTitle=item.chapterTitle;
				console.log(chapterTitle+'\n')
			item.videos.forEach(function(video){
				console.log('['+video.id+']'+video.title)
			})
	})
	})
}

//重写为Promise
function getPageAsync(url){
	return new Promise(function(resolve,reject){
		console.log('正在爬取：'+url)
		http.get(url,function(res){
		var html=''
		//有data事件触发时，回调函数
		res.on('data',function(data){
			html+=data
		})
		res.on('end',function(){
			resolve(html)
		  //var courseData=filterChapters(html);
		  //printInfo(courseData);

	})
}).on('error',function(e){
		reject(e)
		console.log('获取数据出错')
	})
	})
}

//通过Promise的all方法接收数组，此处希望拿到不同课程的信息
var fetchCourseArray=[]//放置不同的课程信息

videoIds.forEach(function(id){
	fetchCourseArray.push(getPageAsync(baseurl+id))
})
Promise
	.all(fetchCourseArray)
	.then(function(pages){
		var courseData=[]
		pages.forEach(function(html){
			var courses=filterChapters(html)
			courseData.push(courses)
		})
		courseData.sort(function(a,b){
			return a.number>b.number;
		})
		printInfo(courseData)
	})