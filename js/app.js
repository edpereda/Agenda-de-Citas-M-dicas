let DB;

// Selectores de la Interfaz
const form = document.querySelector('form'),
        nombreMascota = document.querySelector('#mascota'),
        nombreCliente = document.querySelector('#cliente'),
        telefono = document.querySelector('#telefono'),
        fecha = document.querySelector('#fecha'),
        hora = document.querySelector('#hora'),
        sintomas = document.querySelector('#sintomas'),
        citas = document.querySelector('#citas'),
        headingAdministra = document.querySelector('#administra');

// Esperar por el DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    // crear la base de datos
    let crearDB = window.indexedDB.open('citas', 1);
    
    // Si hay un error enviar a la consola
    crearDB.onerror = function() {
        console.log('Hubo un error');
    }

    // Si todo esta bien muestra en consola, y asignar en la base de datos
    crearDB.onsuccess = function() {
        console.log('Base de datos funcionando')
        // Asignar a la base de datos
        DB = crearDB.result;
        // console.log(DB);
    }

    // Este metodo solo corre una vez y es ideal para crear el Schema
    crearDB.onupgradeneeded = function(e) {
        // El evento es la misma base de datos.
        let db = e.target.result;

        // definir el objectstore, toma 2 parametros el nombre de la base de datos y segundo las opciones
        // keypath es el indice de la base de datos
        let objectStore = db.createObjectStore('citas', { keyPath: 'key', autoIncrement: true } );

        // Crear los indices y campos de la base de datos, createIndex : 3 parametros, nombre, keypath y opciones.
        objectStore.createIndex('mascota', 'mascota', { unique : false } );
        objectStore.createIndex('cliente', 'cliente', { unique : false } );
        objectStore.createIndex('telefono', 'telefono', { unique : false } );
        objectStore.createIndex('fecha', 'fecha', { unique : false } );
        objectStore.createIndex('hora', 'hora', { unique : false } );
        objectStore.createIndex('sintomas', 'sintomas', { unique : false } );
    }

    // Cuando se envia el formulario
    form.addEventListener('submit', agregarDatos);

    function agregarDatos(e) {
        e.preventDefault();

        const nuevaCita = {
            mascota: nombreMascota.value,
            cliente: nombreCliente.value,
            telefono: telefono.value,
            fecha: fecha.value,
            hora: hora.value,
            sintomas: sintomas.value,
            citas: citas.value
        }

        // en IndexDB se utilizan las transacciones
        let transaction = DB.transaction(['citas'], 'readwrite');
        let objectStore = transaction.objectStore('citas');
        
        let peticion = objectStore.add(nuevaCita);

        peticion.onsuccess = () => {
            form.reset();
        }
        transaction.oncomplete = () => {
            console.log('Cita agregada');
        }
        transaction.onerror = () => {
            console.log('Hubo error');
        }
    }
});