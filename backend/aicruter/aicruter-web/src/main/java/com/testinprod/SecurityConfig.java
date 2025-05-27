package com.testinprod;

import com.testinprod.filter.JwtAuthFilter;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

        private final JwtAuthFilter jwtAuthFilter;
        private final AuthenticationProvider authenticationProvider;

        public SecurityConfig(JwtAuthFilter jwtAuthFilter, AuthenticationProvider authenticationProvider) {
                this.jwtAuthFilter = jwtAuthFilter;
                this.authenticationProvider = authenticationProvider;
        }

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                .csrf(AbstractHttpConfigurer::disable)
                                .cors(cors -> cors
                                                .configurationSource(request -> {
                                                        var corsConfig = new org.springframework.web.cors.CorsConfiguration();
                                                        corsConfig.setAllowedOrigins(List.of("http://localhost:3000", "https://aicruter-roan.vercel.app"));
                                                        corsConfig.setAllowedMethods(
                                                                        List.of("GET", "POST", "PUT", "DELETE",
                                                                                        "PATCH"));
                                                        corsConfig.setAllowedHeaders(
                                                                        List.of("Authorization", "Content-Type", "ngrok-skip-browser-warning"));
                                                        corsConfig.setAllowCredentials(true);
                                                        return corsConfig;
                                                }))
                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers("/api/employer/register", "/api/applicant/register",
                                                                "/api/user-account/**", "/api/company/dropdown")
                                                .permitAll()
                                                .anyRequest().authenticated())
                                .sessionManagement(sess -> sess
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .authenticationProvider(authenticationProvider)
                                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }
}
