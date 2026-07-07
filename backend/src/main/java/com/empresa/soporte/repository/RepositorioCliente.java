package com.empresa.soporte.repository;

import com.empresa.soporte.model.Cliente;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Repository
public class RepositorioCliente {

    private final HashMap<Integer, Cliente> clientes = new HashMap<>();
    private int contadorId = 1;

    public Cliente guardar(Cliente cliente) {
        cliente.setId(contadorId++);
        clientes.put(cliente.getId(), cliente);
        return cliente;
    }

    public Optional<Cliente> obtenerPorId(int id) {
        return Optional.ofNullable(clientes.get(id));
    }

    public List<Cliente> obtenerTodos() {
        return new ArrayList<>(clientes.values());
    }

    public Cliente actualizar(Cliente cliente) {
        clientes.put(cliente.getId(), cliente);
        return cliente;
    }

    public boolean eliminar(int id) {
        if (clientes.containsKey(id)) {
            clientes.remove(id);
            return true;
        }
        return false;
    }
}
