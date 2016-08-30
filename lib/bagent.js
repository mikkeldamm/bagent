const rx = require('rx');
const firebase = require('firebase');

const siteInstances = [
    //require('./sites/home'),
    //require('./sites/danbolig'),
    require('./sites/selvsalg')
];

module.exports = () => {

    var config = {
        databaseURL: "https://bagent-5c774.firebaseio.com"
    };

    firebase.initializeApp(config);

    let subject = new rx.BehaviorSubject(null);

    subject.subscribe((house) => {

        if (house) {

            console.log("------- HOUSE -----------");
            console.log(house);

            //firebase.database().ref('houses').push(house);
        }
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
    };

    let sites = siteInstances.map((instance) => {
        return new instance(subject, searchCriteria);
    });

    //setTimeout(() => {

        sites.forEach((site) => {
            site.fetch();
        });

    //}, 5000);
}; 