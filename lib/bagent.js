const rx = require('rx');

const siteInstances = [
    require('./sites/home')
];

module.exports = () => {

    let subject = new rx.BehaviorSubject([]);

    subject.subscribe((houses) => {

        console.log("------- HOUSES -----------");
        console.log(houses);
    });

    let searchCriteria = {
        zip: 2920,
        city: 'Charlottenlund',
        minPrice: '',
        maxPrice: '1900000',
        minExpense: '',
        maxExpense: '',
        minSqm: '',
        maxSqm: '',
        minRooms: '',
        maxRooms: '',
        types: [1, 2, 3, 4]
    }

    let sites = siteInstances.map((instance) => {
        return new instance(subject, searchCriteria);
    });

    setInterval(() => {

        sites.forEach((site) => {
            site.fetch();
        });

    }, 5000);
}; 