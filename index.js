const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
let linksMd = [];

  fs.readdirSync(process.argv[2],(err, archivos)=>{ //recibe ruta y callback  
    archivos
        .filter(function(archivo){return path.extname(archivo)==='.md'; })
        .forEach(function(archivo){
          console.log(archivo); 
          readFile();
          return archivo;
          });
  });


//Funcion que obtine links de .md
const readFile= ()=> {   
  const readFileMd= fs.readFileSync( 'readme.md', 'utf-8');   
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
  console.log(linksMd);
  return linksMd; //array de objetos con los linksMd
}

const validateLinks = () => {
  let arrLink = [];
  const arrayRead= linksMd;
  arrayRead.forEach(element => {         
    fetch(element.href).then(response => {
        if (response.status >= 200 && response.status < 400) {
          console.log(`Status:(ok)`);
         arrLink.push({
            status: `Status:(ok)`,            
          });

        } else {
          console.log(`Status:FAIL`);
          /*arrLink.push({
            ...element,
            status: response.status,
            statusText: 'FAIL'
          });*/

        }
      })
      .catch(error => {
        console.log(`Error: 404`);        
       /* ...element,
        status: 404,
        statusText: 'FAIL'*/
      })
  });

  count = linksMd.length;
  console.log(`${count} links rastreados`);
  return arrLink;
};

module.exports=readFile();
module.exports=validateLinks();