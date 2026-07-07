package com.empresa.soporte.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class Tecnico {
    
    private int id;

    @NotBlank(message = "El nombre del técnico es obligatorio")
    private String nombre;

    @Email(message = "Formato de email inválido")
    private String email;

    @NotBlank(message = "La especialidad es obligatoria")
    private String especialidad;

    private boolean disponible;
    
    public Tecnico() {}

    public Tecnico(int id, String nombre, String email, String especialidad, boolean disponible) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.especialidad = especialidad;
        this.disponible = disponible;
    }

    // Getters y Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getEspecialidad() { return especialidad; }
    public void setEspecialidad(String especialidad) { this.especialidad = especialidad; }
    public boolean isDisponible() { return disponible; }
    public void setDisponible(boolean disponible) { this.disponible = disponible; }
}
