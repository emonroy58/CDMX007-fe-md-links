const mdLinks = require('../');


describe('Verificar si es una funcion ', () => {

    test('Verificar si es una funcion ', () => {
        expect(typeof readFileMd).toEqual('function');
    });

    test('mdLinks(path, options) para primer link del archivo', () => {
        return mdLinks('valida link', { validate: false, stats: false })
            .then(response => expect(response[1].href).toBe('https://nodejs.org/es/'));
    });

   
  });