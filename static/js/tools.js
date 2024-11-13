
/**
 * Realiza una solicitud HTTP utilizando XMLHttpRequest.
 * @param {string} method - El método HTTP de la solicitud (por ejemplo, "GET", "POST", "PUT", "DELETE").
 * @param {string} url - La URL a la cual se realiza la solicitud.
 * @param {string|FormData} [data=''] - Los datos a enviar con la solicitud. Por defecto, es una cadena vacía.
 * @param {boolean} [isBlob=false] - Indica si la respuesta debe tratarse como un objeto binario (blob). Por defecto, es false.
 * @returns {Promise} - Una promesa que se resuelve con la respuesta si la solicitud es exitosa, o se rechaza con un objeto que contiene el código de estado y el texto de estado si la solicitud falla.
 */
function makeRequest(method, url, data = '', isBlob = false) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url); // Abre la conexión especificando el método y la URL
        if (isBlob) {
            xhr.responseType = 'blob'; // Configura el tipo de respuesta como blob si isBlob es true
        }
        xhr.onload = function () { // Manejador de evento cuando la solicitud se completa
            if (xhr.status >= 200 && xhr.status < 300) { // Si el código de estado está en el rango exitoso (200-299)
                resolve(xhr.response); // Resuelve la promesa con la respuesta
            } else {
                reject({ // Rechaza la promesa con un objeto que contiene el código de estado y el texto de estado
                    status: xhr.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () { // Manejador de evento cuando ocurre un error en la solicitud
            reject({ // Rechaza la promesa con un objeto que contiene el código de estado y el texto de estado
                status: xhr.status,
                statusText: xhr.statusText
            });
        };

        if (data instanceof FormData) { // Si los datos son una instancia de FormData (se está enviando un archivo)
            xhr.send(data); // Envia los datos
        } else { // Si los datos no son FormData
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); // Establece el encabezado Content-type para datos de formulario
            xhr.send(data); // Envia los datos
        }
    });
}
function getFetchPDF(url, method = 'POST', bodyData = null) {
    const headers = {
        'Content-Type': 'application/json'  // Asegúrate de usar JSON
    };

    let options = {
        method: method,
        headers: headers,
    };

    if (bodyData) {
        options.body = JSON.stringify(bodyData);  // Serializa los datos a JSON
    }

    return fetch(url, options)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.statusText}`);
            }
            return response.blob();  // Obtén la respuesta como un Blob (para el PDF)
        })
        .then(blob => {
            // Crea un enlace para descargar el PDF
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'recibo_pago.pdf';  // Nombre del archivo a descargar
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);  // Libera la URL del blob
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
        });
}
function getFetchJSON(url, method = 'GET', bodyData = null) {
    const headers = {
        'Content-Type': 'application/json'  // Cambiar a JSON
    };

    let options = {
        method: method,
        headers: headers,
    };

    if (bodyData) {
        options.body = bodyData;
    }

    return fetch(url, options)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.statusText}`);
            }
            return response.json();  // Parsear la respuesta como JSON
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
        });
}
// function getFetch(url, method = 'GET', bodyData = null) {
//     // Configurar los headers
//     const headers = {
//         'Content-Type': 'text/plain' // Cambiado a texto plano
//     };

//     // Configurar las opciones para el fetch
//     let options = {
//         method: method,
//         headers: headers,
//     };

//     // Si hay datos a enviar, agregarlos al body
//     if (bodyData) {
//         options.body = bodyData; // No necesitas JSON.stringify para texto
//     }

//     // Ejecutar el fetch
//     return fetch(url, options)
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error(`Error en la solicitud: ${response.statusText}`);
//             }
//             return response.text();  // Parsear la respuesta como texto
//         })
//         .then(text => {
//             // console.log('Respuesta recibida:', text);  // Mostrar la respuesta como texto
//             return text;
//         })
//         .catch(error => {
//             console.error('Error en la solicitud:', error);
//         });
// }
function getFetch(url, method = 'GET', bodyData = null) {
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'  // Cambia a URL encoded
    };

    let options = {
        method: method,
        headers: headers,
    };

    if (bodyData) {
        options.body = bodyData;
    }

    return fetch(url, options)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.statusText}`);
            }
            return response.text();
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
        });
}

const menu = document.getElementById('see_menu');
if (menu) {
    menu.addEventListener('click', () => {
        const data_menu = document.querySelector('.data-menu');
        const menu_container = document.querySelector('.menu-container');
        const menu_logo = document.querySelector('#menu_logo');
        const rol = getRol();
        const log = document.getElementById('toLogs');
        if (rol != 1) {
            log.classList.toggle('off');
            log.classList.toggle('listStyle');
            menu_container.classList.toggle('menu_basic');
        }
        if (data_menu) {
            data_menu.classList.toggle('off');
            // menu.classList.toggle('all_menu');
        }
        if (menu_container) {
            // menu_container.classList.toggle('off');
            menu_container.classList.toggle('all_menu');
        }
        if (menu_logo) {
            menu_logo.classList.toggle('bx-menu-alt-left');
            menu_logo.classList.toggle('bx-menu');

            menu_logo.classList.toggle('rotate');
        }
    })
}

const disconect = document.getElementById('disconect');
if (disconect) {
    disconect.addEventListener('click', () => {

        window.location.href = '/exit';
    })
}