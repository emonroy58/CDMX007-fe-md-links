const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
let linksMd = [];

let options = {
  validate: false,
  stats: false
}


const foo =()=> {
return new Promise(function(resolve,reject){
 fs.readdir(process.argv[2],(err, files)=>{
    files.filter(file =>{
     if (path.extname(file)==='.md'){
      fs.readFile(file, 'utf-8', (err, content) => {
        if (err) 
           reject(err); 
        else     
        resolve (content);       
      })
     }   
         
    })
   })  
 })
 .then (content => readFileMd(content) )
}
module.exports = foo();



//Funcion que obtine links de .md
const readFileMd= (fileName)=> {
  const readFileMd= fileName; 
  const RegExpLinkText = /!*\[(.*)\]\((.*)\)/gi;   
  let urlLinks = readFileMd.match(RegExpLinkText); 
  // console.log(urlLinks);      
  const urlLink = /\]\((.*?|(https?|http?|ftp):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-]))\)/gi;;
  for (const i in urlLinks){
    let urlLinkMd = urlLinks[i].match(urlLink)[0].match(urlLink)[0].substring(2, urlLinks[i].match(urlLink)[0].length - 1);
    //agregar al array un objetos con la propiedad href
    linksMd.push({     
      href: urlLinkMd   
    });
  }
 // console.log(linksMd);
 validateLinks(linksMd);//array de objetos con los linksMd
}
//module.exports = readFileMd();

const validateLinks = () => {
  let arrLink = [];
  const arrayRead= linksMd;
  arrayRead.forEach(element => {         
    fetch(element.href).then(response => {
        if (response.status >= 200 && response.status < 400) {
          console.log(`${element.href} => Status:(ok)`);
         arrLink.push({
            ...element,
            status: response.status,   
            statusText: 'ok'       
          });

        } else {
          console.log(`${element.href} =>Status:FAIL`);
          arrLink.push({
            ...element,
            status: response.status,
            statusText: 'FAIL'
          });

        }
      })
      .catch(error => {
        console.log(`${element.href} =>Error: 404`); 
        arrLink.push({       
        ...element,
        status: 404,
        statusText: 'FAIL'
        });
      })
      
  });
  statusLink(linksMd);
 // count = linksMd.length;
  //console.log(`${count} links rastreados`);
 // return arrLink;
};
//module.exports = validateLinks();

const statusLink= (arrLink)=>{  
 
  console.log(`Total Links => ${arrLink.length}`); 
    
}

const mdLinks = ( options) =>  {
  if (options.stats && !options.validate) {
   console.log(`Total Links => ${arrLink.length}`); 
      } else if (options.validate && !options.stats) {
        validateLinks();
      } 
    else {
    reject(`La ruta no existe o es incorrecta`);
  }
}
module.exports.mdLinks = mdLinks;