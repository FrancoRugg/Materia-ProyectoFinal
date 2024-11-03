window.onload = () => {
    // openLoad();
    getSections()
    getOptionsFromSections();
    oneMoreToCart();
}
document.addEventListener('DOMContentLoaded', () => {
    // closeLoad();
});
const disconect = document.getElementById('disconect');
if (disconect) {
    disconect.addEventListener('click', () => {
        window.location.href = '/login';
    })
}

function getRol() {
    const getUserData = document.getElementById('getUserData');
    if (getUserData) {
        // console.log(getUserData.dataset.rol)
        rol = getUserData.dataset.rol;
        return rol;
    }
}

// title = "";
//     #     rol = session.get('rol', 2);
//     #     print(rol)
//     #     for single in all:
//     #         # print(single)
//     #         if (title != single.s_name):
//     #             id = single.id;
//     #             print(single.s_name);
//     #             print('--------------------------');
//     #             products = getProducts(id)
//     #             for one in products:
//     #                 if (rol == 1 and one.active == 0 or one.active == 1):
//     #                     print(f"Name: {one.p_name} - Value: {one.p_price} - Active: {one.active}")
//     #         # print('--------------------------');
//     #         # print(single)
//     #         title = single.s_name

const edit_product = document.getElementById('edit_product');
if (edit_product) {
    edit_product.addEventListener('click', () => {
        const conf = confirm('Desea editar el producto?');
        if (conf == true) {
            // openLoad();
            let get_id = document.getElementById('get_p_id').value;
            let section = document.querySelectorAll('#set_p_section')[0].value;
            let set_product = document.getElementById('set_product').value;
            let set_price = document.getElementById('set_price').value;
            let active = document.querySelectorAll('#set_p_active')[0].value;

            if (section === "" || set_product === "" || set_price === "") {
                alert('Es necesario completar todos los campos');
                return;
            }

            // data = "ID=" + get_id;
            // data += "&sectorID=" + section;
            // data += "&p_name=" + set_product;
            // data += "&p_price=" + set_price;
            // data += "&active=" + active;
            let data = {
                "ID": get_id,
                "sectorID": section,
                "p_name": set_product,
                "p_price": set_price,
                "active": active
            };

            // console.log(data);
            // return;
            set_error = document.getElementById('p_error');
            try {
                getFetchJSON('/editProduct', 'POST', JSON.stringify(data))
                    .then((res) => {
                        if (res) {
                            // console.log(res.result);
                            set_error.textContent = res.result;
                            if (res.result == null || res.result == "") {
                                getSections();
                            }
                        }
                    });
            } catch (error) {
                set_error.textContent = "Error: " + error;
            }

        } else {
            alert('Accion cancelada');
        }
    });
}
const add_product = document.getElementById('send_product');
if (add_product) {
    add_product.addEventListener('click', () => {
        const conf = confirm('Desea agregar un nuevo producto?');
        if (conf == true) {
            // openLoad();
            let get_id = 0;
            let section = document.querySelectorAll('#set_p_section')[0].value;
            let set_product = document.getElementById('set_product').value;
            let set_price = document.getElementById('set_price').value;
            let active = 1;

            if (section == "" || section == 0 || set_product === "" || set_product === null || set_price === "" || set_price === null) {
                alert('Es necesario completar todos los campos');
                return;
            }

            // data = "ID=" + get_id;
            // data += "&sectorID=" + section;
            // data += "&p_name=" + set_product;
            // data += "&p_price=" + set_price;
            // data += "&active=" + active;
            let data = {
                "sectorID": section,
                "p_name": set_product,
                "p_price": set_price,
                "active": active
            };

            // console.log(data);
            // return;
            set_error = document.getElementById('p_error');
            try {
                getFetchJSON('/editProduct', 'POST', JSON.stringify(data))
                    .then((res) => {
                        if (res) {
                            console.log(res.result);
                            set_error.textContent = res.result;
                            if (res.result == null || res.result == "") {
                                getSections();
                            }
                        }
                    });
            } catch (error) {
                set_error.textContent = "Error: " + error;
            }

        } else {
            alert('Accion cancelada');
        }
    });
}
const add_section = document.getElementById('send_section');
if (add_section) {
    add_section.addEventListener('click', () => {
        const conf = confirm('Desea agregar una nueva Seccion?');
        if (conf == true) {
            // openLoad();

            // data = "ID=" + get_id;
            // data += "&sectorID=" + section;
            // data += "&p_name=" + set_product;
            // data += "&p_price=" + set_price;
            // data += "&active=" + active;

            let section = document.getElementById('set_section').value;
            let active = 1;

            if (section === "" || section === null) {
                alert('Es necesario completar todos los campos');
                return;
            }

            // data = "ID=" + get_id;
            // data += "&sectorID=" + section;
            // data += "&p_name=" + set_product;
            // data += "&p_price=" + set_price;
            // data += "&active=" + active;
            let data = {
                "s_name": section,
                "active": active
            };

            // console.log(data);
            // return;
            set_error = document.getElementById('error');
            try {
                getFetchJSON('/editSection', 'POST', JSON.stringify(data))
                    .then((res) => {
                        if (res) {
                            // r = JSON.parse(res);
                            // console.log(res.result);
                            set_error.textContent = res.result;
                            if (res.result == null || res.result == "") {
                                getSections();
                            }
                        }
                    });
            } catch (error) {
                set_error.textContent = "Error: " + error;
            }

        } else {
            alert('Accion cancelada');
        }
    });
}
const edit_section = document.getElementById('edit_section');
if (edit_section) {
    edit_section.addEventListener('click', () => {
        const conf = confirm('Desea editar la Seccion?');
        if (conf == true) {
            // openLoad();
            let get_id = document.getElementById('get_id').value;
            let section = document.getElementById('set_section').value;
            let active = document.querySelectorAll('#set_active')[0].value;;

            if (section === "" || section === null) {
                alert('Es necesario completar todos los campos');
                return;
            }

            // data = "ID=" + get_id;
            // data += "&sectorID=" + section;
            // data += "&p_name=" + set_product;
            // data += "&p_price=" + set_price;
            // data += "&active=" + active;
            let data = {
                "ID": get_id,
                "s_name": section,
                "active": active
            };

            // console.log(data);
            // return;
            set_error = document.getElementById('error');
            try {
                getFetchJSON('/editSection', 'POST', JSON.stringify(data))
                    .then((res) => {
                        if (res) {
                            // console.log(res.result);
                            set_error.textContent = res.result;
                            if (res.result == null || res.result == "") {
                                getSections();
                            }
                        }
                    });
            } catch (error) {
                set_error.textContent = "Error: " + error;
                console.error(error);
            }

        } else {
            alert('Accion cancelada');
        }
    });
}

