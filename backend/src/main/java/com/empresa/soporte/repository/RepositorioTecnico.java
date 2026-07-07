package com.empresa.soporte.repository;

import com.empresa.soporte.model.Tecnico;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Repository
public class RepositorioTecnico {

    private final HashMap<Integer, Tecnico> tecnicos = new HashMap<>();
    private int contadorId = 1;

    public Tecnico guardar(Tecnico tecnico) {
        tecnico.setId(contadorId++);
        tecnicos.put(tecnico.getId(), tecnico);
        return tecnico;
    }

    public Optional<Tecnico> obtenerPorId(int id) {
        return Optional.ofNullable(tecnicos.get(id));
    }

    public List<Tecnico> obtenerTodos() {
        return new ArrayList<>(tecnicos.values());
    }

    public Tecnico actualizar(Tecnico tecnico) {
        tecnicos.put(tecnico.getId(), tecnico);
        return tecnico;
    }

    public boolean eliminar(int id) {
        if (tecnicos.containsKey(id)) {
            tecnicos.remove(id);
            return true;
        }
        return false;
    }
}
