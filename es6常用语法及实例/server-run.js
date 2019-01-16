var connect = require('connect');  //创建连接
var bodyParser = require('body-parser');   //body解析
var serveStatic = require('serve-static');   //目录访问（静态文件访问）

let map = new Map();
let data = {
    "code":"200",
    "msg":"success"
};

function strMapToObj(strMap){
    let arr = [];
    for(let [k,v] of strMap){
        let obj = {};
        obj.key = k;
        obj.value = v;
        arr.push(obj);
    }
    return arr;
}

function strMapToJson(strMap){
    return JSON.stringify(strMapToObj(strMap));
}

var app = connect()
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({extended:true}))
    .use(serveStatic(__dirname))
    .use(function(req,res,next){
        //跨域处理
        res.setHeader('Access-Control-Allow-Orgin','*');
        res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS,PUT,PATCH,DELETE')
        res.setHeader('Access-Control-Allow-Headers','X-Requested-With,content-type,X-Session-Token')
        res.writeHeader(200,{"content-Type":"text/plain;charset=utf-8"});
        next();
    })
    //添加数据
    .use('/map/add',function(req,res,next){
        console.log(req.body.name);
        console.log(map)
        map.set(req.body.name,req.body.message);
        res.end(JSON.stringify(data));
        next()
    })
    //查询数据
    .use('/map/search',function(req,res,next){
        //console.log(map)
        res.end(strMapToJson(map));
        next()
    })
    //清除数据
    .use('/map/deleteAll',function(req,res,next){
       map.clear();
       res.end(JSON.stringify(data));
    })
    //删除数据
    .use('/map/del',function(req,res,next){
        map.delete(req.body.name);
        res.end(JSON.stringify(data))
    })
    //更新数据
    .use('/map/change',function(req,res,next){
        if(map.has(req.body.name)){
            map.set(req.body.name,req.body.message);
        }
        res.end(JSON.stringify(data))
    })
    //串行，并行查询
    .use('/map/add1',function(req,res,next){
        var data={
			"code": "200",
			"msg": "success",
			"result": {
				"id":1,
            }
        }
        res.end(JSON.stringify(data))
    })
    .use('/map/add2',function(req,res,next){
        var data={
			"code": "200",
			"msg": "success",
			"result": {
				"name": "sonia",
				"content": "广告投放1"
			}
        };
        res.end(JSON.stringify(data))  
    })
    .listen(3000);
console.log("Server started on port 3000.")