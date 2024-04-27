# NestJS Backend

Nuevo framework [NestJS](https://nestjs.com/) incorporado en el bootcamp.

- Instalación y uso
  - `npm install -g @nestjs/cli`
  - `nest new project-name`
  - `cd project-name`
  - `npm run start:dev`

- Boilerplate incluido
  - eslint.js
  - gitignore
  - prettierrc
  - tsconfig.json
  - package.json
  - nest-cli.json
  - jest (configuración en package.json)

- Elementos de la aplicación
  - `main.ts`
  - `app.module.ts`
  - `app.controller.ts`
  - `app.service.ts`

## Conceptos básicos

- Los **decorators** son funciones que se utilizan para añadir metadatos a una clase, un método o una propiedad. Por ejemplo, para añadir un endpoint a un controller o para añadir un middleware a un método de un controller.

-Los **módulos** definen el espacio de nombres al que pertenecen los componentes de la aplicación: controllers y servicios. Los módulos se definen con el decorador `@Module` y se importan en el `AppModule` para que la aplicación tenga acceso a sus componentes.

- Los **controllers** utilizan el decorador `@Controller` para definir una ruta a la que responden. De esta forma no se necesita un archivo de rutas (Router).

  - Cada método de un controller es un endpoint de la API REST que utiliza el decorador `@Get`, `@Post`, `@Patch` o `@Delete` para definir el verbo HTTP y las particularidades de la ruta (e.g. los parámetros de las rutas dinámicas).

  - Los métodos del controller pueden recibir parámetros de la petición HTTP (query, body, params, headers) utilizando los decoradores `@Query`, `@Body`, `@Param` y `@Headers`. También pueden utilizar la forma de trabajar de Express, recibiendo el objeto `Request` y `Response` como parámetros, e incluso la función `next`, marcados con los decoradores `@Req`, `@Res` y `@Next`.
  
  - Los métodos del controller pueden devolver un valor que se envía como respuesta al cliente. Por ejemplo, un objeto JSON, un código de estado HTTP o una re-dirección a otra ruta. Para devolver un código de estado HTTP, se puede utilizar el decorador `@HttpCode`.

- Los **servicios** son clases que contienen la lógica de negocio de la aplicación. Se inyectan en los controllers y otros servicios mediante el decorador `@Injectable`. Son la capa repositorio donde se realizan las operaciones CRUD hacia la BD, por ejemplo utilizando un ORM como prisma.

  - Los servicios puede devolver errores que se propagan al controller, utilizando las clases de excepciones de Next (`HttpException`, `NotFoundException`) para devolver un error con un mensaje y un código de estado HTTP adecuado.

- Los **repositories** son clases que se utilizan para acceder a la base de datos. Se definen con el decorador `@Injectable` y se inyectan en los servicios para realizar operaciones CRUD.

- Los **providers** son clases que se utilizan para inyectar dependencias en otros componentes de la aplicación. Se definen con el decorador `@Injectable` y se añaden al array de `providers` de un módulo.

- Las **entities** que definen el modelo de los datos pueden ser **interfaces** o **clases**. Lo mismo sucede con los **dto** que se utilizan para definir la estructura de los datos que se envían y se reciben en la aplicación. 

  - Los **dto** se pueden extender para validar los datos de entrada de la petición.

- Los **pipes** son funciones que se ejecutan antes de que se ejecute un método de un controller. Se reciben como parámetros en los decoradores. Se utilizan para validar los datos de entrada de la petición.
  - Por ejemplo, para comprobar que un email tiene el formato correcto. Existen pipes predefinidos como `ValidationPipe` que se encargan de validar los datos de entrada de la petición. Otros ejemplos son `ParseIntPipe` y `ParseBoolPipe`.
  - También se pueden crear pipes personalizados que se utilizan para transformar los datos de entrada de la petición antes de que se validen.

- Los **guards** son funciones que se ejecutan antes de que se ejecute un método de un controller. Se utilizan para comprobar si el usuario tiene permiso para acceder a un recurso. Por ejemplo, para comprobar si el usuario está autenticado.

- Los **middleware** son funciones que se ejecutan antes o después de la ejecución de un método de un controller. Se utilizan para modificar la respuesta o la petición antes de que llegue al controller o después de que sale de él. Por ejemplo, para manejar errores o para añadir un token de autenticación a la cabecera de la petición.

- Los **interceptores** son middleware que se ejecutan antes o después de la ejecución de un método de un controller. Se utilizan para modificar la respuesta o la petición antes de que llegue al controller o después de que sale de él.  Por ejemplo, para añadir un token de autenticación a la cabecera de la petición.

- Los **filters** son funciones que se ejecutan cuando se produce un error en la aplicación. Se utilizan para manejar los errores y devolver una respuesta adecuada al cliente. Por ejemplo, para devolver un mensaje de error en formato JSON.

## Desarrollo de un proyecto en clase

### Creación de un proyecto (dia 1)

- Crear un nuevo proyecto con `nest new project-name`
- Crear un interface con `nest g interface entities/task`
- Creamos un nuevo interface con `nest g interface tasks/dto/create-task.dto`
- Crear un nuevo módulo con `nest g module tasks/tasks`
- Crear un nuevo controller con `nest g controller tasks/tasks`
- Crear un nuevo service con `nest g service tasks/tasks`
- Añadir un nuevo endpoint a un controller:
  - Definir un método en el controller con el decorador `@Get`, `@Post`, `@Patch` o `@Delete`
  - Añadir la lógica del endpoint en el método del controller
  - O añadir la lógica del endpoint en un servicio y llamar al servicio desde el método del controller
  - Añadir el endpoint al módulo importando el controller y añadiéndolo al array de `controllers`
  - Añadir el endpoint al `app.module.ts` importando el módulo y añadiéndolo al array de `imports`
  - Arrancar el servidor con `npm run start:dev`
  - Probar el endpoint con Postman

- Añadir acceso a una base de datos:
  - Instalar un ORM como Prisma con `npm install @prisma/cli @prisma/client`
  - Configurar Prisma con `npx prisma init`
  - Crear un modelo de datos en `schema.prisma`
  - Generar un cliente de Prisma y una primera migración con `npx prisma migrate dev --name init`
  - Comprobar  un modelo de datos con `npx prisma studio`
  - Añadir al servicio TaskService las operaciones para acceder a la base de datos
  - Arrancar el servidor con `npm run start:dev`
  - Probar el endpoint con Postman

- Añadimos usuarios:
  - Añadir el modelo de datos de usuario a Prisma
  - Generar una nueva migración con `npx prisma migrate dev --name add-user`
  - Creamos un interface con `nest g interface entities/user`
  - Creamos un nuevo interface con `nest g interface users/dto/create-user.dto`
  - Creamos un nuevo módulo con `nest g module users/users`
  - Creamos un nuevo controller con `nest g controller users/users`
  - Creamos un nuevo service con `nest g service users/users`
  - Añadimos un nuevo endpoint para crear un usuario en el controller
  - Añadimos la lógica para crear un usuario en el service
  - Añadimos el endpoint al módulo importando el controller y añadiéndolo al array de `controllers`
  - Añadimos el módulo al `app.module.ts` importando el módulo y añadiéndolo al array de `imports`
  - Arrancamos el servidor con `npm run start:dev`
  - Probamos el endpoint con Postman

- Ajustes en la configuración de la aplicación

  - Configuración del puerto desde environment
  - Configuración de CORS
  - Configuración de recursos estáticos
  - Logs de la aplicación

- Validaciones
- Instalamos [class-validator](https://www.npmjs.com/package/class-validator) y [class-transformer](https://www.npmjs.com/package/class-transformer) con `npm install class-validator class-transformer`
- Añadimos los decoradores adecuados a los DTOs, que en este caso tienen que ser clases en lugar de interfaces. Por ejemplo, para validar que un campo es una cadena de texto no vacía y que tiene formato de email, utilizamos los decoradores `@IsString`, `@IsNotEmpty` y `@IsEmail`.
- Para que se apliquen las validaciones, añadimos un pipe al método del controller con el decorador `@UsePipes(new ValidationPipe())`. El pipe `ValidationPipe` se encarga de validar los datos de entrada de la petición y de devolver un error si no son válidos.
- El pipe incluye una propiedad `transform` que se puede utilizar para transformar los datos de entrada de la petición antes de que se validen. Por ejemplo, para transformar un campo de la petición a mayúsculas, utilizamos el decorador `@Transform` con una función que transforma el campo a mayúsculas.
- También existe la propiedad `whitelist` que se puede utilizar para eliminar los campos de la petición que no están definidos en el DTO. Por ejemplo, para eliminar un campo de la petición que no está definido en el DTO, utilizamos el decorador `@Allow` con una lista de campos permitidos.

### Challenge 1

### Evolución de la aplicación (día 2)

- Relaciones entre entidades
- Añadir una relación uno a muchos entre dos entidades Usuarios y Tareas (n:1)
- Actualizar el modelo de datos en Prisma
- Generar una nueva migración con `npx prisma migrate dev --name add-relation`
- Actualiza entidades y DTOs
- Actualizar los servicios TaskService y UserService para acceder a la base de datos
- Actualizar los controllers TaskController y UserController para añadir nuevos endpoints
- Comprobar el funcionamiento de los endpoints con Postman

#### Autenticación: Login y Registro de usuarios

- Instalamos [bcrypt](https://www.npmjs.com/package/bcrypt) con `npm install bcrypt`
- Crear un servicio que encapsula las operaciones de hash y comprobación de contraseñas
- Modificar el controller para incluir hash de la password usando el servicio
- Añadir un endpoint para hacer login en el controller
- Añadir un método en el servicio localizar usuarios al hacer login
- Instalar [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) con `npm install @nestjs/jwt`  
- Añadir un método en el controller para hacer login
- Añadir una Guard de authentication para proteger los endpoints de la aplicación

## Evolución de la aplicación (fuera de clase)

Resultado obtenido en los dos días de clase:

- Entidades y Relaciones:
  - User (User has many Tasks)
  - Task (Task belongs to User)

- Funcionalidades:
  - CRUD de usuarios
  - CRUD de tareas
  - Validaciones de los DTOs
  - Autenticación de usuarios (Login)


Objetivos:

- Autorización: Roles y Permisos
- Logging y Tracing
- Incorporación de imágenes (upload y storage en Cloudinary)
- Gestión de errores (?)
- Paginación y Filtros (?)

### Autorización: Roles y Permisos

- Añadir en taskModule un token y un provider para el servicio repositorio
- Añadir una Guard para comprobar el 'propietario' de un recurso (e.g. una tarea)
  - Usa el servicio repo que le proporcione el módulo
  - Unas el nombre del campo con la foreign key proporcionado como metadato
  - Se inyecta reflector para poder leer ese metadato
- Usar la Guard en Task Controller para proteger los endpoints de update y delete

### Logging y Tracing

- Logger de NestJS: `Logger` (importado de `@nestjs/common`)
- Logger Alternativo: [Pino](https://getpino.io/) en su implementación para nest: [nestjs-pino](https://www.npmjs.com/package/nestjs-pino)

  - Instalación: `npm i nestjs-pino pino-http` y como dependencia de desarrollo `npm i -D pino-pretty`
  - En appModule imports: [ LoggerModule.forRoot()],
  - En main app.useLogger(app.get(LoggerModule));

(De momento no se instala)

Los mensajes de log se pueden personalizar con diferentes niveles de log (log, error, warn, debug, verbose), al existir un método para cada uno de ellos

Accesos al logger existente

- Se inyecta el servicio Logger
- Se utiliza el método log del servicio para registrar mensajes de log
- Su segundo parámetro es el contexto, que se utiliza para identificar el origen del mensaje de log

Los mensajes de log se pueden emitir desde guardas, pipes, interceptores, middleware y servicios

Se añaden ejemplos de como hacerlo en guardas, interceptores y middleware

Para usarlos en todas las rutas, se pueden añadir de forma global en el modulo principal de la aplicación (app.module.ts)

### Gestión de errores

- Gestión de Errores (Middleware de errores):

  - Los servicios puede devolver errores que se propagan al controller, utilizando las clases de excepciones de Next (`HttpException`, `NotFoundException`) para devolver un error con un mensaje y un código de estado HTTP adecuado.
  - el decorador `@HttpCode` para devolver un código de estado HTTP adecuado.
  
  - se pueden manejar con un middleware de errores. Para ello, se añade un middleware de errores al módulo principal de la aplicación con el decorador `@Catch` y se añade al array de `providers`. El middleware de errores debe implementar la interfaz `ExceptionFilter` y sobre-escribir el método `catch` para manejar los errores.
