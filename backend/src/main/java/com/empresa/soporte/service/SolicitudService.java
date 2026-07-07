package com.empresa.soporte.service;

import com.empresa.soporte.dto.SolicitudDTO;
import com.empresa.soporte.model.EstadoSolicitud;
import com.empresa.soporte.model.Solicitud;
import com.empresa.soporte.model.Tecnico;
import com.empresa.soporte.repository.RepositorioSolicitud;
import com.empresa.soporte.repository.RepositorioTecnico;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SolicitudService {

    private final RepositorioSolicitud repository;
    private final RepositorioTecnico repositorioTecnico;

    public SolicitudService(RepositorioSolicitud repository, RepositorioTecnico repositorioTecnico) {
        this.repository = repository;
        this.repositorioTecnico = repositorioTecnico;
    }

    public Solicitud crearSolicitud(SolicitudDTO dto) {
        Solicitud nueva = new Solicitud(dto.getCliente(), dto.getDescripcion(), dto.getPrioridad());
        // Simulando que el cliente tiene un ID autogenerado
        if (nueva.getCliente().getId() == 0) {
            nueva.getCliente().setId((int) (Math.random() * 1000));
        }
        return repository.guardar(nueva);
    }

    public List<Solicitud> obtenerTodas() {
        return repository.obtenerTodas();
    }

    public Solicitud obtenerPorId(int id) {
        return repository.obtenerPorId(id)
                .orElseThrow(() -> new IllegalArgumentException("No se encontró la solicitud con ID: " + id));
    }

    public Solicitud actualizarSolicitud(int id, SolicitudDTO dto) {
        Solicitud existente = obtenerPorId(id);
        existente.setCliente(dto.getCliente());
        existente.setDescripcion(dto.getDescripcion());
        existente.setPrioridad(dto.getPrioridad());
        return repository.actualizar(existente);
    }

    public void eliminarSolicitud(int id) {
        boolean eliminado = repository.eliminar(id);
        if (!eliminado) {
            throw new IllegalArgumentException("No se pudo eliminar. No existe solicitud con ID: " + id);
        }
    }

    // Asigna un técnico existente a una solicitud y la pasa a EN_PROGRESO
    public Solicitud asignarTecnico(int idSolicitud, int idTecnico) {
        Solicitud solicitud = obtenerPorId(idSolicitud);
        Tecnico tecnico = repositorioTecnico.obtenerPorId(idTecnico)
                .orElseThrow(() -> new IllegalArgumentException("No se encontró el técnico con ID: " + idTecnico));
        solicitud.asignarTecnico(tecnico);
        return repository.actualizar(solicitud);
    }

    // Cambia el estado de una solicitud (ej. marcarla como RESUELTA o CERRADA)
    public Solicitud cambiarEstado(int id, EstadoSolicitud nuevoEstado) {
        Solicitud solicitud = obtenerPorId(id);
        if (nuevoEstado == EstadoSolicitud.RESUELTA) {
            solicitud.marcarComoResuelta();
        } else {
            solicitud.setEstado(nuevoEstado);
        }
        return repository.actualizar(solicitud);
    }
}
