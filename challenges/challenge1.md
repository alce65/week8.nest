# Challenge 1

Crear con Express o con Nest un API con endpoints de Mascotas y Usuarios almacenado los datos en una DB Postgres a la que accedemos con Prisma.

- Mascotas:
  - id
  - nombre
  - tipo
  - edad
  - usuarioId

- Usuarios:
  - id
  - nombre
  - email
  - password
  - (mascotas)

Cada usuario puede tener muchas mascotas, y cada mascota pertenece a un solo usuario.

Los usuarios pueden hacer login y registrarse.

Implementamos un  un CRUD de mascotas, solo para usuarios logueados.

- los usuarios logueados pueden ver todas las mascotas.
- cualquier usuario puede añadir mascotas
- cada usuario puede modificar y borrar solo sus mascotas.

Probamos los endpoints en una colección de Postman
Testeamos los controllers y servicios con Jest

## Optional

Añadimos un front con Angular para interactuar con la API.
