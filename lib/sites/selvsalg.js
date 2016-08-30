const fetch = require('node-fetch')
const cheerio = require('cheerio')

class Selvsalg {

    constructor(eventEmitter, searchCriteria) {

        this.eventEmitter = eventEmitter;
        this.searchCriteria = searchCriteria;

        const perPage = 100;
        const types = this.fromTypes(this.searchCriteria.types).join(',');
        
        const baseUrl = `http://www.selvsalg.dk/resultater`;
        const baseSearchQuery = `?view=list&ps=${perPage}&show=0`;
        const zipCityQuery = `&q=${this.searchCriteria.zip}`;
        const typeQuery = `&type=${types}`;
        const priceQuery = `&min=${this.searchCriteria.minPrice}&max=${this.searchCriteria.maxPrice}`;
        const sqmQuery = `&minsize=${this.searchCriteria.minSqm}&maxsize=${this.searchCriteria.maxSqm}`;
        const roomQuery = `&minrooms=${this.searchCriteria.minRooms}&maxrooms=${this.searchCriteria.maxRooms}`;

        this.url = `${baseUrl}${baseSearchQuery}${zipCityQuery}${typeQuery}${priceQuery}${sqmQuery}${roomQuery}`;
    }

    fetch() {

        fetch(this.url)
            .then((response) => {

                return response.text();
            })
            .then((html) => {

                let $ = cheerio.load(html);

                for (let i = 0; i < $('ul.properties-list').children().length; i++) {

                    var elm = $($('ul.properties-list').children()[i]);

                    console.log(elm.find('h6 a').text());
                }
                
            });
    }

    mapToHouse(result) {

        return {
            lat: this.formatCoordinate(result.lat),
            lng: this.formatCoordinate(result.lng),
            type: this.getType(result.ejendomstypePrimaerNicename),
            address: result.adresse,
            city: result.city,
            zip: result.postal,
            sqm: result.boligOrGrundAreal,
            price: this.getPrice(result.price),
            url: result.boligurl
        }
    }

    getPrice(price) {

        return Number(price.replace(/\D/gi, ''));
    }

    getType(type) {

        if (type === "Ejerlejlighed")
            return 2;

        return -1;
    }

    fromTypes(types) {

        let queryTypes = [];

        types.forEach((type) => {

            switch (type) {
                case 0:
                    queryTypes.push(1);
                    break;
                case 1:
                    queryTypes.push(2);
                    break;
                case 2:
                    queryTypes.push(3);
                    break;
                case 3:
                    queryTypes.push(9);
                    break;
                case 4:
                    queryTypes.push(5);
                    break;
            }
        });

        return queryTypes;
    }
    
    formatCoordinate(coord) {

        return Number(coord.toString().match(/^\d+(?:\.\d{0,4})?/))
    }
}

module.exports = Selvsalg; 