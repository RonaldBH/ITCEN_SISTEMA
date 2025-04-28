# PROYECTO_ITCEN

**PROYECTO_ITCEN** es un sistema de gestión diseñado para facilitar la administración de clientes, contratos, órdenes de compra, logística, y facturación, entre otros. El sistema está compuesto por un backend basado en **FastAPI** con **PostgreSQL** y un frontend desarrollado con **React** y **Bootstrap**.

## Estructura del Proyecto

El proyecto está organizado en dos carpetas principales:

- **`backend/`**: Contiene el código del servidor, utilizando **FastAPI**, **SQLAlchemy** (para interactuar con la base de datos PostgreSQL) y **Alembic** para la migración de la base de datos.
- **`frontend/`**: Contiene el código del cliente utilizando **React** y **Bootstrap**. El frontend está orientado a facilitar la interacción del usuario con el sistema.

## Tecnologías Utilizadas

### Backend:
- **FastAPI**: Framework web moderno y rápido para construir APIs con Python.
- **SQLAlchemy**: ORM (Object Relational Mapper) para interactuar con la base de datos.
- **PostgreSQL**: Base de datos relacional utilizada para almacenar la información del sistema.
- **Alembic**: Herramienta para manejar migraciones de la base de datos.
- **JWT (JSON Web Tokens)**: Autenticación y autorización del usuario.

### Frontend:
- **React**: Biblioteca de JavaScript para construir interfaces de usuario.
- **Bootstrap**: Framework de diseño responsivo y componentes interactivos.
- **Axios**: Cliente HTTP para realizar peticiones al backend.

## Requisitos

### Backend:
- Python 3.9+
- PostgreSQL 12+
- Dependencias del proyecto (instaladas con `pip`):

```bash
pip install -r backend/requirements.txt
```

### Frontend:
- Node.js 14+
- npm 6+
- Dependencias del proyecto (instaladas con npm):

```bash
npm install
```

## Instalación

### Backend:

1. Clonar el repositorio:

```bash
git clone https://github.com/usuario/proyecto-itcen.git
cd proyecto-itcen/backend
```

2. Instalar las dependencias de Python:

Si estás utilizando un entorno virtual (recomendado):

```bash
python -m venv venv
source venv/bin/activate  # Linux/MacOS
venv\Scripts\activate     # Windows
```

Luego, instala las dependencias:

```bash
pip install -r requirements.txt
```

3. Configurar el archivo `.env`:

Crea un archivo `.env` en la raíz del directorio backend y configura las variables necesarias (como las credenciales de la base de datos).

4. Ejecutar las migraciones:

```bash
alembic upgrade head
```

5. Ejecutar el servidor FastAPI:

```bash
uvicorn main:app --reload
```

El servidor se ejecutará en [http://localhost:8000](http://localhost:8000).

### Frontend:

1. Clonar el repositorio:

```bash
git clone https://github.com/usuario/proyecto-itcen.git
cd proyecto-itcen/frontend
```

2. Instalar las dependencias de Node.js:

```bash
npm install
```

3. Ejecutar el servidor de desarrollo de React:

```bash
npm start
```

El frontend se ejecutará en [http://localhost:3000](http://localhost:3000).

## Cómo Contribuir

1. Haz un fork del repositorio.
2. Crea tu rama de características:

```bash
git checkout -b feature/nueva-caracteristica
```

3. Haz commit de tus cambios:

```bash
git commit -am 'Añadir nueva característica'
```

4. Haz push a tu rama:

```bash
git push origin feature/nueva-caracteristica
```

5. Crea un pull request.

¡Gracias por contribuir a **PROYECTO_ITCEN**! 🎉

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.
