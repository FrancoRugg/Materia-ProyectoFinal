import sqlobject as SO;
import os;
from datetime import datetime
import bcrypt;
# pip install bcrypt


db = os.path.abspath("Database/bdd.db");
database = 'sqlite:/'+ db.replace('\\','/');

__connection__=SO.connectionForURI(database);

class Users(SO.SQLObject):
    """Crea tabla de usuarios""";
    user = SO.StringCol(length = 40);
    password = SO.StringCol(length = 40);
    rol = SO.IntCol();
    active = SO.IntCol();
    
class Sector(SO.SQLObject):
    """Crea la tabla Sector"""
    s_name = SO.StringCol(length = 40);
    active = SO.IntCol();
    client = SO.MultipleJoin('Products');
    
class Products(SO.SQLObject):
    sector = SO.ForeignKey("Sector", default = None, cascade = False);
    p_name = SO.StringCol(length = 40);
    p_price = SO.IntCol();
    active = SO.IntCol();
    
class Transactions(SO.SQLObject):
    data = SO.StringCol(length = 255);
    time = SO.IntCol(); #Guardarlo también en el log
    total = SO.IntCol();
    aproved = SO.IntCol();
    
    # t.total as Total, t.aproved as Aprovado, 
    # seleccionar Transacciones x Fecha:
    # select p.t_name as Nombre, p.t_cantidad as Cantidad, p.t_price as Precio, t.total as Total, t.time as Fecha, t.aproved as Aprobado from Productss as p 
    # inner join Transaction as t on t.id = p.id_transaction
    # where t.time between FECHA AND FECHA
    
    # Seleccionar datos de ProductsTransaction por id_transaction
    # select p.t_name as Nombre, p.t_cantidad as Cantidad, p.t_price as Precio from ProductsTransaction as p 
    # where id_transaction = ?
    
    # Lista de cantidades:
    # select p.p_name as Nombre, count(p.p_cantidad) as Cantidad
    # inner join Transaction as t on t.id = p.id_transaction
    # where t.time between FECHA AND FECHA
    # order by asc(Cantidad)
    
    
# class ProductsTransaction(SO.SQLObject):
#     id_transaction = SO.ForeignKey("Transaction", default = None, cascade = False);
#     t_name = SO.StringCol(length = 40);
#     t_price = SO.IntCol();
#     t_cantidad = SO.IntCol();
class Logs(SO.SQLObject):
    created_by = SO.StringCol(length = 40);
    obs = SO.StringCol(length = 255);
    action = SO.StringCol(length = 40);
    time = SO.IntCol();
    
    
    
# Users.dropTable();
# Users.createTable(ifNotExists = True)
# Sector.createTable(ifNotExists = True)
# Products.createTable(ifNotExists = True)
# Transactions.createTable(ifNotExists = True)
# # ProductsTransaction.createTable(ifNotExists = True)
# Logs.createTable(ifNotExists = True)
    
