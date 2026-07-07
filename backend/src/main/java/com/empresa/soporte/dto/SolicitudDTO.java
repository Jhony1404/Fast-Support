package com.empresa.soporte.dto;

import com.empresa.soporte.model.Cliente;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * DTO para la creación y actualización de solicitudes.
 * Aplica validación de datos de entrada.
 */
public class SolicitudDTO {

    @Valid
    @NotNull(message = "Los datos del cliente son obligatorios")
    private Cliente cliente;

    @NotBlank(message = "La descripción del problema es obligatoria")
    private String descripcion;

    @NotBlank(message = "La prioridad es obligatoria (ej: ALTA, MEDIA, BAJA)")
    private String prioridad;

    // Getters y Setters
    public Cliente getCliente() { return cliente; }
    public void setCliente(Cliente cliente) { this.cliente = cliente; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public String getPrioridad() { return prioridad; }
    public void setPrioridad(String prioridad) { this.prioridad = prioridad; }
}
