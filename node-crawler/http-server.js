//加载http模块，职责是创建web服务器，处理http相关的任务等等
var http=require('http');
//通过createServer创建web服务器
var server=http.createServer(function(req,res){
//请求体（获取请求相关信息url，method），响应体（相应的内容）
	res.writeHead(200,{'Content-Type':'text/plain'});//纯文本
	res.end('hello node\n');
})
server.listen(8000,'127.0.0.1')//在1337端口监听请求
console.log('Server running at http://127.0.0.1:8080/');