# FitApp Backend -- En progreso

<p align="center">
  <img src="/public/nestjs-logo-small.png" width="120" alt="Nest Logo" />
</p>

Backend desarrollado con [NestJS](https://nestjs.com/) y [Prisma](https://www.prisma.io/) para la gestión de usuarios, autenticación y planes de entrenamiento.

---

<p align="center">
  <img src="/public/hero-background.png" alt="Hero Background" style="width:100%; height:auto; max-height: 400px; object-fit: cover; border-radius: 8px;">
</p>

<div align="center">
  <h1>FitApp Backend</h1>
  <p>
    Una API RESTful robusta y escalable construida con NestJS y Prisma para potenciar tu aplicación de fitness.
  </p>
  <br />
  <p>
    <a href="#descripción" style="padding: 10px 20px; background-color: #E00052; color: white; text-decoration: none; border-radius: 25px; font-weight: bold;">
      🚀 Ver Documentación
    </a>
    &nbsp;&nbsp;&nbsp;
    <a href="https://github.com/tu-usuario/fitapp_backend" target="_blank" style="padding: 10px 20px; border: 2px solid #333; color: #333; text-decoration: none; border-radius: 25px; font-weight: bold;">
      <img src="https://img.icons8.com/material-outlined/24/000000/github.png" alt="GitHub icon" style="vertical-align: middle; margin-right: 5px; filter: invert(100%);" width="16" height="16">
      Código Fuente
    </a>
  </p>
</div>


---

## Descripción

FitApp Backend es la columna vertebral de tu aplicación de fitness, ofreciendo una API RESTful potente y modular. Construido con el framework progresivo [NestJS](https://nestjs.com/) y el moderno ORM [Prisma](https://www.prisma.io/), este backend está diseñado para ser eficiente, confiable y escalable.

<div align="center">
  <div style="display: flex; justify-content: space-around; flex-wrap: wrap; margin-top: 30px;">
    <div style="flex-basis: 30%; min-width: 250px; padding: 20px; text-align: center;">
      <img src="/public/icon-users.png" alt="User Management Icon" width="60" height="60" style="margin-bottom: 10px;">
      <h3 style="margin-top: 0;">Gestión de Usuarios</h3>
      <p>Administra perfiles de usuario, roles y preferencias con un sistema robusto y seguro.</p>
    </div>
    <div style="flex-basis: 30%; min-width: 250px; padding: 20px; text-align: center;">
      <img src="/public/icon-lock.png" alt="Authentication Icon" width="60" height="60" style="margin-bottom: 10px;">
      <h3 style="margin-top: 0;">Autenticación Segura</h3>
      <p>Implementa un sistema de autenticación completo (JWT) para proteger tus rutas y datos.</p>
    </div>
    <div style="flex-basis: 30%; min-width: 250px; padding: 20px; text-align: center;">
      <img src="/public/icon-training.png" alt="Training Plans Icon" width="60" height="60" style="margin-bottom: 10px;">
      <h3 style="margin-top: 0;">Planes de Entrenamiento</h3>
      <p>Define y gestiona planes de entrenamiento personalizados y sus progresiones para los usuarios.</p>
    </div>
  </div>
</div>


## Estructura del Proyecto

El proyecto sigue una estructura modular, facilitando la organización y escalabilidad:

\`\`\`
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
\`\`\`


