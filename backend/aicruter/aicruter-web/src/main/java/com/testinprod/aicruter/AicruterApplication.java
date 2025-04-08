package com.testinprod.aicruter;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@EntityScan(basePackages = "com.testinprod")
@ComponentScan(basePackages = "com.testinprod")
public class AicruterApplication {

	public static void main(String[] args) {
		SpringApplication.run(AicruterApplication.class, args);
	}

}
