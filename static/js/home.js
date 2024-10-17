window.onload = () => {
    // openLoad();
    getSections()

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
        <div class="${visible}" id="add_section">
            <i class='bx bx-list-plus' ></i>
        </div>
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
                        const p_price = p.price;
                        const p_active = p.active;

                        if (rol == 1 && p_active == 0 || p_active == 1) {
                            productsHTML += `
                                <article class="Product">
                                    <div>
                                        <div class="p_edit ${visible}" data-id="${p_id}">
                                            <i class='bx bxs-edit'></i>
                                        </div>
                                        <p class="p_name">${p_name}</p>
                                        <p class="p_price">$ ${p_price}</p>
                                    </div>
                                    <div>
                                        <button type="button" id="${p_id}">Add</button>
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
        openAndCloseSection();
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
    console.log('Open')
    document.querySelector('.loadingContainer2').style.display = 'block';
}
function closeLoad() {
    console.log('Close')
    document.querySelector('.loadingContainer2').style.display = 'none';
}