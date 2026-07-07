package com.empresa.soporte.controller;

import com.empresa.soporte.dto.SolicitudDTO;
import com.empresa.soporte.model.EstadoSolicitud;
import com.empresa.soporte.model.Solicitud;
import com.empresa.soporte.service.SolicitudService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/solicitudes")
public class SolicitudController {

    private final SolicitudService service;

    public SolicitudController(SolicitudService service) {
        this.service = service;
    }

    // 1. CREATE (POST)
    @PostMapping
    public ResponseEntity<Solicitud> crear(@Valid @RequestBody SolicitudDTO solicitudDTO) {
        Solicitud nueva = service.crearSolicitud(solicitudDTO);
        return new ResponseEntity<>(nueva, HttpStatus.CREATED);
    }

    // 2. READ ALL (GET)
    @GetMapping
    public ResponseEntity<List<Solicitud>> listarTodas() {
        return ResponseEntity.ok(service.obtenerTodas());
    }

    // 3. READ BY ID (GET)
    @GetMapping("/{id}")
    public ResponseEntity<Solicitud> obtenerPorId(@PathVariable int id) {
        return ResponseEntity.ok(service.obtenerPorId(id));
    }

    // 4. UPDATE (PUT)
    @PutMapping("/{id}")
    public ResponseEntity<Solicitud> actualizar(@PathVariable int id, @Valid @RequestBody SolicitudDTO solicitudDTO) {
        Solicitud actualizada = service.actualizarSolicitud(id, solicitudDTO);
        return ResponseEntity.ok(actualizada);
    }

    // 5. DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable int id) {
        service.eliminarSolicitud(id);
        return ResponseEntity.noContent().build();
    }

    // 6. ASIGNAR TÉCNICO (PUT) -> pasa la solicitud a EN_PROGRESO
    @PutMapping("/{id}/tecnico/{idTecnico}")
    public ResponseEntity<Solicitud> asignarTecnico(@PathVariable int id, @PathVariable int idTecnico) {
        return ResponseEntity.ok(service.asignarTecnico(id, idTecnico));
    }

    // 7. CAMBIAR ESTADO (PUT) -> ej: /api/solicitudes/3/estado?estado=RESUELTA
    @PutMapping("/{id}/estado")
    public ResponseEntity<Solicitud> cambiarEstado(@PathVariable int id, @RequestParam EstadoSolicitud estado) {
        return ResponseEntity.ok(service.cambiarEstado(id, estado));
    }
}
