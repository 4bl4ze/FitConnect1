package com.fitconnect.backend.repository;

import com.fitconnect.backend.model.PhysiqueAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PhysiqueAnalysisRepository extends JpaRepository<PhysiqueAnalysis, Long> {
    List<PhysiqueAnalysis> findByUserIdOrderByAnalyzedAtDesc(Long userId);
}