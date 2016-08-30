const fetch = require('node-fetch')

class Home {

    constructor(eventEmitter, searchCriteria) {

        this.eventEmitter = eventEmitter;
        this.searchCriteria = searchCriteria;
        
        const perPage = 1000;
        const types = this.fromTypes(this.searchCriteria.types).join('&')
        
        const baseUrl = `https://home.dk/umbraco/backoffice/home-api/Search?`;
        const baseSearchQuery = `?SortType=&SortOrder=&CurrentPageNumber=0&Forretningnr=&ProjectNodeId=&SearchType=0&SearchResultsPerPage=${perPage}`;
        const zipCityQuery = `&q=${this.searchCriteria.zip}+${this.searchCriteria.city}`;
        const typeQuery = `&${types}`;
        const priceQuery = `&PriceMin=${this.searchCriteria.minPrice}&PriceMax=${this.searchCriteria.maxPrice}`;
        const expenseQuery = `&EjerudgiftPrMdrMin=${this.searchCriteria.minExpense}&EjerudgiftPrMdrMax=${this.searchCriteria.maxExpense}&BoligydelsePrMdrMin=${this.searchCriteria.minExpense}&BoligydelsePrMdrMax=${this.searchCriteria.maxExpense}`;
        const sqmQuery = `&BoligstoerrelseMin=${this.searchCriteria.minSqm}&BoligstoerrelseMax=${this.searchCriteria.maxSqm}`;
        const roomQuery = `&VaerelserMin=${this.searchCriteria.minRooms}&VaerelserMax=${this.searchCriteria.maxRooms}`;

        this.url = `${baseUrl}${baseSearchQuery}${zipCityQuery}${typeQuery}${priceQuery}${expenseQuery}${sqmQuery}${roomQuery}`;
    }

    fetch() {

        fetch(this.url)
            .then((response) => {
                return response.json();
            })
            .then((json) => {

                let houses = json.searchResults.map((result) => {
                    return this.mapToHouse(result);
                });

                this.eventEmitter.onNext(houses);
            });
    }

    mapToHouse(result) {

        return {
            lat: result.lat,
            lng: result.lng,
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

        let queryTypes = [
            'EjendomstypeV1', // 0 == villa
            'EjendomstypeRH', // 1 == rækkehus
            'EjendomstypeEL', // 2 == ejerlejlighed
            'EjendomstypeVL', // 3 == villalejlighed
            'EjendomstypeAA', // 4 == andelsbolig
            'EjendomstypePL', // 5 == 
            'EjendomstypeFH', // 6 == fritidsbolig
            'EjendomstypeLO', // 7 == landejendom
            'EjendomstypeHG', // 8 == helårsgrund
            'EjendomstypeFG', // 9 == fritidsgrund
            'EjendomstypeNL'  // 10 == 
        ];

        types.forEach((type) => {

            queryTypes[type] = queryTypes[type] + '=true';
        });

        return types;
    }
}

module.exports = Home; 