from flask import Flask,redirect,session,render_template,request,send_from_directory;
import os;
from Model import bdd


app = Flask(__name__,template_folder="templates",static_folder="static"); #Nombre de la App y Ubicación de los archivos .HTML
#Key de variable de sesion
conn = bdd.BddMethods();
secret = conn.hashPassword("1234");
# print(secret);
app.secret_key = secret;
# Users;
@app.route("/login", methods=['GET', 'POST'])
def login():
    # return "<h1>Welcome</h1>";
    if request.method == "POST":
        login = conn.getUser(request.form["username"],request.form["password"])
        if login:
            session["logged"] = True;
            session["name"] = request.form["username"];
            if request.form["username"] == "f":
                session["rol"] = 1;
            else:
                session["rol"] = 2;
            return redirect("/home")
        return render_template("login.html",error="Credenciales Erroneas")
    return render_template("login.html");
@app.route("/home", methods = ['GET', 'POST'])
def Home():
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
    print(session);
    return render_template("home.html");
@app.route("/setCuil", methods=['POST'])#Preguntar como acceder directamente a las funciones
def setCuil():
    pass;

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




