const request = require('request');
const cheerio = require('cheerio');

class Home {

    initialize() {
        
        const results = `&SearchResultsPerPage=1000`;
        const city = `&q=2920%20Charlottenlund`;
        const ejer = `&EjendomstypeEL=true`;
        const andel = `&EjendomstypeAA=true`;
        const priceMax = `&PriceMax=1900000`;

        const url = `https://home.dk/resultatliste/?CurrentPageNumber=0${results}${city}${ejer}${andel}${priceMax}&Energimaerker=null&SearchType=0`;

        request(url, (error, response, html) => {

            if (!error) {

                var $ = cheerio.load(html);

                console.log($('title').text());
            }
        });
    }
}

module.exports = Home; 