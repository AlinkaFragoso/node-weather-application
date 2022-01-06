require('dotenv').config();

const inquirer = require('inquirer');
const { readInput, inquirer_menu, pause, listPlaces } = require('./helpers/inquirer');
const Search = require('./models/search');


const main = async () => {
    console.clear();

    const search = new Search();

    let option;

    do {
        
        option = await inquirer_menu();

        switch (option) {
            case 1:
                // Input
                const term = await readInput( 'City: ' );
                
                // Search places
                const places = await search.city(term);
                
                // Selected place
                const id = await listPlaces(places);

                if( id === '0' ) continue;
                const selectedPlace = places.find( p => p.id === id);

                // Guardar BD
                search.addHistory( selectedPlace.name );

                // Weather
                const weather = await search.placeWeather( selectedPlace.lat, selectedPlace.lng );
                const description = weather.description;

                console.clear();
                console.log('\nPlace info \n'.green);
                console.log('City: ', selectedPlace.name.green);
                console.log('Lat: ', selectedPlace.lat);
                console.log('Lng: ', selectedPlace.lng);
                console.log('Weather:', `${ weather.temp }°C`.yellow);
                console.log('Min: ', `${ weather.min }°C`.yellow);
                console.log('Max: ',`${ weather.max }°C`.yellow);
                console.log('Whats the weather like?: ', (description.charAt(0).toUpperCase() + description.slice(1)).yellow);

                break;
            case 2:
                search.historyCapitalized.forEach( (place, i) => {
                    const idx = `${ i + 1 }.`.green;
                    console.log(`${ idx } ${ place }`);
                });
                console.log();
                break;
            default:
                break;
        }

       if( option !== 0 ) await pause();
        
    } while ( option !== 0 );

}


main();