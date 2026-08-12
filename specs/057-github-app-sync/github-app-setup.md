# Guía — Creación y configuración de la GitHub App para Hito

Esta guía prepara la GitHub App de Hito. No crea usuarios propios: GitHub autentica y autoriza
la instalación; Hito conserva los datos y la configuración en el workspace local.

## 1. Valores exactos para crear la App

En **Settings → Developer settings → GitHub Apps → New GitHub App**, utiliza:

| Campo | Valor |
|---|---|
| GitHub App name | `Hito Local Sync` |
| Description | `Sincroniza proyectos locales de Hito con GitHub Issues y GitHub Projects.` |
| Homepage URL | `https://hito.autos` |
| Callback URL | `https://hito.autos/api/github/callback` |
| Setup URL | `https://hito.autos/github/connect` |
| Redirect on update | Desactivado inicialmente |
| Installation scope | `Only on this account` durante desarrollo |
| Visibility | Private durante desarrollo |
| Request user authorization during installation | Activado |
| Expire user authorization tokens | Activado |
| Webhook | Inactive |

La Callback URL recibe al usuario después de autorizar la App. La Setup URL se usa después de
instalarla; no son la misma ruta.

Para desarrollo local usa una App separada y URLs HTTPS de un túnel:

```text
Homepage URL: https://dev.tu-dominio.com
Callback URL: https://dev.tu-dominio.com/api/github/callback
Setup URL: https://dev.tu-dominio.com/github/connect
```

