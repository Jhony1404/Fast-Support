# Fast-Support
## 1. Ejecutar el backend

**Requisito:** Java 17 o superior instalado.

### Opción A — Desde tu IDE (recomendado)
1. Abre la carpeta `backend/` en VS Code, IntelliJ, o Eclipse como un proyecto Maven.
2. Espera a que el IDE descargue las dependencias (la primera vez tarda un poco).
3. Abre `src/main/java/com/empresa/soporte/SoporteApplication.java`.
4. Haz clic en "Run" sobre el método `main`.

### Opción B — Desde terminal
```bash
cd backend
./mvnw spring-boot:run
```
(En Windows usa `mvnw.cmd spring-boot:run`. Si no tienes el wrapper de Maven, instala Maven y usa `mvn spring-boot:run`.)

Sabrás que arrancó bien cuando veas en la consola:
```
🚀 API DE SOPORTE TÉCNICO INICIADA CON ÉXITO 🚀
Backend disponible en: http://localhost:8080/api
```

## 2. Ejecutar el frontend

**Requisito:** Node.js instalado.

```bash
cd frontend
npm install
npm run dev
```

Abre **http://localhost:5173** en tu navegador. Con el backend corriendo en el puerto 8080 al mismo tiempo, verás la interfaz completa: Solicitudes, Clientes y Técnicos, con crear/editar/eliminar, asignación de técnico y cambio de estado.