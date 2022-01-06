const axios = require('axios');
const fs = require('fs');

class Search {

    history = [];
    dbPath = './db/database.json';

    constructor(){
        this.readDB();
    }

    get historyCapitalized(){

        // this.history.forEach( ( place, i) => {
        //     const idx = `${ i +1 }.`.green;

        //     const string = place.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));

        //     console.log(`${ idx } ${ string }`)
        // });

        return this.history.map( place => {
            
            let words = place.split(' ');
            words = words.map( w => w[0].toUpperCase() + w.substring(1));

            return words.join(' ');
        });
    }

    get paramsMapbox(){
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }

    get paramsOpenWeather(){
        return {
            'appid': process.env.OPENWEATHER_KEY,
            'lang': 'en',
            'units': 'metric'
        }
    }

    async city( place = '' ){

        try {

            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ place }.json`,
                params: this.paramsMapbox
            });
    
            const response = await instance.get();

            return response.data.features.map( place => ({
                id: place.id,
                name: place.place_name,
                lng: place.center[0],
                lat: place.center[1],
            }));              

        }catch(error){
            return [];
        }

    }

    async placeWeather( lat, lon ){
        try {

            const instace = axios.create({
                baseURL: 'https://api.openweathermap.org/data/2.5/weather',
                params: { ...this.paramsOpenWeather, lat, lon }
            });

            const response = await instace.get();
            const { weather, main } = response.data;

            return {
                description: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }
            
        } catch (error) {
            console.log(error);   
        }
    }

    addHistory( place = '' ){

        if( this.history.includes( place.toLocaleLowerCase() ) ){
            return;
        }

        this.history = this.history.splice(0, 9);
        this.history.unshift( place.toLocaleLowerCase() );

        // Save DB
        this.storeDB();
    }

    storeDB(){

        const payload = {
            history: this.history
        }

        fs.writeFileSync( this.dbPath, JSON.stringify( payload ) )
    }

    readDB(){

        if( !fs.existsSync( this.dbPath ) ) return;
    
        const info = fs.readFileSync( this.dbPath, { encoding: 'utf-8' });
        const data = JSON.parse( info );

        this.history = data.history;
    }
}


module.exports = Search;