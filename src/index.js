console.log("Hello world!");

import data from './data.json';
import modul from './modules/modul.js';
import {Hello} from './modules/modul.js';

//console.log(data.users.filter((user) => user.age >= 29));

console.log(modul()); //exportacion por defecto 
console.log(modul.Hello); //exportacion nombrada

const userList = document.querySelector('#users');

data.users.forEach((user) => {

    console.log(user.name)
    userList.insertAdjacentHTML('beforeend', `<li>${user.name}</li>`);

});