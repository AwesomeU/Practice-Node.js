//加载模块
var https=require('https')
var fs=require('fs')

//打印相关内容
var options={
	key:fs.fs.readFileSync('ssh_key.pem'),
	cert:fs.readFileSync('ssh_cert.pem')
}
//创建https服务器
https.createServer(options,function(req,res){
	res.writeHand(200)
	res.end('hello imooc')
}).listen(8090)