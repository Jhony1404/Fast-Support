package com.empresa.soporte.service;

import com.empresa.soporte.model.Cliente;
import com.empresa.soporte.repository.RepositorioCliente;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClienteService {

    private final RepositorioCliente repository;

    public ClienteService(RepositorioCliente repository) {
        this.repository = repository;
    }

    public Cliente crear(Cliente cliente) {
        return repository.guardar(cliente);
    }

    public List<Cliente> obtenerTodos() {
        return repository.obtenerTodos();
    }

    public Cliente obtenerPorId(int id) {
        return repository.obtenerPorId(id)
                .orElseThrow(() -> new IllegalArgumentException("No se encontró el cliente con ID: " + id));
    }

    public Cliente actualizar(int id, Cliente datos) {
        Cliente existente = obtenerPorId(id);
        existente.setNombre(datos.getNombre());
        existente.setEmail(datos.getEmail());
        existente.setTelefono(datos.getTelefono());
        existente.setEmpresa(datos.getEmpresa());
        return repository.actualizar(existente);
    }

    public void eliminar(int id) {
        boolean eliminado = repository.eliminar(id);
        if (!eliminado) {
            throw new IllegalArgumentException("No se pudo eliminar. No existe cliente con ID: " + id);
        }
    }
}
