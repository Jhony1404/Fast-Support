package com.empresa.soporte.repository;

import com.empresa.soporte.model.Solicitud;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Repository
public class RepositorioSolicitud {
    
    // Almacenamiento en memoria usando HashMap tal como en la rúbrica
    private final HashMap<Integer, Solicitud> solicitudes = new HashMap<>();
    private int contadorId = 1;
    
    public Solicitud guardar(Solicitud solicitud) {
        solicitud.setId(contadorId++);
        solicitudes.put(solicitud.getId(), solicitud);
        return solicitud;
    }
    
    public Optional<Solicitud> obtenerPorId(int id) {
        return Optional.ofNullable(solicitudes.get(id));
    }
    
    public List<Solicitud> obtenerTodas() {
        return new ArrayList<>(solicitudes.values());
    }
    
    public Solicitud actualizar(Solicitud solicitud) {
        solicitudes.put(solicitud.getId(), solicitud);
        return solicitud;
    }
    
    public boolean eliminar(int id) {
        if (solicitudes.containsKey(id)) {
            solicitudes.remove(id);
            return true;
        }
        return false;
    }
}
