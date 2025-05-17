package com.aicruter.ai.domain.repository;

import com.aicruter.ai.domain.entity.AIModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AIModelRepository extends JpaRepository<AIModel, String> {
    List<AIModel> findByTypeAndActiveTrue(String type);
    Optional<AIModel> findByNameAndVersion(String name, String version);
}
