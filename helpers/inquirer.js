const inquirer = require('inquirer');
require('colors');

const questions = [
    {
        type: 'list',
        name: 'option',
        message: 'Qué desea hacer?',
        choices: [
            {
                value: 1,
                name: `${ '1.'.green } Search city`
            },
            {
                value: 2,
                name: `${ '2.'.green } History`
            },
            {
                value: 0,
                name: `${ '0.'.green } Exit`
            }
        ]
    }
];

const inquirer_menu = async() => {

    console.clear();
    console.log('=========================='.blue);
    console.log('   Select an option  '.white);
    console.log('==========================\n'.blue);

    const { option } = await inquirer.prompt(questions);
 
    return option;
}

const pause = async () => {

    const question = [
        {
            type: 'input',
            name: 'enter',
            message: `Press ${ 'enter'.green } to continue`
        }

    ];

    console.log('\n');
    await inquirer.prompt(question);
    
}

const readInput = async( message ) => {
    
    const question = [
        {
            type: 'input',
            name: 'description',
            message,
            validate( value ){
                if( value.length === 0 ) {
                    return 'Por favor ingrese un valor';
                }
                return true;
            }
        }

    ];

    const { description } = await inquirer.prompt(question);

    return description;
}

const listPlaces = async( places = [] ) => {

    const choices = places.map( ( place, i ) => {

        const idx = `${ i + 1 }.`.green;
        return {
            value: place.id,
            name: `${ idx } ${ place.name }`
        }
    });

    choices.unshift({
        value: '0',
        name: '0.'.green + ' Cancelar'
    });

    const questions = [
        {
            type: 'list',
            name: 'id',
            message: 'Select the place',
            choices,
        }
    ];
    const { id } = await inquirer.prompt(questions);

    return id;
}

module.exports = {
    inquirer_menu,
    pause,
    readInput,
    listPlaces
}