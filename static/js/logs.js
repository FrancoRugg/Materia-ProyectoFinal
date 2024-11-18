window.onload = () => {
    // openLoad();
    getLogs();
    // getTicket();
}

function getRol() {
    const getUserData = document.getElementById('getUserData');
    if (getUserData) {
        // console.log(getUserData.dataset.rol)
        rol = getUserData.dataset.rol;
        return rol;
    }
}

function getTicket() {
    const generateTicket = document.querySelectorAll('tr .getPDF');
    if (generateTicket) {
        // console.log('Hay data')
        generateTicket.forEach((elem) => {
            // console.log('foreach')
            // console.log(elem);
            elem.addEventListener('click', e => {
                // console.log('click')dea
                // console.log(elem);

                const row = elem.closest('tr');
                // console.log('Fila seleccionada:', row);

                // Obtener todos los td de esa fila
                const cells = row.querySelectorAll('td');

                // Recoger los datos de cada celda (por ejemplo, nombre, precio, etc.)
                const rowData = [];
                cells.forEach(cell => {
                    rowData.push(cell.textContent.trim());
                });

                // Ahora rowData contiene todos los valores de la fila
                // console.log(rowData);
                const conf = confirm('Desea descargar los datos seleccionados?');
                if (conf == true) {
                    const cantidad_total = 1;//VER COMO PASARLE LA CANT DE ROWDATA
                    const precio_total = rowData[3];
                    // console.log(parseInt(cantidad_total.dataset.total));
                    if (parseInt(cantidad_total) <= 0) {
                        alert('No puede generar una boleta vacia.')
                        return;
                    } else {
                        // const cart = [rowData[1]]
                        const jsonString = rowData[1].replace(/'/g, '"');  // Reemplaza comillas simples por comillas dobles
                        try {
                            const cart = JSON.parse(jsonString);

                            // console.log(cart);
                            // cart = cart.slice(0, -1);
                            let data = [];
                            // if (Array.isArray(cart)) {  // Si es un array
                            // console.log(cart[0]);
                            cart.forEach((elem) => {
                                let name = elem.description;
                                let price = elem.unit_price;
                                let cant = elem.quantity;
                                // console.log(name, price, cant)
                                data.push({
                                    "description": name,
                                    "unit_price": price,
                                    "quantity": cant,
                                    "total": price * cant,
                                    "precio_total": precio_total
                                });
                                // console.log(precio_total);
                            });
                            // console.log(data);
                            getFetchPDF('/download-transaction', 'POST', data)
                                .then(res => {
                                    console.log(res);
                                    // window.location.reload();
                                    //window.location.href = window.location.href; //Recarga la pág;
                                })
                                .catch(error => console.error('Error:', error));
                            // Procesar el array como antes
                        } catch (error) {
                            console.error('Error al parsear JSON:', error);
                        }
                    }
                }
            })
        })
    }
}

const action_filter = document.getElementById('action_filter');
if (action_filter) {
    action_filter.addEventListener('change', () => {
        // console.log(action_filter.value)
        let action = action_filter.value;

        if (action == 'All') {
            getLogs();
        } else {
            getLogByAction(action);
        }
    })
}

function getLogByAction(action) {
    getFetch(`/getLogByAction?action=${action}`, 'GET')
        .then(response => {
            openLoad();
            res = JSON.parse(response);
            res.forEach(e => {
                // console.log(e);
                const ske = document.querySelectorAll('tr.ske');

                ske.forEach((e) => {
                    e.classList.add('off')
                })

                const thead = document.querySelector('thead');
                thead.innerHTML = `<tr>
                                    <th>Usuario</th>
                                    <th>Observación</th>
                                    <th>Acción Realizada</th>
                                    <th>Fecha</th>
                                </tr>`;

                const tbody = document.querySelector('tbody');

                let html = "";
                res = JSON.parse(response);

                res.forEach(e => {
                    const color = (e.action === 'GET') ? "skyblue" : ((e.action === 'INSERT') ? "lightgreen" : "orange");
                    // console.log(e);
                    html += `<tr style="background:${color}">
                                <td>${e.created_by}</td>
                                <td class="data-show">${e.obs}</td>
                                <td>${e.action}</td>
                                <td data-time="${e.time}">${convertTimestampToFormattedDate(e.time, 'es-AR')}</td>
                            </tr>`;
                });
                tbody.innerHTML = html;
                // closeLoad();
            });
            closeLoad();
        })
        .catch(error => console.error('Error:', error));
}
function convertTimestampToFormattedDate(timestamp, locale = 'en-GB') {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}
function getLogs() {
    getFetch(`/getLogs`, 'GET')
        .then(response => {
            openLoad();
            const ske = document.querySelectorAll('tr.ske');

            ske.forEach((e) => {
                e.classList.add('off')
            })

            const thead = document.querySelector('thead');
            thead.innerHTML = `<tr>
                                <th>Usuario</th>
                                <th>Observación</th>
                                <th>Acción Realizada</th>
                                <th>Fecha</th>
                            </tr>`;

            const tbody = document.querySelector('tbody');

            let html = "";
            res = JSON.parse(response);

            res.forEach(e => {

                const color = (e.action === 'GET') ? "skyblue" : ((e.action === 'INSERT') ? "lightgreen" : "orange");
                // console.log(e);
                html += `<tr style="background:${color}">
                            <td>${e.created_by}</td>
                            <td class="data-show">${e.obs}</td>
                            <td>${e.action}</td>
                            <td data-time="${e.time}">${convertTimestampToFormattedDate(e.time, 'es-AR')}</td>
                        </tr>`;
            });
            tbody.innerHTML = html;
            // getTicket();
            closeLoad();
        })
        .catch(error => console.error('Error:', error));
}

function openLoad() {
    // console.log('Open')
    document.querySelector('.loadingContainer2').style.display = 'block';
}
function closeLoad() {
    // console.log('Close')
    document.querySelector('.loadingContainer2').style.display = 'none';
}