const getJSON = function(url,type,data){
	const promise = new Promise(function(resolve,reject){
		const handler = function(){
			if(this.readyState !== 4){
				return;
			}
			if(this.status === 200){
				resolve(this.response)
			} else{
				reject(new Error(this.statusText))
			}
		};
		const client = new XMLHttpRequest();
		client.open(type,url);
		client.onreadystatechange = handler;
		client.responseType = 'json';
		if(type == 'get'){
			client.send()
		}else {
			client.setRequestHeader("Content-Type","application/json");
            client.send(JSON.stringify(data));
		}
	})
	return promise;
}

$(function(){
	//tijiao
	$(".submit").click(()=> {
		let name = $(".name").val();
		let msg = $(".message").val();
		if(name == "" || msg ==""){
			alert("请输入昵称和留言信息");
			
		}else{
			getJSON("http://localhost:3000/map/add","post",{name:name,message:msg})
			.then(function(json){
				if(json.code == '200'){
					$(".message").val("");
			        $(".name").val("");
					listShow();
				}
			},function(error){
				console.log('出错了',error);
			})
			// $(".message").val("");
			// $(".name").val("");
			// listShow();
		}
	})
	//查看留言
	$(".viewMes").click(()=>{
		listShow();
	})
	//删除全部留言
	$(".deleteAll").click(()=>{
		getJSON('/map/deleteAll','delete')
		.then(function(json){
			//listShow();
			$(".messageList").html('全部数据已经清除')
		},function(error){
			console.log('delete出错了'+error)
		})
	})
	//删除某条留言
	let del = (name) =>{
		//let name = $(".key").val();
		//console.log(name)
		getJSON('/map/del','delete',{name:name})
		.then(function(json){
			listShow();
		},function(error){
			console.log('del出错了',error);
		})
	}
	//更改留言
	let change = (name,msg) => {
		getJSON('/map/change','put',{name:name,message:msg})
		.then(function(json){
			$("#inputEmail3").attr('disabled',false);
			listShow();
			$(".message").val("");
			$(".name").val("");
		},function(error){
			console.log('更改出错',error);
		})
	}
	$(".update").click(()=>{
		let name = $(".name").val();
		let msg = $(".message").val(); 
		change(name,msg);
	})
	//绑定未来元素
	$(".messageList").on('click', '.del', (e)=>{
		del($(e.target).attr('name'));
	});
	$(".messageList").on('click','.upd',(e)=>{
		let value = $(e.target).val();
		$("#inputEmail3").attr('disabled',true);
		$(".name").val(value.split(',')[0]);
		$(".message").val(value.split(',')[1]);
	})
	function listShow(){
		// getJSON("/map/search","get").then(function(d){
		// 	showList(d);
		// },function(error){
		// 	console.log('出错了',error);
		// })
		let list = $(".messageList"),str = "";
				$.ajax({url:"/map/search",dataType:"json",type:"get"})
	　　.done(function(d){
			for (let i=0; i<d.length; i++) {
				str += `<li class="list-group-item"><span class="key">${d[i].key}</span><span>说：</span><span class="value">${d[i].value}</span>
			    <span style="float:right;"><button class="del" name="${d[i].key}">删除</button>
			    <button class="upd"  value="${d[i].key},${d[i].value}">更新</button></span></li>`;
			}
			list.html(str);
		})
	　　.fail(function(){ alert("出错啦！"); });
     }
	function showList(d){
		let list = $("messageList"),str = "";
		for(let i = 0;i<d.length;i++){
			str += `<li class="list-group-item"><span class="key">${d[i].key}</span><span>说：</span><span class="value">${d[i].value}</span>
			<span style="float:right;"><button class="del" name="${d[i].key}">删除</button>
			<button class="upd" value="${d[i].key},${d[i].value}">更新</button></span></li>`;
		}
		list.html(str);
	}
	//查询数据
	//链式写法 串行
	$(".queryThen").click(()=>queryThen());
	let queryThen = () => {
		$.ajax({url:"/map/add1",dataType:"json",type:"get"})
		.then(data =>{
			return $.get("/map/add2",data.result.id)
		})
		.then(data=>{
			alert(data);
		},()=>{
			alert('出错了')
		})
	};
	//并行 when多个请求后返回
	let addPromise1 = new Promise((resolve,reject) =>{
		getJSON("/map/add1","get")
		.then(d=>{
			resolve(d);
		},(error)=>{
			console.error('出错了')
	    });
    })
	let addPromise2 = new Promise((resolve,reject) =>{
		getJSON("/map/add2","get")
		.then(d=>{
			resolve(d);
		},error =>{
			console.error('error')
		})
	});
	$(".queryWhen").click(()=>queryWhen())
		let queryWhen = ()=>{
			Promise.all([
				addPromise1,
				addPromise2
			]).then(([add1,add2])=>{
				console.log(add1,add2);
			},error=>{
				console.error('出错了',error)
			})
		}
	

})