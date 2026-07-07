package com.empresa.soporte.model;

public enum EstadoSolicitud {
    ABIERTA("Abierta - Esperando asignación de técnico"),
    EN_PROGRESO("En Progreso - Técnico trabajando en la solicitud"),
    RESUELTA("Resuelta - Problema solucionado por el técnico"),
    CERRADA("Cerrada - Solicitud archivada");
    
    private final String descripcion;
    
    EstadoSolicitud(String descripcion) {
        this.descripcion = descripcion;
    }
    
    public String getDescripcion() { return descripcion; }
    public boolean esTerminal() { return this == CERRADA; }
    public boolean esActivo() { return this != CERRADA; }
}
