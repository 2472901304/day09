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

// 删
router.get('/api/del', async ctx=>{
    let {id} = ctx.query;
    if(id || id == 0){ //
        
        try{
            await query('delete from koa1 where id=?',[id])
            ctx.body = {
                code:1,
                msg:'删除成功'
            }
        }catch(e){
            ctx.body = {
                code:0,
                msg:e.error
            }
        }

    }
})

// 修改
router.post('/api/gai',async ctx=>{
    let {usename,password,idcard,id} = ctx.request.body;

    if(usename && password && idcard && id){
         try{
            await query('update koa1 set usename=?,password=?,idcard=? where id=?',[usename,password,idcard,id])
            ctx.body = {
                code:1,
                msg:'修改成功'
            }
         } catch (e){
             ctx.body = {
                 code : 0,
                 msg : e.error
             }
         }
    }else{
        ctx.body = {
            code:2,
            msg:'参数缺失'
        }
    }
})


// 模糊搜索
router.get('/api/search',async ctx=>{
    let {key}=ctx.query;
    let sql = '';
    if(!key){
         sql = 'select * from koa1';
    }else{
        sql = `select * from koa1 where usename link '%${key}%'`;
    }
    try{
       let list = await query(sql);
       ctx.body = {
           code:1,
           data:list
       }
    }catch(e){
        ctx.body = {
            code:0,
            msg:e.error
        }
    }
})


app.listen(process.env.PORT || 3000 , ()=>{
    console.log("服务启动成功")
})