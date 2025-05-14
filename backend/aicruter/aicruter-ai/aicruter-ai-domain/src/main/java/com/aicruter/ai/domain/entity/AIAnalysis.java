package com.aicruter.ai.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "ai_analyses")
public class AIAnalysis {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @ManyToOne
    @JoinColumn(name = "model_id")
    private AIModel model;
    
    private String applicantId;
    private String jobId;
    private String analysisType;  // RESUME_PARSE, CANDIDATE_MATCH, etc.
    
    @ElementCollection
    @CollectionTable(name = "ai_analysis_results", 
                     joinColumns = @JoinColumn(name = "analysis_id"))
    @MapKeyColumn(name = "key")
    @Column(name = "value", length = 4000)
    private Map<String, String> results = new HashMap<>();
    
    private LocalDateTime createdAt;
    
    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }
}
