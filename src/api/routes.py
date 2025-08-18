"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""

from flask import Flask, request, jsonify, Blueprint, send_file
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from api.models import db, User, Gasto, Objetivo, Articulo, Link#, PostForo
from api.utils import generate_sitemap, APIException
from io import BytesIO
import requests
from datetime import datetime
from api.routes import api 


api = Blueprint('api', __name__)
CORS(api)
CORS(api, resources={r"/api/": {"origins": ""}})



@api.route("/user/register", methods=['POST'])
def register():
    body = request.get_json()
    try:
        new_user = User()
        new_user.username = body["username"]
        new_user.email = body["email"]
        new_user.set_password(body["password"]) 
        new_user.firstname = body["firstname"]
        new_user.lastname = body["lastname"]
        new_user.country = body["country"]
        new_user.perfil = body["perfil"]
        new_user.phone = body["phone"] 
        new_user.sueldo = body["sueldo"]
        new_user.is_student = body["is_student"] 
        new_user.is_active = True
        new_user.isNewUser = True

        db.session.add(new_user)
        db.session.commit()
        access_token = create_access_token(identity=str(new_user.id))
        return jsonify({
            "msg": "Usuario registrado con éxito",
            "token": access_token,
            "username": new_user.username
        }), 201
    except requests.exceptions.RequestException as e:
        return jsonify({"msg": "Error al registrar el usuario", "error": str(e)}), 500

        # Obtener dinero disponible (sueldo o dinero de estudiante)
@api.route('/user/dinero', methods=['GET'])
@jwt_required()
def get_dinero():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if user is None:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    # ✅ Dinero total según rol
    dinero_total = user.dinero_disponible if user.is_student else user.sueldo

    return jsonify({
        "dinero_total": dinero_total,
        "is_student": user.is_student
    }), 200
    """ try:
        # Preparar los datos para la solicitud a la API de gastos
        gasto_data = {
            "user_id": new_user.id,
            "sueldo": body["sueldo"],
            "is_student": body["is_student"],
        }
        # Enviar solicitud POST a la API de gastos
        response = requests.post(
            "http://localhost:3001/api/gasto/register", json=gasto_data)
        response_data = response.json()
        access_token = create_access_token(identity=str(new_user.id))
        return jsonify({
            "msg": "Usuario registrado con éxito",
            "gasto": response_data,
            "token": access_token
        }), 201
    except requests.exceptions.RequestException as e:
        return jsonify({"msg": "Error al registrar el usuario", "error": str(e)}), 500 """

# Endpoint de iniciar sesión ya sea con username o email
@api.route("/user/login", methods=['POST'])
def login():
    body = request.get_json()
    try:
        login_user = body.get("identificador")
        password = body.get("password")

        user = User.query.filter((User.username == login_user) | (User.email == login_user)).first()

        if user and user.check_password(password):
            access_token = create_access_token(identity=str(user.id))
            return jsonify({"token": access_token}), 200
    except Exception as e:
        print("Something went wrong:", e)
    return jsonify({"msg": "username/email o contraseña equivocados"}), 401

# Con el Token devolver el usuario
@api.route('/user/profile', methods=['GET'])
@jwt_required()
def profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if user is None:
        return jsonify({"msg":"Usuario no encontrado"}), 404
    return jsonify({"user": user.serialize()}), 200

# Modificar el username o el email
@api.route("/user/update", methods=['PUT'])
@jwt_required()
def update_user():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    body = request.get_json()
    if 'username' in body:
        user.username = body['username']
    if 'email' in body:
        user.email = body['email']
    if 'firstname' in body:
        user.firstname = body['firstname']
    if 'lastname' in body:
        user.lastname = body['lastname']
    if 'country' in body:
        user.country = body['country']
    if 'phone' in body:
        user.phone = body['phone']
    if 'perfil' in request.files:
        imagen_file = request.files['perfil']
        #link.img_nombre = imagen_file.filename
        user.perfil = imagen_file.read()
    if 'sueldo' in body:
        user.sueldo = body['sueldo']
    if 'is_student' in body:
        user.is_student = body['is_student']
    if 'is_active' in body:
        user.is_active = body['is_active']
    if 'isNewUser' in body:
        user.isNewUser = body['isNewUser']

    db.session.commit()
    return jsonify({"msg": "Usuario actualizado correctamente"}), 200
    """ try:
        gasto_data = {
            "user_id": user.id,
            "sueldo": body.get("sueldo", user.gasto.sueldo if user.gasto else None),
            "is_student": body.get("is_student", user.gasto.is_student if user.gasto else None),
        }
        response = requests.put(
            "http://localhost:3001/api/gasto/update", json=gasto_data)
        response_data = response.json()
        return jsonify({"msg": "Detalles del usuario actualizados correctamente", "gasto": response_data}), 200
    except requests.exceptions.RequestException as e:
        return jsonify({"msg": "Error al actualizar el gasto", "error": str(e)}), 500 """

