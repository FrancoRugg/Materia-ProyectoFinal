window.onload = () => {
    getSections()
}
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
    try {
        const response = await getFetch('/getSectorData', 'GET');
        const res = JSON.parse(response);
        let title = "";
        let sectionsHTML = "";

        for (const e of res) {
            const s_name = e.name;
            const s_id = e.id;
            const s_active = e.active;

            if (rol == 1 && s_active == 0 || s_active == 1) {
                if (title !== s_name) {
                    sectionsHTML += `
                        <section class="sections">
                            <div class="title">
                                <h2>${s_name}</h2>
                                <div class="s_edit ${visible}" id="${s_id}" data-id="${s_id}">
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
                                        <p class="p_price">${p_price}</p>
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
    } catch (error) {
        console.error('Error:', error);
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