GitHub permite hasta diez callback URLs. Consulta la [documentación oficial de registro de GitHub Apps](https://docs.github.com/en/apps/creating-github-apps/registering-github-app).

## 2. Crear la App

1. Abre **Settings → Developer settings → GitHub Apps**.
2. Pulsa **New GitHub App**.
3. Introduce los valores de la tabla anterior.
4. Mantén **Webhook** inactivo en v1.
5. Selecciona **Only on this account** para desarrollo.
6. Guarda la App.

## 3. Permisos recomendados

### Repository permissions

| Permiso | Nivel |
|---|---|
| Metadata | Read-only |
| Issues | No access (v1 actual: solo proyecto, sin issues) |
| Pull requests | No access |
| Contents | No access |
| Actions | No access |
| Commit statuses | No access |
| Workflows | No access |
| Administration | No access |

### Additional permissions (Projects)

| Permiso | Nivel | Motivo |
|---|---|---|
| Projects (account / organization) | Read and write | Listar, crear y actualizar GitHub Projects (metadatos del proyecto Hito) |

### Organization permissions

`No access` en v1.

### Account permissions

`No access` en v1.

No solicites `Members`, `Administration`, `Contents` ni permisos amplios de organización sin un
caso de uso documentado. GitHub recomienda seleccionar el mínimo de permisos necesario; consulta
[Choosing permissions for a GitHub App](https://docs.github.com/en/apps/creating-github-apps/registering-a-github-app/choosing-permissions-for-a-github-app).

Para GitHub Projects modernos, prueba primero con estos permisos. Si una consulta concreta exige
otro permiso, añádelo únicamente después de confirmar el error de API y documentar la razón.

## 4. Generar credenciales

En la página de la App:

1. Copia el **App ID**.
2. Copia el **Client ID**.
3. Genera el **Client secret**.
4. Genera una **Private key**.
5. Descarga el `.pem` una sola vez.
6. Guarda todo exclusivamente como secretos del backend.

Variables sugeridas:

```env
GITHUB_APP_ID=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_PRIVATE_KEY=
GITHUB_CALLBACK_URL=https://hito.autos/api/github/callback
GITHUB_SETUP_URL=https://hito.autos/github/connect
```

## 5. Configurar `VITE_GITHUB_BFF_URL`

`VITE_GITHUB_BFF_URL` es la URL base pública del backend/BFF que manejará la GitHub App. No es la
URL de GitHub, no es la Callback URL y no debe contener `/github/connect` ni otra ruta específica.

El frontend construye las rutas a partir de esa base:

```text
VITE_GITHUB_BFF_URL   (por defecto: /api)
  + /github/connect
  + /github/callback
  + /github/connection/:id
  + /github/connection/:id/repositories
  + /github/connection/:id/projects
  + /github/connection/:id/revoke
```

La página pública de la SPA (Setup URL y retorno OAuth) es distinta:

```text
https://hito.autos/github/connect   ← React (sin secretos)
https://hito.autos/api/github/*     ← BFF Vercel (secretos de servidor)
```

### Producción (mismo dominio, recomendado)

Con las funciones en `api/github/*` de este repo:

```env
VITE_GITHUB_BFF_URL=https://hito.autos/api
# o déjalo vacío: el cliente usa /api por defecto
```

Y las URLs de la GitHub App deben coincidir:

```text
Callback URL:
https://hito.autos/api/github/callback

Setup URL:
https://hito.autos/github/connect

Webhook URL, solo cuando se active en una fase posterior:
https://hito.autos/api/github/webhook
```

No pongas `VITE_GITHUB_BFF_URL=https://hito.autos` sin `/api`: el botón de conectar
abriría la SPA en `/github/connect` como si fuera el BFF y el OAuth no arrancaría en el servidor.

### BFF en otro host

```env
VITE_GITHUB_BFF_URL=https://api.tu-dominio.com
```

La GitHub App de ese entorno debe usar:

```text
Callback URL:
https://api.tu-dominio.com/github/callback
```

No uses `http://localhost` como URL de producción. Para desarrollo, utiliza un túnel HTTPS como
Cloudflare Tunnel, ngrok o una URL HTTPS equivalente.

### Vite `.env`

En desarrollo crea un archivo `.env.local` en la raíz del proyecto:

```env
VITE_GITHUB_BFF_URL=/api
```

Después de modificarlo, reinicia `npm run dev`; Vite solo carga las variables de entorno al
iniciar el servidor. El archivo `.env.local` no debe contener private keys ni client secrets y
no debe subirse al repositorio.

La variable `VITE_` es pública por diseño: cualquier valor con ese prefijo termina en el bundle
del navegador. Por eso aquí solo debe ir una URL, nunca una credencial.

Nunca pongas la private key en variables `VITE_*`, en el frontend, en el workspace local, en el
repositorio ni en logs. Si el proveedor no acepta saltos de línea, usa un secreto multilinea o
base64 y decodifica exclusivamente en backend.

## 6. Instalar la App

1. En la App creada, selecciona **Install App**.
2. Elige tu cuenta personal u organización.
3. Selecciona **Only select repositories**.
4. Marca únicamente el repositorio de prueba.
5. Confirma la instalación.

El backend debe conservar el `installation_id` y verificarlo en cada llamada. No se debe confiar
únicamente en un `installation_id` recibido desde el navegador.

## 7. Webhooks

En v1 deben permanecer inactivos porque la sincronización será manual o programada mientras Hito
esté abierto. Si más adelante se activan:

```text
Webhook URL: https://api.tu-dominio.com/github/webhook
Webhook secret: secreto aleatorio guardado solo en backend
```

GitHub recomienda usar un webhook secret y validar su firma en el servidor. [Documentación oficial de webhooks](https://docs.github.com/en/apps/creating-github-apps/registering-github-app/using-webhooks-with-github-apps).

## 8. Flujo técnico esperado

```text
Frontend → backend: iniciar conexión
Backend → GitHub: autorización/instalación
GitHub → backend: callback con code/state
Backend: valida state, identidad e instalación
Backend: crea token temporal de instalación
Frontend ← backend: identidad, repositorios y Projects
Frontend → backend: sincronizar
Backend → GitHub: API con token temporal
Backend → frontend: resultado normalizado
```

El `state` debe ser de un solo uso y tener expiración corta. El frontend nunca recibe la private
key ni un client secret.

## 9. Checklist antes de producción

- [ ] App de producción separada de desarrollo.
- [ ] App de desarrollo limitada a `Only on this account`.
- [ ] Callback HTTPS configurado.
- [ ] Setup URL HTTPS configurada.
- [ ] Private key fuera del repositorio.
- [ ] Secretos solo en backend.
- [ ] Permisos mínimos revisados.
- [ ] Webhook desactivado en v1.
- [ ] Instalación limitada a repositorios seleccionados.
- [ ] Rate limits y reintentos implementados.
- [ ] Logs sin tokens ni cuerpos sensibles.
- [ ] Revocación y desconexión probadas.
- [ ] Política de privacidad y URL de soporte configuradas.