# Endpoint para modificar la contraseña
@api.route("/user/change-password", methods=['PUT'])
@jwt_required()
def change_password():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    body = request.get_json()
    if 'old_password' not in body or 'new_password' not in body:
        return jsonify({"msg": "Se requieren tanto Old_Password como New_Password"}), 400

    if user.check_password(body['old_password']):
        user.set_password(body['new_password'])
        db.session.commit()
        return jsonify({"msg": "Contraseña actualizada correctamente"}), 200

    return jsonify({"msg": "La contraseña actual es incorrecta"}), 401

# Endpoint de iniciar sesión solo con email (recuperación)
@api.route("/user/forgotten", methods=['POST'])
def forgotten():
    if request.method == 'OPTIONS':
        return '', 200

    body = request.get_json()
    login_user = body['email']
    user = User.query.filter(User.email == login_user).first()
    if user is not None:
        access_token = create_access_token(identity=str(user.id))
        return jsonify({"token": access_token}), 200
    return jsonify({"msg":"Usuario no encontrado"}), 404

# Endpoint para modificar la contraseña a la nueva contraseña


@api.route("/user/new-password", methods=['PUT'])
@jwt_required()
def new_password():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    body = request.get_json()

    if 'password' not in body or not body['password']:
        return jsonify({"msg": "Se requiere la contraseña"}), 400

    user.set_password(body['password'])
    db.session.commit()
    return jsonify({"msg": "Contraseña actualizada correctamente"}), 200

# Endpoint para eliminar el usuario


@api.route("/user/delete", methods=['DELETE'])
@jwt_required()
def delete_user():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404
    Gasto.query.filter_by(user_id=user.id).delete()
    Objetivo.query.filter_by(user_id=user.id).delete()
    db.session.delete(user)
    db.session.commit()
    return jsonify({"msg": "Usuario eliminado"}), 200
    """ try:
        gasto_data = {
            "user_id": user.id
        }
        response = requests.post(
            "http://localhost:3001/api/gasto/delete", json=gasto_data)
        response_data = response.json()
        db.session.delete(user)
        db.session.commit()
        return jsonify({"msg": "Usuario eliminado", "gasto": response_data}), 200
    except requests.exceptions.RequestException as e:
        return jsonify({"msg": "Error al eliminar el gasto", "error": str(e)}), 500 """


@api.route("/user/token", methods=['POST'])
@jwt_required()
def token():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    try:
        access_token = create_access_token(identity=str(user.id))
        return jsonify({"token": access_token}), 200
    except Exception as e:
        return jsonify({"msg": "Error al procesar el token", "error": str(e)}), 401


#__________________________________________________________________________________

# Endpoints relacionados con gastos

# Registro de Gasto
@api.route("/gasto/register", methods=['POST'])
@jwt_required()
def register_gasto():
    current_user_id = get_jwt_identity()
    body = request.get_json()

    new_gasto = Gasto()
    new_gasto.concepto = body["concepto"]
    new_gasto.cantidad = body["cantidad"]
    new_gasto.emoji = body.get("emoji")
    new_gasto.user_id = current_user_id

    db.session.add(new_gasto)
    db.session.commit()

    return jsonify({"msg": "Gasto registrado con éxito", "gasto": new_gasto.serialize()}), 201

# Obtener Gasto por ID
@api.route("/gasto/<int:gasto_id>", methods=['GET'])
@jwt_required()
def get_gasto(gasto_id):
    current_user_id = get_jwt_identity()
    gasto = Gasto.query.filter_by(id=gasto_id, user_id=current_user_id).first()

    if not gasto:
        return jsonify({"msg": "Gasto no encontrado"}), 404

    return jsonify({"gasto": gasto.serialize()}), 200

