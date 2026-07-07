package com.empresa.soporte;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SoporteApplication {

    public static void main(String[] args) {
        SpringApplication.run(SoporteApplication.class, args);
        System.out.println("=======================================================");
        System.out.println("🚀 API DE SOPORTE TÉCNICO INICIADA CON ÉXITO 🚀");
        System.out.println("Backend disponible en: http://localhost:8080/api");
        System.out.println("=======================================================");
    }
}
