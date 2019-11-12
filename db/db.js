const mysql = require('mysql');

const connecttion = mysql.createConnection({
    user:'root',
    password:'root',
    port:'3306',
    host:'localhost',
    database:'koalist'
})

connecttion.connect((error)=>{
    if(error){
        console.log('链接失败')
    }else{
        console.log('链接成功')
    }
})

module.exports = connecttion;