# Obtener todos los Gastos del usuario
@api.route("/gasto", methods=['GET'])
@jwt_required()
def get_all_gastos():
    current_user_id = get_jwt_identity()
    gastos = Gasto.query.filter_by(user_id=current_user_id).all()
    return jsonify({"gastos": [gasto.serialize() for gasto in gastos]}), 200

# Actualizar Gasto
@api.route("/gasto/update/<int:gasto_id>", methods=['PUT'])
@jwt_required()
def update_gasto(gasto_id):
    current_user_id = get_jwt_identity()
    gasto = Gasto.query.filter_by(id=gasto_id, user_id=current_user_id).first()

    if not gasto:
        return jsonify({"msg": "Gasto no encontrado"}), 404

    body = request.get_json()
    if 'concepto' in body:
        gasto.concepto = body['concepto']
    if 'cantidad' in body:
        gasto.cantidad = body['cantidad']
    if 'emoji' in body:
        gasto.emoji = body['emoji']

    db.session.commit()
    return jsonify({"msg": "Gasto actualizado correctamente", "gasto": gasto.serialize()}), 200

# Eliminar Gasto
@api.route("/gasto/delete/<int:gasto_id>", methods=['DELETE'])
@jwt_required()
def delete_gasto(gasto_id):
    current_user_id = get_jwt_identity()
    gasto = Gasto.query.filter_by(id=gasto_id, user_id=current_user_id).first()

    if not gasto:
        return jsonify({"msg": "Gasto no encontrado"}), 404

    db.session.delete(gasto)
    db.session.commit()
    return jsonify({"msg": "Gasto eliminado correctamente"}), 200

 # Registro de Objetivo
@api.route("/objetivo/register", methods=["POST"])
@jwt_required()
def register_objetivo():
    try:
        current_user_id = int(get_jwt_identity())
        data = request.get_json()
        print("➡️ Recibido en backend:", data)

        fecha_limite_str = data.get("fecha_limite")
        fecha_limite = datetime.strptime(fecha_limite_str, '%Y-%m-%d') if fecha_limite_str else None

        nuevo_objetivo = Objetivo(
            titulo=data.get("titulo"),
            descripcion=data.get("descripcion"),
            emoji=data.get("emoji"),
            cantidad_meta=data.get("cantidad_meta"),
            fecha_limite=fecha_limite,
            frecuencia=data.get("frecuencia"),
            user_id=current_user_id
        )

        db.session.add(nuevo_objetivo)
        db.session.commit()

        print("✅ Objetivo guardado correctamente:", nuevo_objetivo.serialize())
        return jsonify(nuevo_objetivo.serialize()), 201

    except Exception as e:
        print("❌ Error al guardar objetivo:", str(e))
        return jsonify({"msg": "Error al guardar objetivo", "error": str(e)}), 500
    
    
# Obtener Objetivo por ID
@api.route("/objetivo/<int:objetivo_id>", methods=['GET'])
@jwt_required()
def get_objetivo(objetivo_id):
    current_user_id = get_jwt_identity()
    objetivo = Objetivo.query.filter_by(id=objetivo_id, user_id=current_user_id).first()

    if not objetivo:
        return jsonify({"msg": "Objetivo no encontrado"}), 404

    return jsonify({"objetivo": objetivo.serialize()}), 200


#obtener todos los objetivos (jorge: hice un cambio en el return para que me cogiera los objetivos de la main)
@api.route("/objetivo", methods=["GET"])
@jwt_required()
def get_objetivos():
    current_user_id = int(get_jwt_identity())
    objetivos = Objetivo.query.filter_by(user_id=current_user_id).all()
    return jsonify([o.serialize() for o in objetivos]), 200



