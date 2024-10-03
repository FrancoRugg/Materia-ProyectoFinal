const btn_see_form = document.getElementById('see_form');
if (btn_see_form) {
    btn_see_form.addEventListener('click', () => {
        const form = document.getElementById('cuil_form')
        form.classList.toggle('off');
        // form.classList.toggle('on');
        btn_see_form.classList.toggle('closeForm')
        if (btn_see_form.textContent == "Abrir Formulario") {
            btn_see_form.textContent = "Cerrar Formulario"
        } else {
            btn_see_form.textContent = "Abrir Formulario"
        }
    }
    );
}

const makeCuil = document.getElementById('makeCuil');
if (makeCuil) {
    makeCuil.addEventListener('click', () => {
        const setCuil = document.getElementById('setCuil');
        const error = document.getElementById('error');
        const dni = document.getElementById('dni').value;
        const genre = document.getElementById('genre').value;

        // console.log(genre)
        // console.log(dni)

        if (dni != null && genre == "M" && dni && genre || dni != null && genre == "F" && dni && genre) {
            error.textContent = "";

            if (dni.length > 8) {
                error.textContent = 'El DNI debe ocupar como máximo 8 digitos.';
                setCuil.textContent = "";
                return;
            }
            if (isNaN(dni)) {
                error.textContent = 'Ha ingresado letras en el DNI';
                setCuil.textContent = "";
                return;
            }

            res = calculate(genre, getDni(dni));

            if (res) {
                setCuil.textContent = `CUIL:${res}`;
            }
        } else {
            error.textContent = "Error! Complete todos los campos.";
            setCuil.textContent = "";
            return;
        }
    })
}

function calculate(genre, dni) {
    let genreDigits;

    if (genre === 'M') {
        genreDigits = "20";
    } else if (genre === 'F') {
        genreDigits = "27";
    }

    const partial = genreDigits + dni;
    const constants = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    let result = 0;

    for (let i = 0; i < partial.length; i++) {
        result += constants[i] * parseInt(partial[i]);
    }

    let verifDigit = result % 11;
    if (verifDigit > 1) {
        verifDigit = 11 - verifDigit;
    }

    if (verifDigit === 1) {
        genreDigits = "23";
        if (genre === 'M') {
            verifDigit = 9;
        } else if (genre === 'F') {
            verifDigit = 4;
        }
    }

    return genreDigits + "-" + dni + "-" + verifDigit;
}

function getDni(dni) {
    const long = dni.length;
    let cant = 8 - long;

    while (cant > 0) {
        dni = "0" + dni;
        cant -= 1;
    }

    return dni;
}