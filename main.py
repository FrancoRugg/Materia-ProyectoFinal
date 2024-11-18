from flask import Flask,redirect,session,render_template,request,send_from_directory,jsonify,send_file, make_response;
import os;
from Model import bdd
from datetime import timedelta
from static.PDF.setPDF import create_pdf as new_PDF;
import random;

app = Flask(__name__,template_folder="templates",static_folder="static"); #Nombre de la App y Ubicación de los archivos .HTML
#Key de variable de sesion
conn = bdd.BddMethods();
secret = conn.hashPassword("1234");
# print(secret);
app.secret_key = secret;
# Users;
# Establece el tiempo de duración de la sesión (ejemplo: 1 día)
app.permanent_session_lifetime = timedelta(days=1)

#INICIALIZAR EN FALSO
logged = False;
@app.route("/login", methods=['GET', 'POST'])
def login():
    # return "<h1>Welcome</h1>";
    if request.method == "POST":
        login = conn.getUser(request.form["username"],request.form["password"])
        if login:
            logged = True;
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
    if session.get('logged', False) == False:
        return redirect("/login");
    #=================================================
    # session["rol"] = 1;#CAMBIAR
    #=================================================
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
    
# Ruta para descargar el PDF
@app.route("/transactions")
def goToTransactions():
    if session.get('logged', False) == False:
        return redirect("/login");
    return render_template("/transactions.html"); #Si no especifica nada, va al login
@app.route("/logs")
def goToLogs():
    if session.get('logged', False) == False:
        return redirect("/login");
    return render_template("/logs.html"); #Si no especifica nada, va al login
@app.route("/getLogs", methods=['GET'])
def getLogs():
    if session.get('logged', False) == False:
        return redirect("/login");
    create_by = session.get('name', 'invitado')
    all = conn.getLogs(create_by);
    logs_list = [{'created_by': s.created_by, 'time': s.time,'action':s.action, 'obs': s.obs} for s in all]  # Convierte a lista de diccionarios
    return jsonify(logs_list)  # Devuelve como JSON
@app.route("/getLogByAction", methods=['GET'])
def getLogByAction():
    if session.get('logged', False) == False:
        return redirect("/login");
    create_by = session.get('name', 'invitado')
    action = str(request.args.get('action'))
    all = conn.getLogByAction(create_by,action);
    logs_list = [{'created_by': s.created_by, 'time': s.time,'action':s.action, 'obs': s.obs} for s in all]  # Convierte a lista de diccionarios
    return jsonify(logs_list)  # Devuelve como JSON
@app.route("/getTransactions", methods=['GET','POST'])
def getTransactions():
    if session.get('logged', False) == False:
        return redirect("/login");
    all = conn.getAllTransactions();
    transactions_list = [{'id': s.id, 'data': s.data, 'time': s.time, 'total': s.total} for s in all]  # Convierte a lista de diccionarios
    return jsonify(transactions_list)  # Devuelve como JSON
@app.route("/getTransactionsByTime", methods=['GET','POST'])
def getTransactionsByTime():
    if session.get('logged', False) == False:
        return redirect("/login");
    create_by = session.get('name', 'invitado');
    since = str(request.args.get('since'));
    until = str(request.args.get('until')); 
    
    all = conn.getTransactions(create_by,since,until);
    if all == None:
        transactions_list = [{'id': "None", 'data': "None", 'time': "None", 'total': "None"}]  # Convierte a lista de diccionarios
    else:
        transactions_list = [{'id': s.id, 'data': s.data, 'time': s.time, 'total': s.total} for s in all]  # Convierte a lista de diccionarios
        
    return jsonify(transactions_list)  # Devuelve como JSON
@app.route('/download-pdf', methods=['POST'])
def download_pdf():
    if session.get('logged', False) == False:
        return redirect("/login");
    create_by = session.get('name', 'invitado')
    data = request.get_json()
    
    if not data or not isinstance(data, list):
        return jsonify({"error": "Datos inválidos"}), 400
    
    total = int(data[0]['precio_total']);
    # total = sum(item['precio_total'] for item in data); #REALIZA LA SUMA
    
    pdf_buffer = new_PDF(create_by,"12345", data, f"{total}")
    
    # Guardar el archivo localmente
    rand = random.randint(1, 10000);#GEnera núm random
    res = conn.setTransaction(create_by,data,total,1);
    print({"status":"Success","result":res});
    
    with open(f"recibo_pago_{res}_buffer.pdf", "wb") as f:
        f.write(pdf_buffer.getvalue())
    # Preparar la respuesta para descargar el PDF
    response = make_response(send_file(
        pdf_buffer,
        as_attachment=True,
        download_name=f"recibo_pago_{res}_.pdf",
        mimetype='application/pdf'
    ))
    return response
@app.route('/download-transaction', methods=['POST'])
def download_transaction():
    if session.get('logged', False) == False:
        return redirect("/login");
    create_by = session.get('name', 'invitado')
    data = request.get_json()
    print(data)
    if not data or not isinstance(data, list):
        return jsonify({"error": "Datos inválidos"}), 400
    
    total = int(data[0]['precio_total']);
    # total = sum(item['precio_total'] for item in data); #REALIZA LA SUMA
    
    pdf_buffer = new_PDF(create_by,"12345", data, f"{total}")
    
    # Guardar el archivo localmente
    rand = random.randint(1, 10000);#GEnera núm random

    # Preparar la respuesta para descargar el PDF
    response = make_response(send_file(
        pdf_buffer,
        as_attachment=True,
        download_name=f"recibo_pago.pdf",
        mimetype='application/pdf'
    ))
    return response

@app.route("/editProduct", methods=['GET','POST'])#Preguntar como acceder directamente a las funciones
def editProduct():
    if session.get('logged', False) == False:
        return redirect("/login");
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
    if session.get('logged', False) == False:
        return redirect("/login");
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
    if session.get('logged', False) == False:
        return redirect("/login");
    all = conn.getAllSector();
    sector_list = [{'id': s.id, 'name': s.s_name, 'active': s.active} for s in all]  # Convierte a lista de diccionarios
    return jsonify(sector_list)  # Devuelve como JSON
@app.route("/getProducts", methods=['GET'])
def getProducts():
    if session.get('logged', False) == False:
        return redirect("/login");
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
        if session.get('logged', False) == True:
            del session['logged'];
            session.pop('logged', None);
            text = session["name"];
            return redirect("/login");
            return f"Hasta la próxima {text}!"
        else:
            return redirect("/login");
            
    except KeyError:
        return "No se encuentra logueado"
            

@app.route("/")
def gotoIndex():
    return redirect("/login"); #Si no especifica nada, va al login

app.run(debug = True,host='localhost',port=5001); #Del 65535 hasta el 1023 están reservados.

# debug = True, El servidor se recarga con cada cambio




