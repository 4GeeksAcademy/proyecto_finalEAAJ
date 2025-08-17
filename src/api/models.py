from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from flask_bcrypt import Bcrypt
from datetime import datetime

db = SQLAlchemy()
bcrypt = Bcrypt()


db = SQLAlchemy()


class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)
    username: Mapped[str] = mapped_column(String(120), nullable=False)
    firstname: Mapped[str] = mapped_column(String(120), nullable=True)
    lastname: Mapped[str] = mapped_column(String(120), nullable=True)
    country: Mapped[str] = mapped_column(String(120), nullable=True)
    perfil: Mapped[str] = mapped_column(String(120), nullable=True)
    phone: Mapped[str] = mapped_column(String(27), unique=True, nullable=False)
    sueldo = db.Column(db.Float, nullable=False)
    is_student: Mapped[bool] = mapped_column(Boolean(), nullable=False)
    isNewUser: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,

            "username": self.username,
            "firstname": self.firstname,
            "lastname": self.lastname,
            "country": self.country,
            "phone": self.phone,
            "perfil": self.perfil,
            "sueldo": self.sueldo,
            "is_student": self.is_student,
            "isNewUser": self.isNewUser,
            # do not serialize the password, its a security breach
        }

    def set_password(self, password):
        self.password = Bcrypt().generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return Bcrypt().check_password_hash(self.password, password)

class Gasto(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    concepto = db.Column(db.String(255))
    cantidad = db.Column(db.Float)
    emoji = db.Column(db.String(120))
    #categoria = db.Column(db.String(120))
    #fecha = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "concepto": self.concepto,
            "cantidad": self.cantidad,
            "emoji": self.emoji,
            "user_id": self.user_id,
        }


class Objetivo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(255), nullable=False)
    descripcion = db.Column(db.Text, nullable=True)
    emoji = db.Column(db.String(120))
    cantidad_meta = db.Column(db.Float, nullable=False)
    fecha_limite = db.Column(db.DateTime, nullable=True)
    completado = db.Column(db.Boolean, default=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    frecuencia = db.Column(db.String(20)) 

    def serialize(self):
        return {
            "id": self.id,
            "titulo": self.titulo,
            "descripcion": self.descripcion,
            "emoji": self.emoji,
            "cantidad_meta": self.cantidad_meta,
            "fecha_limite": self.fecha_limite.strftime('%Y-%m-%d') if self.fecha_limite else None,
            "frecuencia": self.frecuencia,
            "completado": self.completado
        }

class Articulo(db.Model): 
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(255), nullable=False)
    autor = db.Column(db.String(255), nullable=False)
    texto = db.Column(db.Text, nullable=False)
    fecha = db.Column(db.DateTime, nullable=True)
    likes = db.Column(db.Integer, nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "titulo": self.titulo,
            "autor": self.autor,
            "texto": self.texto,
            "fecha": self.fecha.strftime('%Y-%m-%d') if self.fecha else None,
            "likes": self.likes,
        }
class Link(db.Model): 
    id = db.Column(db.Integer, primary_key=True)
    img_nombre = db.Column(db.String(120), nullable=True)
    imagen = db.Column(db.LargeBinary, nullable=True)# Imagen binaria (BLOB)
    enlace = db.Column(db.String(255), nullable=True)
    articulo_id = db.Column(db.Integer, db.ForeignKey('articulo.id'), nullable=False)

    def serialize(self):
        data =  {
            "id": self.id,
            "enlace": self.enlace,
            "articulo_id": self.articulo_id,
        }
        if self.imagen:
            import base64
            data["img_nombre"] = self.img_nombre
            data["imagen"] = base64.b64encode(self.imagen).decode('utf-8')
        else:
            data["img_nombre"] = None
            data["imagen"] = None
        return data