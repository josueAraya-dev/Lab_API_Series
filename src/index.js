console.log("Hello world!");

import data from './data.json';
import modul from './modules/modul.js';
import {Hello} from './modules/modul.js';


//console.log(data.users.filter((user) => user.age >= 29));

console.log(modul()); //exportacion por defecto 
console.log(modul.Hello); //exportacion nombrada

const userList = document.querySelector('#users');
const taskInput = document.querySelector('.taskInput');
const taskButton = document.querySelector('.taskButton');

taskButton.addEventListener('click', (e) => {

    console.log(taskInput.value);

data.users.push({

    name: taskInput.value,
    age: 25
    
});

//mostrar los usuarios actualizados
mostrarUsuarios();

//limpiar el campo de entrada
taskInput.value = '';
});

mostrarUsuarios(); //llamamos a la funcion para mostrar los usuarios


function mostrarUsuarios() {

userList.innerHTML = '';

//mostrar los usuarios en la lista
data.users.forEach((user) => {

    console.log(user.name)
    userList.insertAdjacentHTML('beforeend', `<li>${user.name}</li>`);

}) };