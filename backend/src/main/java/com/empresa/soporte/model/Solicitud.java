package com.empresa.soporte.model;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class Solicitud {
    
    private int id;
    private Cliente cliente;
    private Tecnico tecnico;
    private String descripcion;
    private EstadoSolicitud estado;
    private String prioridad;
    private String fechaCreacion;
    private String fechaResolucion;
    private String observaciones;
    
    private static final DateTimeFormatter FORMATO_FECHA = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    
    public Solicitud() {
        this.fechaCreacion = LocalDateTime.now().format(FORMATO_FECHA);
        this.estado = EstadoSolicitud.ABIERTA;
        this.observaciones = "";
    }
    
    public Solicitud(Cliente cliente, String descripcion, String prioridad) {
        this();
        this.cliente = cliente;
        this.descripcion = descripcion;
        this.prioridad = prioridad;
    }
    
    // Getters y Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public Cliente getCliente() { return cliente; }
    public void setCliente(Cliente cliente) { this.cliente = cliente; }
    public Tecnico getTecnico() { return tecnico; }
    public void setTecnico(Tecnico tecnico) { this.tecnico = tecnico; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public EstadoSolicitud getEstado() { return estado; }
    public void setEstado(EstadoSolicitud estado) { this.estado = estado; }
    public String getPrioridad() { return prioridad; }
    public void setPrioridad(String prioridad) { this.prioridad = prioridad; }
    public String getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(String fechaCreacion) { this.fechaCreacion = fechaCreacion; }
    public String getFechaResolucion() { return fechaResolucion; }
    public void setFechaResolucion(String fechaResolucion) { this.fechaResolucion = fechaResolucion; }
    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }

    // Métodos de negocio integrados
    public void asignarTecnico(Tecnico tecnico) {
        this.tecnico = tecnico;
        this.estado = EstadoSolicitud.EN_PROGRESO;
    }

    public void marcarComoResuelta() {
        this.estado = EstadoSolicitud.RESUELTA;
        this.fechaResolucion = LocalDateTime.now().format(FORMATO_FECHA);
    }
}