async function getSections() {
    const data_home = document.querySelector('.data-home');
    const rol = getRol();
    const visible = (rol == 1) ? 'on' : 'off';
    openLoad();
    try {
        const response = await getFetch('/getSectorData', 'GET');
        const res = JSON.parse(response);
        let title = "";
        let sectionsHTML = "";

        sectionsHTML += `
        <article class="new_buttons">
        <div class="${visible}" id="add_product">
            <i class='bx bxl-product-hunt'></i>
        </div>
            <div class="${visible}" id="add_section">
                <i class='bx bx-list-plus' ></i>
            </div>
        </article>
        `;
        for (const e of res) {
            const s_name = e.name;
            const s_id = e.id;
            const s_active = e.active;
            if (rol == 1 && s_active == 0 || s_active == 1) {
                if (title !== s_name) {
                    sectionsHTML += `
                        <section class="sections">
                            <div class="title">
                                <h2 id="s_name">${s_name}</h2>
                                <div class="s_edit ${visible}" id="${s_id}" data-id="${s_id}" data-s_name="${s_name}" data-active="${s_active}">
                                    <i class='bx bxs-edit'></i>
                                </div>
                            </div>
                    `;

                    const productsResponse = await getFetch(`/getProducts?sectorId=${s_id}`, 'GET');
                    const products = JSON.parse(productsResponse);
                    let productsHTML = `<div class="products">`;

                    for (const p of products) {
                        const p_id = p.id;
                        const p_name = p.name;
                        const p_section = s_name;
                        const p_id_section = s_id;
                        const p_price = p.price;
                        const p_active = p.active;

                        let none = (p_name == "" || p_name == null) ? 'off' : "";

                        if (rol == 1 && p_active == 0 || p_active == 1) {
                            productsHTML += `
                                <article class="Product ${none}">
                                    <div>
                                        <div class="p_edit ${visible}" data-id="${p_id}" data-p_name="${p_name}" data-p_id_section="${p_id_section}" data-p_section="${p_section}" data-p_price="${p_price}" data-p_active="${p_active}">
                                            <i class='bx bxs-edit'></i>
                                        </div>
                                        <p class="p_name">${p_name}</p>
                                        <p class="p_price">${p_price}</p>
                                    </div>
                                    <div id="add_product">
                                        <button type="button" id="${p_id}" data-p_name="${p_name}" data-p_price="${p_price}">Add</button>
                                    </div>
                                </article>
                            `;
                        }
                    }

                    productsHTML += `</div>`;
                    sectionsHTML += productsHTML + `</section> <br><br>`;
                }
                title = s_name;
            }
        }

        data_home.innerHTML = sectionsHTML;
        openAndCloseProduct();
        openAndCloseSection();
        oneMoreToCart();
        getOptionsFromSections();
        closeLoad()
    } catch (error) {
        closeLoad()
        console.error('Error:', error);
    }
}


