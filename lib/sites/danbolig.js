const fetch = require('node-fetch')

class Danbolig {

    constructor(eventEmitter, searchCriteria) {

        this.eventEmitter = eventEmitter;
        this.searchCriteria = searchCriteria;

        const body = this.composeBody();
        const baseUrl = `http://www.danbolig.dk/PropertyMapHandler.axd?areaFactor=1e-7&zoom=10&extent=56.03676022216059%2C11.9091796875%2C55.48352273618202%2C13.24127197265625&isCommercial=false`;
     
        this.url = `${baseUrl}`;
        this.body = body;
    }

    fetch() {

        fetch(this.url, { method: 'POST', body: JSON.stringify(this.body) })
            .then((response) => {

                return response.json();
            })
            .then((json) => {

                json.features.map((result) => {

                    this.eventEmitter.onNext(this.mapToHouse(result));
                });
            });
    }

    composeBody() {

        let body = {
            "offset": 0, 
            "reloadResults": true, 
            "moreResults": false, 
            "sortParameter": "Kontantpris", 
            "sortDirection": "Asc", 
            "isCommercial": false, 
            "searchString": { 
                "Value": this.searchCriteria.zip
            }, 
            "propertyTypes": { 
                "Value": this.getTypes(this.searchCriteria.types)
            }, 
            "cash": { 
                "Min": this.searchCriteria.minPrice, 
                "Max": this.searchCriteria.maxPrice 
            }
        }

        return body;
    }

    mapToHouse(result) {

        return {
            lat: this.formatCoordinate(result.geometry.coordinates[0]),
            lng: this.formatCoordinate(result.geometry.coordinates[1]),
            type: this.getType(result.properties.list[0].propertyTypeName),
            address: result.properties.list[0].address1,
            city: result.properties.list[0].city,
            zip: result.properties.list[0].zipCode,
            sqm: result.properties.list[0].propertySize,
            price: this.getPrice(result.properties.list[0].price),
            url: result.properties.list[0].url
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

    getTypes(searchTypes) {

        let types = [];

        searchTypes.forEach((type) => {

            switch (type) {
                case 0:
                    types.push({ "Value": "Villa", "FriendlyValue": "Villa" });
                    break;
                case 1:
                    types.push({ "Value": "Rækkehus", "FriendlyValue": "Rækkehus" });
                    break;
                case 2:
                    types.push({ "Value": "Ejerlejlighed", "FriendlyValue": "Ejerlejlighed" });
                    break;
                case 3:
                    types.push({ "Value": "Villalejlighed", "FriendlyValue": "Villalejlighed" });
                    break;
                case 4:
                    types.push({ "Value": "Andelsbolig", "FriendlyValue": "Andelsbolig" });
                    break;
            }
        });

        return types;
    }

    formatCoordinate(coord) {

        return Number(coord.toString().match(/^\d+(?:\.\d{0,4})?/))
    }
}

module.exports = Danbolig; 