# Users(user = 'f',password = 'f1',active = 1, rol = 1)
# Users(user = 't',password = 't1',active = 1, rol = 2)
class BddMethods:
    def hashPassword(self, password):
        """Recibe una contraseña y devuelve su hash."""
        password = password.encode('utf-8')  # Convierte la contraseña a bytes
        sal = bcrypt.gensalt()
        return bcrypt.hashpw(password, sal).decode('utf-8')  # Devuelve el hash como string
    
    def checkPass(self, password, hash):
        """Verifica si una contraseña coincide con su hash."""
        password = password.encode('utf-8')  # Convierte la contraseña a bytes
        hash = hash.encode('utf-8')  # Convierte el hash a bytes
        return bcrypt.checkpw(password, hash)  # Retorna True si coinciden, False si no
    def newTime(self):
        """Trae tiempo en timestamps"""
        current_time = datetime.now().timestamp()
        return current_time
    
    def getUser(self,userName, password):
        """Se trae el usuario consultado"""
        get =   Users.select(SO.AND(Users.q.user == userName, Users.q.active == 1));
        # get = get.getOne();
        
        if get.count() > 0:
            validate = get[0].password;
            # validate = self.hashPassword(get[0].password);
            # return print("Pass hashed: "+ validate);
            return self.checkPass(password, validate);
        # else:
        #     # VER SI LO MANEJO CON LAS EXCEPCIONES O CON LOS MENSAJES GENERADOS
        #     raise Exception("Usuario inexistente.");
        #     return "Usuario inexistente";
    
    def getOrCreateSector(self, created_by, sector):
        """Busca si existe el Sector, caso contrario lo crea y en ambos te devuelve el dato"""
        sector = sector.strip();
        created_by = created_by.lower().strip();
        
        get = Sector.select(SO.AND(Sector.q.s_name == sector,Sector.q.active == 1))
        
        if get.count() > 0:
            Logs(created_by = f"{created_by}",obs =  f"Buscó el sector {sector}", action = 'GET', time = self.newTime())
            print(get[0].s_name);
            return False;
        # else:
            
    def editSector(self,created_by, ID, newSectorName, newActive):
        """Permite editar el nombre y la visibilidad del sector"""
        newSectorName = newSectorName.strip();
        created_by = created_by.lower().strip();
        newActive = newActive;
        ID = ID;
        
        newData = Sector.select(Sector.q.id == ID);
        if(newData.count() > 0):
            if newSectorName == "":
                Logs(created_by = f"{created_by}",obs =  f"Editó el campo active {newData[0].active} a {newActive} del sector {newData[0].s_name}", action = 'UPDATE', time = self.newTime())
                newData[0].active = newActive;
            else:
                exist = Sector.select(SO.AND(Sector.q.s_name == newSectorName, Sector.q.id != ID));
                if exist.count() <= 0:
                    Logs(created_by = f"{created_by}",obs =  f"Editó el campo active {newData[0].active} a {newActive} y el nombre del sector {newData[0].s_name} a {newSectorName}", action = 'UPDATE', time = self.newTime())
                    newData[0].active = newActive;
                    newData[0].s_name = newSectorName;
                else: 
                    return "Error: Sector Existente!";
        else:
            exist = Sector.select(Sector.q.s_name == newSectorName);
            if exist.count() <= 0:
                newSector = Sector(s_name = newSectorName, active = 1);
                sectorId = newSector.id;
                p_random = Products(p_name = "",sectorID = sectorId, p_price = 0, active = 0);
                # self.addOrEditProducts("Test",0,sectorId,"Null",1233,0);
                Logs(created_by = f"{created_by}",obs =  f"Agregó el sector {newSectorName}", action = 'INSERT', time = self.newTime())
            else: 
                return "Error: Sector Existente!";
            
            # if newSector:
            #     print(f"Sector {newSectorName} creado");
            #     return True;
            # else:
            #     return f"Error al crear el sector {newSectorName}";
            
    def getAllSector(self):
        """Se trae todos los sectores"""
        # RECRODAR EN EL CÖDIGO QUE LOS INACTIVOS SOLO PUEDA VERLOS Y EDITAR EL ADMIN, EL RESTO LOS VË Y NO PUEDE REALIZAR CLICK EN ELLOS
        # Sector.q.id == Products.q.sector
        getAll = Sector.select(1==1)
        
        if getAll.count() > 0:
            return getAll;
        else:
            return None;
    def getProducts(self, sectorId):
        sectorId = sectorId;
        getAll = Products.select(Products.q.sector == sectorId)
        
        if getAll.count() > 0:
            return getAll;
        else:
            return None;
            
    def getTransactions(self, created_by, since, until):
        """Trae transacciones por un periodo de tiempo determinado"""
        created_by = created_by.lower().strip();
        # since_str = str(since);
        # until_str = str(until);
        getAll = Transactions.select(SO.AND(Transactions.q.time >= since,Transactions.q.time <= until))

        since_timestamp = int(since)
        until_timestamp = int(until)

        since_not_timestamp = datetime.fromtimestamp(since_timestamp).strftime('%Y-%m-%d');
        until_not_timestamp = datetime.fromtimestamp(until_timestamp).strftime('%Y-%m-%d');
        # since_not_timestamp = datetime.strptime(since, '%Y-%m-%d');
        # until_not_timestamp = datetime.strptime(until, '%Y-%m-%d');
        
        if getAll.count() > 0:
            Logs(created_by = f"{created_by}",obs =  f"Buscó Transacciones desde {since_not_timestamp}, hasta {until_not_timestamp}", action = 'GET', time = self.newTime())
            return getAll
        else:
            return None;
        
    def addOrEditProducts(self, created_by, ID, sectorId, name, price, active):
        """Crea o edita productos"""
        created_by = created_by.lower().strip();
        name = name;
        price = price;
        active = active;
        sectorId = sectorId;
        ID = ID;
        
        # sector = SO.ForeignKey("Sector", default = None, cascade = False);
        # p_name = SO.StringCol(length = 40);
        # p_price = SO.IntCol();
        # active = SO.IntCol();
        get = Products.select(Products.q.id == ID);
        obs = "";
        if get.count() > 0:
            exist = Products.select(SO.AND(Products.q.p_name == name,Products.q.id != ID));
            if exist.count() <= 0:
                obs = f"Modificó un producto "
                # obs = "Creó un nuevo producto"
                if get[0].p_name != name:
                    obs += f"-Nombre: {get[0].p_name} a {name} "
                if get[0].p_price != price:
                    obs += f"-Precio: {get[0].p_price} a {price} "
                if get[0].active != active:
                    obs += f"-Active: {get[0].active} a {active} "
                if get[0].sectorID != sectorId:
                    obs += f"-sectorId: {get[0].sectorID} a {sectorId} "
                Logs(created_by = f"{created_by}",obs = obs, action = 'UPDATE', time = self.newTime())
                get[0].p_name = name;
                get[0].p_price = price;
                get[0].active = active;
                get[0].sectorID = sectorId;
            else:
                return "Error: Producto Existente";
        else:
            exist = Products.select(Products.q.p_name == name);
            if exist.count() <= 0:
                newProduct = Products(p_name = f"{name}",sectorID = sectorId, p_price = price, active = active);
                if newProduct:
                    obs = f"Creó el producto {name}, con Precio: {price} y Active: {active}"
                    Logs(created_by = f"{created_by}",obs = obs, action = 'INSERT', time = self.newTime())
            else:
                return "Error: Producto Existente";
                
    # MODO DE USO
        #     transactions = getTransactions(self, "user1", since, until)
        # for transaction in transactions:
        #     print(transaction.user, transaction.transaction_timestamp)
        
    def getAllTransactions(self):
        """Se trae todas las Transacciones"""
        getAll = Transactions.select(True == True)
        
        if getAll.count() > 0:
            return getAll;
        else:
            return None;
        
    def setTransaction(self, created_by, data, total, aproved):
        """Devuelve el id de la transacción creada"""
        created_by = created_by.lower().strip();
        time = self.newTime();
        
        # data = SO.StringCol(length = 255);
        # time = SO.IntCol(); #Guardarlo también en el log
        # total = SO.IntCol();
        # aproved = SO.IntCol();
        newTransaction = Transactions(data = f"{data}", time = time, total = total, aproved = aproved);
        
        if newTransaction:
            Logs(created_by = f"{created_by}",obs =  f"Creó una nueva Transacción", action = 'INSERT', time = self.newTime())
            return newTransaction.id;
        
    def getLogs(self,created_by):
        created_by = created_by.lower().strip();
        get = Logs.select(True == True);
        
        if get.count() > 0:
            Logs(created_by = f"{created_by}",obs = "Buscó Logs", action = 'GET', time = self.newTime())
            return get;
        else:
            return "No se encuentran Logs.";
    def getLogByAction(self, created_by, action):
        action = action.upper().strip();
        created_by = created_by.lower().strip();
        get = Logs.select(Logs.q.action == action);
        
        if get.count() > 0:
            Logs(created_by = f"{created_by}",obs = f"Buscó Logs con la Action: {action}", action = 'GET', time = self.newTime())
            return get;
        else:
            return "No se encuentran Logs con la accion buscada.";
            
            
            
    
    
    
    
    