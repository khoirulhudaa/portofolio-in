const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
 const path = require('path');
 const express = require('express');

const app = express();

const BASEURL = `https://www.npmjs.com/search?q=keywords:front-end`;
const AUTHORURL = `https://www.npmjs.com/search?q=keywords:front-end`;

axios.get(`${BASEURL}`)
.then((response) => {
    if(response.status === 200) {
        const html = response.data;
        const $ = cheerio.load(html)
        let npmLibs = [];
        $(`.d0963384 .ef4d7c63`).each(function(i, elem) {
            npmLibs[i] = {
                title: $(this).find('.db7ee1ac').text().trim(),
                desc: $(this).find('._8fbbd57d').text().trim(),
                avatar: `https://www.npmjs.com` + $(this).find('._045facde img').attr('src'),
                author: $(this).find('.e98ba1cc').text().trim(),
                publish: $(this).find('._66c2abad').text().trim(),
                url_packages: `https://www.npmjs.com` + $(this).find(`.bea55649 a`).attr('href'),
                url_author: `https://www.npmjs.com` + $(this).find(`._045facde .e98ba1cc`).attr('href'),
            }
        });

        const libsList = npmLibs.filter(n => n != undefined) 
            fs.writeFile('database/baseLibsData.json',
            JSON.stringify(libsList, null, 4), (err) => {
                console.log('write success')
        })
    };
}), (error) => console.log(err)

// axios.get(`${AUTHORURL}`)
// .then((response) => {
//     if(response.status === 200) {
//         const html = response.data;
//         const $ = cheerio.load(html)
//         let authorLibs = [];
//         $(`._0897331b ._2309b204`).each(function(i, elem) {
//             authorLibs[i] = {
//                 avatar: $(this).find(`._73a8e6f0 img`).attr('src'),
//             }
//         });

//         const libsList = authorLibs.filter(n => n != undefined) 
//             fs.writeFile('database/authorLibsData.json',
//             JSON.stringify(libsList, null, 4), (err) => {
//                 console.log('write success')
//         })
//     };
// }), (error) => console.log(err)
 
//set dynamic views file
app.set('views',path.join(__dirname,'../views'));
app.use(express.static(path.join(__dirname, "../public")));
//set view engine
app.set('view engine', 'ejs');
//set public folder as static folder for static file
//route untuk halaman home
app.get('/',(req, res) => {
  //render file index.hbs
  res.render('index');
});
 
app.listen(8000);