package com.empresa.soporte.service;

import com.empresa.soporte.model.Tecnico;
import com.empresa.soporte.repository.RepositorioTecnico;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TecnicoService {

    private final RepositorioTecnico repository;

    public TecnicoService(RepositorioTecnico repository) {
        this.repository = repository;
    }

    public Tecnico crear(Tecnico tecnico) {
        return repository.guardar(tecnico);
    }

    public List<Tecnico> obtenerTodos() {
        return repository.obtenerTodos();
    }

    public Tecnico obtenerPorId(int id) {
        return repository.obtenerPorId(id)
                .orElseThrow(() -> new IllegalArgumentException("No se encontró el técnico con ID: " + id));
    }

    public Tecnico actualizar(int id, Tecnico datos) {
        Tecnico existente = obtenerPorId(id);
        existente.setNombre(datos.getNombre());
        existente.setEmail(datos.getEmail());
        existente.setEspecialidad(datos.getEspecialidad());
        existente.setDisponible(datos.isDisponible());
        return repository.actualizar(existente);
    }

    public void eliminar(int id) {
        boolean eliminado = repository.eliminar(id);
        if (!eliminado) {
            throw new IllegalArgumentException("No se pudo eliminar. No existe técnico con ID: " + id);
        }
    }
}
