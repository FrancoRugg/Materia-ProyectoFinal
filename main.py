from flask import Flask,redirect,session,render_template,request,send_from_directory,jsonify;
import os;
from Model import bdd
from datetime import timedelta



app = Flask(__name__,template_folder="templates",static_folder="static"); #Nombre de la App y Ubicación de los archivos .HTML
#Key de variable de sesion
conn = bdd.BddMethods();
secret = conn.hashPassword("1234");
# print(secret);
app.secret_key = secret;
# Users;
# Establece el tiempo de duración de la sesión (ejemplo: 1 día)
app.permanent_session_lifetime = timedelta(days=1)
@app.route("/login", methods=['GET', 'POST'])
def login():
    # return "<h1>Welcome</h1>";
    if request.method == "POST":
        login = conn.getUser(request.form["username"],request.form["password"])
        if login:
            session["logged"] = True;
            session["name"] = request.form["username"];
            if request.form["username"] == "Franco":
                session["rol"] = 1;
            else:
                session["rol"] = 2;
            return redirect("/home")
        return render_template("login.html",error="Credenciales Erroneas")
    return render_template("login.html");
@app.route("/home", methods = ['GET', 'POST'])
def Home():
    #=================================================
    session["rol"] = 1;#CAMBIAR
                #=================================================
    # if request.method == "POST":
    #     try:
    #         print(request.form.get('dni'))
    #         print(request.form['dni'])
    #         print(request.form.get('genre'))
    #         if request.form["dni"] and request.form["genre"]:
    #         # if request.form["dni"] != None and request.form["genre"] == "M" or request.form["dni"] != None and request.form["genre"] == "F":
    #             #----------------------
    #             print(request.form.get("dni"))
    #             print(request.form.get("genre"))
    #             session["dni"] = request.form["dni"];
    #             session["genre"] = request.form["genre"];
    #             conn = cuilCalculator(request.form["dni"],request.form["genre"])
    #             conn.validateDNI();
    #             cuil = conn.calculate();
    #             print(cuil)
                
    #             render_template("home.html",setCuil=f"CUIL: {cuil}")
    #             #----------------------
    #             # print(jsonify({'cuil': f'CUIL: {cuil}'}));
    #             # return jsonify({'cuil': f'CUIL: {cuil}'})
    #             # return redirect("/home")
    #         return render_template("home.html",error="Error! Complete todos los campos.") #ESTE]
    #         # return jsonify({'Error' : "Error! Complete todos los campos."})
    #     except Exception as e:
    #         render_template("home.html",error=f"{e.args[0]}") #ESTE
    #         # print({'error' : f"{e.args[0]}"});
    #         # print(jsonify({'error' : f"{e.args[0]}"}));
    #         # jsonify({'error' : f"{e.args[0]}"})
    # all = getSectorData();
    # if all:
    #     print(all);
    #     title = "";
    #     rol = session.get('rol',2);
    #     print(rol)
    #     for single in all:
    #         # print(single)
    #         if(title != single.s_name):
    #             id = single.id;
    #             print(single.s_name);
    #             print('--------------------------');
    #             products = getProducts(id)
    #             for one in products:
    #                 if(rol == 1 and one.active == 0 or one.active == 1):
    #                     print(f"Name: {one.p_name} - Value: {one.p_price} - Active: {one.active}")
    #         # print('--------------------------');
    #         # print(single)
    #         title = single.s_name
    #         # for one in single:
    #         #     print(one);
    #     # print(all)
    # print(session);
    return render_template("home.html");
@app.route("/setCuil", methods=['POST'])#Preguntar como acceder directamente a las funciones
def setCuil():
    pass;
@app.route("/editProduct", methods=['GET','POST'])#Preguntar como acceder directamente a las funciones
def editProduct():
    create_by = session.get('name', 'invitado')
    data = request.get_json()
    
    ID = data.get('ID');
    sectorID = int(data.get('sectorID'));
    p_name = data.get('p_name');
    p_price = int(data.get('p_price'));
    p_active = int(data.get('active'));
    
    res = conn.addOrEditProducts(create_by, ID, sectorID, p_name, p_price, p_active)
    # return res;
    
    return {"status": "success", "result": res}
    
@app.route("/editSection", methods=['GET','POST'])#Preguntar como acceder directamente a las funciones
def editSection():
    create_by = session.get('name', 'invitado')
    data = request.get_json();
    sector = data.get('s_name')
    ID = data.get('ID')
    active = int(data.get('active'));
    
    # exist = conn.getOrCreateSector(create_by,sector);
    # if(exist == False):
    res = conn.editSector(create_by,ID,sector,active);
    return {"status": "success", "result": res}
        # return res;
    # return {"status": "error", "message": "El sector ya existe"}

@app.route("/getSectorData", methods=['GET'])
def getSectorData():
    all = conn.getAllSector();
    sector_list = [{'id': s.id, 'name': s.s_name, 'active': s.active} for s in all]  # Convierte a lista de diccionarios
    return jsonify(sector_list)  # Devuelve como JSON
@app.route("/getProducts", methods=['GET'])
def getProducts():
    sectorId = request.args.get('sectorId') 
    all = conn.getProducts(sectorId);
    if all.count() > 0:
        product_list = [{'id': p.id, 'name': p.p_name, 'price': p.p_price, 'active': p.active} for p in all]  # Convierte a lista de diccionarios
    else:
        product_list = [{'id': None, 'name': "", '': '', 'active': 0} for p in all]  # Convierte a lista de diccionarios

    return jsonify(product_list)  # Devuelve como JSON
    return all;
@app.route("/style.css")
def style():
    """Get CSS"""
    return send_from_directory(os.path.join(os.path.join(app.root_path,'static'),'css'),'style.css')
@app.route("/favicon.ico")
def icon():
    """Agrega el favicon"""
    return send_from_directory(os.path.join(app.root_path,'static'),'favicon.ico',mimetype='image/vnd.microsoft.icon')
@app.route("/exit")
def exit():
    """Bye: logout"""
    # return "Hasta la próxima!"
    try:
        if session["logged"] == True:
            text = session["name"];
            return f"Hasta la próxima {text}!"
    except KeyError:
        return "No se encuentra logueado"
            

@app.route("/")
def gotoIndex():
    return redirect("/login"); #Si no especifica nada, va al login

app.run(debug = True,host='localhost',port=5001); #Del 65535 hasta el 1023 están reservados.

# debug = True, El servidor se recarga con cada cambio




