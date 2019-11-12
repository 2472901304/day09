const Koa = require('koa');

const app = new Koa();

// 1.处理静态资源
const static = require('koa-static');

// 2.处理post请求
const bodyparser = require('koa-bodyparser');

//3.路由
const router = require('koa-router')();

const path = require('path');

const query = require('./db/query');



// 处理静态资源
app.use(static(path.join(process.cwd(),'pulice')))

// 2.处理post请求
app.use(bodyparser())

// 挂载路由
app.use(router.routes());

app.use(router.allowedMethods());

// 查
router.get('/api/userlist',async (ctx,next)=>{
    let data = await query('select * from koa1')
    ctx.body = data
})


// 增
router.post('/api/add',async ctx => {
    let {usename,password,idcard} = ctx.request.body;

    if(usename && password && idcard){   //容错处理
        // 查询此人存在不存在
        let user = await query('select * from koa1 where idcard=?',[idcard]);

        if(user.data.length){
            //  存在
            ctx.body = {
                code:0,
                msg:'此人已存在'
            }
        }else{
            // 不存在   添加
            let data = await query('insert into koa1 (usename,password,idcard) values (?,?,?)',[usename,password,idcard]);
            if(data.msg === 'error'){
                ctx.body={
                    code:0,
                    msg:'error'
                }
            }else{
                ctx.body={
                    code:1,
                    msg:'添加成功'
                }
            }
        }
    }else{
        ctx.body = {
            code:2,
            msg:'参数丢失'
        }
    }
})



app.listen(process.env.PORT || 3000 , ()=>{
    console.log("服务启动成功")
})