function openAndCloseSection() {

    //Cierra la ventana de Secciones
    const close_section = document.getElementById('close_section');
    if (close_section) {
        close_section.addEventListener('click', () => {
            const see_section = document.getElementById('see_section');
            see_section.classList.toggle('on');
            see_section.classList.add('off');

            const send_section = document.getElementById('send_section');
            send_section.classList.remove('on');
            send_section.classList.add('off');

            const edit_section = document.getElementById('edit_section');
            edit_section.classList.remove('on');
            edit_section.classList.add('off');

            const see_id = document.getElementById('see_id');
            see_id.classList.remove('on');
            see_id.classList.add('off');

            const see_active = document.getElementById('see_active');
            see_active.classList.add('off');
            see_active.classList.remove('on');

            const get_id = document.getElementById('get_id');
            get_id.value = "";
            const set_section = document.getElementById('set_section');
            set_section.value = "";

            set_error = document.getElementById('error');
            set_error.textContent = "";
        })
    }
    //Abre ventana de secciones
    const add_section = document.getElementById('add_section');
    if (add_section) {
        add_section.addEventListener('click', () => {
            // console.log('click')
            const see_section = document.getElementById('see_section');
            see_section.classList.toggle('off');
            see_section.classList.add('on');

            const send_section = document.getElementById('send_section');
            send_section.classList.remove('off');
            send_section.classList.add('on');

        })
    }
    //Abre ventana de editar Secciones
    const s_edit = document.querySelectorAll('.s_edit');
    if (s_edit.length > 0) {
        s_edit.forEach((elem) => {
            elem.addEventListener('click', () => {
                // console.log(elem.dataset)
                // console.log(elem.dataset.id)
                const see_section = document.getElementById('see_section');
                see_section.classList.toggle('off');
                see_section.classList.add('on');

                const edit_section = document.getElementById('edit_section');
                edit_section.classList.remove('off');
                edit_section.classList.add('on');

                const see_id = document.getElementById('see_id');
                see_id.classList.remove('off');
                see_id.classList.add('on');

                const see_active = document.getElementById('see_active');
                see_active.classList.remove('off');
                see_active.classList.add('on');

                const get_id = document.getElementById('get_id');
                get_id.value = `${elem.dataset.id}`;
                const set_section = document.getElementById('set_section');
                set_section.value = `${elem.dataset.s_name}`;
                let active = elem.dataset.active;
                let allActives = document.querySelectorAll('#set_active option');
                if (allActives) {
                    allActives.forEach((elem) => {
                        // console.log(elem);
                        // elem.selected = false;
                        if (elem.value == active) {
                            elem.setAttribute('selected', 'selected');
                            // elem.selected = true;
                        }
                    })
                }
            })
        })
    }
}
function openAndCloseProduct() {

    //Cierra la ventana de Productos
    const close_product = document.getElementById('close_product');
    if (close_product) {
        close_product.addEventListener('click', () => {
            const see_product = document.getElementById('see_product');
            see_product.classList.toggle('on');
            see_product.classList.add('off');

            const send_product = document.getElementById('send_product');
            send_product.classList.remove('on');
            send_product.classList.add('off');

            const edit_product = document.getElementById('edit_product');
            edit_product.classList.remove('on');
            edit_product.classList.add('off');

            const see_id = document.getElementById('see_p_id');
            see_id.classList.remove('on');
            see_id.classList.add('off');

            const see_p_active = document.getElementById('see_p_active');
            see_p_active.classList.add('off');
            see_p_active.classList.remove('on');

            const get_id = document.getElementById('get_p_id');
            get_id.value = "";
            const set_product = document.getElementById('set_product');
            set_product.value = "";
            const set_price = document.getElementById('set_price');
            set_price.value = "";

            set_error = document.getElementById('p_error');
            set_error.textContent = "";

            // let p_section = document.querySelectorAll('#set_p_section option');
            // if (p_section) {
            //     p_section.forEach((elem) => {
            //         console.log(elem);
            //         // elem.selected = false;
            //         if (elem.value == 0) {
            //             elem.setAttribute('selected', 'selected');
            //             // elem.selected = true;
            //         } else {
            //             elem.removeAttribute('selected');
            //         }
            //     })
            // }
            getOptionsFromSections();
        })
    }
    //Abre ventana de Productos
    const add_product = document.getElementById('add_product');
    if (add_product) {
        add_product.addEventListener('click', () => {
            // console.log('click')
            const see_product = document.getElementById('see_product');
            see_product.classList.toggle('off');
            see_product.classList.add('on');

            const send_product = document.getElementById('send_product');
            send_product.classList.remove('off');
            send_product.classList.add('on');

        })
    }
    //Abre ventana de editar Productos
    const p_edit = document.querySelectorAll('.p_edit');
    if (p_edit.length > 0) {
        p_edit.forEach((elem) => {
            elem.addEventListener('click', () => {
                // console.log(elem.dataset)
                // console.log(elem.dataset.id)
                const see_product = document.getElementById('see_product');
                see_product.classList.toggle('off');
                see_product.classList.add('on');

                const edit_product = document.getElementById('edit_product');
                edit_product.classList.remove('off');
                edit_product.classList.add('on');

                const see_id = document.getElementById('see_p_id');
                see_id.classList.remove('off');
                see_id.classList.add('on');

                const see_active = document.getElementById('see_p_active');
                see_active.classList.remove('off');
                see_active.classList.add('on');

                const get_id = document.getElementById('get_p_id');
                get_id.value = `${elem.dataset.id}`;
                const set_product = document.getElementById('set_product');
                set_product.value = `${elem.dataset.p_name}`;
                const set_price = document.getElementById('set_price');
                set_price.value = `${elem.dataset.p_price}`;
                let active = elem.dataset.p_active;
                let allActives = document.querySelectorAll('#set_p_active option');
                if (allActives) {
                    allActives.forEach((elem) => {
                        // console.log(elem);
                        // elem.selected = false;
                        if (elem.value == active) {
                            elem.setAttribute('selected', 'selected');
                            // elem.selected = true;
                        }
                    })
                }
                // const set_p_section = document.getElementById('set_p_section');
                let p_section = document.querySelectorAll('#set_p_section option');
                let p_sec_name = elem.dataset.p_id_section;
                if (p_section) {
                    p_section.forEach((elem) => {
                        // console.log(elem);
                        // elem.selected = false;
                        if (elem.value == p_sec_name) {
                            elem.setAttribute('selected', 'selected');
                            // elem.selected = true;
                        }
                    })
                }
            })
        })
    }
}