# Actualizar Objetivo
@api.route("/objetivo/update/<int:objetivo_id>", methods=["PUT"])
@jwt_required()
def update_objetivo(objetivo_id):
    current_user_id = get_jwt_identity()
    objetivo = Objetivo.query.filter_by(id=objetivo_id, user_id=current_user_id).first()

    if not objetivo:
        return jsonify({"msg": "Objetivo no encontrado"}), 404

    data = request.get_json()

    objetivo.titulo = data.get("titulo", objetivo.titulo)
    objetivo.cantidad_meta = data.get("cantidad_meta", objetivo.cantidad_meta)

    fecha_limite_str = data.get("fecha_limite")
    if fecha_limite_str:
        try:
            objetivo.fecha_limite = datetime.strptime(fecha_limite_str, "%Y-%m-%d")
        except ValueError:
            return jsonify({"msg": "Formato de fecha inválido. Usa YYYY-MM-DD."}), 400

    objetivo.descripcion = data.get("descripcion", objetivo.descripcion)
    objetivo.emoji = data.get("emoji", objetivo.emoji)
    objetivo.frecuencia = data.get("frecuencia", objetivo.frecuencia)

    db.session.commit()

    return jsonify({"msg": "Objetivo actualizado"}), 200

# Eliminar Objetivo
@api.route("/objetivo/delete/<int:objetivo_id>", methods=['DELETE'])
@jwt_required()
def delete_objetivo(objetivo_id):
    current_user_id = get_jwt_identity()
    objetivo = Objetivo.query.filter_by(id=objetivo_id, user_id=current_user_id).first()

    if not objetivo:
        return jsonify({"msg": "Objetivo no encontrado"}), 404

    db.session.delete(objetivo)
    db.session.commit()

    return jsonify({"msg": "Objetivo eliminado correctamente"}), 200
                                                                                                                               


#__________________________________________________________________________________

# Registro de Artículo
@api.route("/articulo/register", methods=['POST'])
def register_articulo():
    body = request.get_json()

    new_articulo = Articulo()
    new_articulo.titulo = body["titulo"]
    new_articulo.autor = body["autor"]
    new_articulo.texto = body["texto"]
    new_articulo.fecha = body["fecha"]
    new_articulo.likes = body["likes"]

    db.session.add(new_articulo)
    db.session.commit()

    return jsonify({"msg": "Artículo registrado con éxito", "articulo": new_articulo.serialize()}), 201

# Obtener todos los Artículos
@api.route("/articulo/", methods=['GET'])
def get_articulos():
    articulos = Articulo.query.all()
    return jsonify({"articulos": [articulo.serialize() for articulo in articulos]}), 200

# Obtener Artículo por ID
@api.route("/articulo/<int:articulo_id>", methods=['GET'])
def get_articulo(articulo_id):
    articulo = Articulo.query.filter_by(id=articulo_id).first()
    if not articulo:
        return jsonify({"msg": "Artículo no encontrado"}), 404

    return jsonify({"articulo": articulo.serialize()}), 200


# Actualizar Artículo
@api.route("/articulo/update/<int:articulo_id>", methods=['PUT'])
def update_articulo(articulo_id):
    articulo = Articulo.query.filter_by(id=articulo_id).first()

    if not articulo:
        return jsonify({"msg": "Artículo no encontrado"}), 404

    body = request.get_json()
    if 'titulo' in body:
        articulo.titulo = body['titulo']
    if 'texto' in body:  
        articulo.texto = body['texto']
    if 'autor' in body:
        articulo.autor = body['autor']
    if 'fecha' in body:  
        articulo.fecha = body['fecha']
    if 'likes' in body:
        articulo.likes = body['likes']

    db.session.commit()
    return jsonify({"msg": "Artículo actualizado correctamente", "articulo": articulo.serialize()}), 200

# Eliminar Artículo y sus Links
@api.route("/articulo/delete/<int:articulo_id>", methods=['DELETE'])
def delete_articulo(articulo_id):
    articulo = Articulo.query.filter_by(id=articulo_id).first()

    if not articulo:
        return jsonify({"msg": "Artículo no encontrado"}), 404

    # Eliminar los Links asociados
    Link.query.filter_by(articulo_id=articulo_id).delete()

    db.session.delete(articulo)
    db.session.commit()
    return jsonify({"msg": "Artículo y Links eliminados correctamente"}), 200


#__________________________________________________________________________________

# Registro de Link
@api.route("/link/register", methods=['POST'])
def register_link():
    if 'imagen' not in request.files:
        return jsonify({"msg": "No se envió ninguna imagen"}), 400

    imagen_file = request.files['imagen']
    enlace = request.form.get("enlace")
    articulo_id = request.form.get("articulo_id")

    new_link = Link(
        img_nombre=imagen_file.filename,
        imagen=imagen_file.read(),
        enlace=enlace,
        articulo_id=articulo_id
    )

    db.session.add(new_link)
    db.session.commit()
    return jsonify({"msg": "Link registrado con éxito", "link": new_link.serialize()}), 201

