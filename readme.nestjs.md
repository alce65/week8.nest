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
  - jest (sin configuración)

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

## Desarrollo de un proyecto

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
  - Probar el endpoint con Postman o curl

- Añadimos usuarios:
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
  - Probamos el endpoint con Postman o curl

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

- Logger: [Pino](https://getpino.io/) en su implementación para nest: [nestjs-pino](https://www.npmjs.com/package/nestjs-pino)

  - Instalación: `npm i nestjs-pino pino-http` y como dependencia de desarrollo `npm i -D pino-pretty`
  - En appModule imports: [ LoggerModule.forRoot()],
  - En main app.useLogger(app.get(LoggerModule));

- Gestión de Errores (Middleware de errores):

  - Los servicios puede devolver errores que se propagan al controller, utilizando las clases de excepciones de Next (`HttpException`, `NotFoundException`) para devolver un error con un mensaje y un código de estado HTTP adecuado.
  - el decorador `@HttpCode` para devolver un código de estado HTTP adecuado.
  
  - se pueden manejar con un middleware de errores. Para ello, se añade un middleware de errores al módulo principal de la aplicación con el decorador `@Catch` y se añade al array de `providers`. El middleware de errores debe implementar la interfaz `ExceptionFilter` y sobre-escribir el método `catch` para manejar los errores.