async function getOptionsFromSections() {
    try {
        const response = await getFetch('/getSectorData', 'GET');
        const res = JSON.parse(response);

        const set_p_section = document.getElementById('set_p_section');
        let options = "";
        options += `<option value="0" selected disabled>Elija una opción ...</option>`;
        res.forEach((elem) => {
            // console.log(elem);
            options += `<option value="${elem.id}">${elem.name}</option>`;
        })
        set_p_section.innerHTML = options;
    } catch (error) {
        console.error('Error:', error);
    }

}

const cart = document.getElementById('see_cart');
if (cart) {
    cart.addEventListener('click', () => {
        const data_cart = document.querySelector('.data-cart');
        const cart_container = document.querySelector('.cart-container');
        if (data_cart) {
            data_cart.classList.toggle('off');
            // cart.classList.toggle('all_cart');
        }
        if (cart_container) {
            // cart_container.classList.toggle('off');
            cart_container.classList.toggle('all_cart');
        }
    })
}

function updateTotal() {
    const all_items = document.getElementById('cantidad_total');
    const precio = document.getElementById('precio_total');
    let totalQuantity = 0;
    let totalPrice = 0;

    const quantityInputs = document.querySelectorAll('.cart-cant input[type="number"]');
    // Selecciona todos los precios
    const priceElements = document.querySelectorAll('.cart-price');

    quantityInputs.forEach((input, index) => {
        const quantity = parseInt(input.value) || 0;
        // Eliminar caracteres no numéricos
        const price = parseFloat(priceElements[index].textContent.replace(/[^0-9.-]+/g, "")) || 0;

        if (quantity > 0 && price > 0) {
            totalQuantity += quantity;
            totalPrice += quantity * price;
        }
    });

    all_items.dataset.total = totalQuantity;
    precio.dataset.total_price = totalPrice;
    all_items.textContent = `Total: ${totalQuantity}`;
    precio.textContent = `${totalPrice}`;
    // console.log(total); 
    // console.log(`Total Quantity: ${totalQuantity}, Total Price: ${totalPrice.toFixed(2)}`);
}
const generateTicket = document.getElementById('generateTicket');
if (generateTicket) {
    generateTicket.addEventListener('click', () => {
        const conf = confirm('Desea agregar algún producto más al carrito?');
        if (conf == true) {
            const cantidad_total = document.getElementById('cantidad_total');
            const precio_total = document.getElementById('precio_total').dataset.total_price;
            // console.log(parseInt(cantidad_total.dataset.total));
            if (parseInt(cantidad_total.dataset.total) <= 0) {
                alert('No puede generar una boleta vacia.')
                return;
            } else {
                const cart = document.querySelectorAll('.cart-selected article:not(.skeleton)');
                let data = [];
                cart.forEach((elem) => {
                    // console.log(elem);
                    let name = elem.querySelector('.cart-name').textContent;
                    let price = elem.querySelector('.cart-price').textContent;
                    let cant = elem.querySelector('input[name="total"]').value;
                    data.push({
                        "description": name,
                        "unit_price": price,
                        "quantity": cant,
                        "total": price * cant,
                        "precio_total": precio_total
                    });
                    // console.log(name, price, cant)
                })
                // console.log(data);
                getFetchPDF('/download-pdf', 'POST', data)
                    .then(res => {
                        console.log(res);
                    })
                    .catch(error => console.error('Error:', error));
            }
        }
    })
}
function oneMoreToCart() {
    const add_product = document.querySelectorAll('#add_product button');
    const cart = document.getElementsByClassName('cart-selected')[0]; // Asegúrate de que existe un carrito

    if (!cart) {
        console.error("Carrito no encontrado");
        return;
    }
    let children = cart.children;
    // console.log(children.length);

    add_product.forEach(elem => {
        elem.addEventListener('click', () => {
            const pre_cart = document.querySelectorAll('.pre-cart');
            // console.log(elem.id);
            // let children = cart.children;
            // console.log(children.length);
            let id = elem.id;
            let name = elem.dataset.p_name;
            let price = elem.dataset.p_price;

            let existingProduct = document.getElementById(`p_${id}`);
            for (let index = 0; index < 4; index++) {
                pre_cart[index].classList.add('off');
            }

            // pre_cart.classList.add('off');
            if (existingProduct) {
                let quantityInput = existingProduct;
                quantityInput.value = parseInt(quantityInput.value) + 1;
                updateTotal();
            } else {
                let article = document.createElement('article');
                article.classList.add('only-cart');

                let nameElement = document.createElement('p');
                nameElement.classList.add('cart-name');
                nameElement.textContent = name;

                let priceElement = document.createElement('p');
                priceElement.classList.add('cart-price');
                priceElement.textContent = price;

                let div = document.createElement('div');
                div.classList.add('cart-cant');

                let label = document.createElement('label');
                label.setAttribute('for', 'total');
                label.textContent = 'Cantidad';

                let input = document.createElement('input');
                input.type = 'number';
                input.name = 'total';
                input.min = '0';
                input.value = '1';
                input.id = `p_${id}`;

                //Agrega un OnChange para que lo tomo cada que se llama a la función
                input.addEventListener('change', updateTotal);

                div.appendChild(label);
                div.appendChild(input);

                article.appendChild(nameElement);
                article.appendChild(priceElement);
                article.appendChild(div);

                cart.appendChild(article);
                updateTotal();
            }
        });
    });
}

function getProducts(sectorId) {
    getFetch(`/getProducts?sectorId=${sectorId}`, 'GET')
        .then(response => {
            res = JSON.parse(response);
            res.forEach(e => {
                console.log(e);
            });
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