# Obtener Link por ID (metadatos)
@api.route("/link/<int:link_id>", methods=['GET'])
def get_link(link_id):
    link = Link.query.filter_by(id=link_id).first()
    if not link:
        return jsonify({"msg": "Link no encontrado"}), 404
    return jsonify({"link": link.serialize()}), 200


# Obtener imagen de un Link por ID
@api.route("/link/<int:link_id>/imagen", methods=['GET'])
def get_link_image(link_id):
    link = Link.query.filter_by(id=link_id).first()
    if not link:
        return jsonify({"msg": "Imagen no encontrada"}), 404
    return send_file(BytesIO(link.imagen), mimetype="image/jpeg", download_name=link.img_nombre)


# Obtener todos los Links relacionados a un Artículo
@api.route("/articulo/<int:articulo_id>/links", methods=['GET'])
def get_links_by_articulo(articulo_id):
    links = Link.query.filter_by(articulo_id=articulo_id).all()
    return jsonify({"links": [link.serialize() for link in links]}), 200


# Actualizar Link (opcionalmente reemplazar imagen)
@api.route("/link/update/<int:link_id>", methods=['PUT'])
def update_link(link_id):
    link = Link.query.filter_by(id=link_id).first()
    if not link:
        return jsonify({"msg": "Link no encontrado"}), 404

    if 'imagen' in request.files:
        imagen_file = request.files['imagen']
        link.img_nombre = imagen_file.filename
        link.imagen = imagen_file.read()

    if 'enlace' in request.form:
        link.enlace = request.form['enlace']

    db.session.commit()
    return jsonify({"msg": "Link actualizado correctamente", "link": link.serialize()}), 200


# Eliminar Link
@api.route("/link/delete/<int:link_id>", methods=['DELETE'])
def delete_link(link_id):
    link = Link.query.filter_by(id=link_id).first()
    if not link:
        return jsonify({"msg": "Link no encontrado"}), 404

    db.session.delete(link)
    db.session.commit()
    return jsonify({"msg": "Link eliminado correctamente"}), 200


#__________________________________________________________________________________

# Registro de post
""" @api.route('/foro', methods=['POST'])
@jwt_required()
def crear_post():
    user_id = get_jwt_identity()
    data = request.get_json()
    post = PostForo(titulo=data['titulo'], contenido=data['contenido'], user_id=user_id)
    db.session.add(post)
    db.session.commit()
    return jsonify({"msg": "Post creado"}), 201

# Obtener post por ID
@api.route("/foro/<int:id>", methods=['GET'])
@jwt_required()
def get_objetivo(id):
    current_user_id = get_jwt_identity()
    post = PostForo.query.filter_by(id=id, user_id=current_user_id).first()

    if not objetivo:
        return jsonify({"msg": "Post no encontrado"}), 404

    return jsonify({"post": post.serialize()}), 200    

# Obtener todos los post del usuario
@api.route('/foro', methods=['GET'])
def listar_posts():
    current_user_id = get_jwt_identity()
    posts = PostForo.query.filter_by(user_id=current_user_id).all()
    return jsonify({"posts": [posts.serialize() for p in posts]}), 200
    
# Obtener todos los post del foro
@api.route('/foro', methods=['GET'])
def listar_posts():
    posts = PostForo.query.all()
    return jsonify({"posts": [posts.serialize() for p in posts]}), 200

@api.route('/foro/<int:id>', methods=['PUT'])
@jwt_required()
def editar_post(id):
    post = PostForo.query.get(id)
    data = request.get_json()
    if post:
        post.titulo = data.get('titulo', post.titulo)
        post.contenido = data.get('contenido', post.contenido)
        db.session.commit()
        return jsonify({"msg": "Post actualizado"}), 200
    return jsonify({"msg": "No encontrado"}), 404

@api.route('/foro/<int:id>', methods=['DELETE'])
@jwt_required()
def borrar_post(id):
    post = PostForo.query.get(id)
    if post:
        db.session.delete(post)
        db.session.commit()
        return jsonify({"msg": "Post eliminado"}), 200
    return jsonify({"msg": "No encontrado"}), 404 """
