# FitApp Backend 🚧 *En progreso*

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

Backend desarrollado con [NestJS](https://nestjs.com/) y [Prisma](https://www.prisma.io/) para la gestión de usuarios, autenticación y planes de entrenamiento.

---

## Tabla de Contenidos
- [Descripción](#descripción)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Comandos Útiles](#comandos-útiles)
- [Pruebas](#pruebas)
- [Contribución](#contribución)
- [Contacto](#contacto)

---

## Descripción
FitApp Backend es la columna vertebral de tu aplicación de fitness, ofreciendo una API RESTful potente y modular. Construido con el framework progresivo [NestJS](https://nestjs.com/) y el moderno ORM [Prisma](https://www.prisma.io/), este backend está diseñado para ser eficiente, confiable y escalable.

- **Gestión de Usuarios:** Administra perfiles, roles y preferencias.
- **Autenticación Segura:** JWT para proteger rutas y datos.
- **Planes de Entrenamiento:** Define y gestiona rutinas personalizadas.

---

## Estructura del Proyecto

```
fitapp_backend/
├── src/
│   ├── modules/
│   │   ├── auth/          # Módulo de Autenticación y Registro de usuarios
│   │   ├── users/         # Módulo de Gestión de Usuarios (CRUD, perfiles)
│   │   └── plans/         # Módulo de Gestión de Planes de Entrenamiento
│   └── prisma.service.ts  # Servicio global para interactuar con Prisma
├── prisma/                # Esquema de la base de datos y archivos de migraciones
├── test/                  # Pruebas End-to-End (e2e)
├── docker-compose.yml     # Configuración de servicios de Docker (ej. base de datos)
└── ...                    # Otros archivos de configuración (package.json, tsconfig.json, etc.)
```

---

## Comandos Útiles

- **Instalar dependencias:**
  ```bash
  npm install
  ```
- **Iniciar en desarrollo:**
  ```bash
  npm run start:dev
  ```
- **Ejecutar migraciones Prisma:**
  ```bash
  npx prisma migrate deploy
  ```
- **Generar cliente Prisma:**
  ```bash
  npx prisma generate
  ```

---

## Pruebas

- **Pruebas Unitarias:**
  ```bash
  npm run test
  ```
- **Pruebas End-to-End:**
  ```bash
  npm run test:e2e
  ```
- **Cobertura de Pruebas:**
  ```bash
  npm run test:cov
  ```

---

## Contribución

¡Las contribuciones son bienvenidas! Por favor, abre un issue o pull request para sugerencias o mejoras.

---

## Contacto

- Autor: Manuel Latorre
- Email: manuel.latorre11@ejemplo.com


