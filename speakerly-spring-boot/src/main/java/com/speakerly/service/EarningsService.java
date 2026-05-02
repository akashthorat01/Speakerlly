package com.speakerly.service;

import com.speakerly.entity.*;
import com.speakerly.repository.EarningsRepository;
import com.speakerly.repository.PenaltyRepository;
import com.speakerly.repository.TrainerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class EarningsService {

    @Autowired
    private EarningsRepository earningsRepository;

    @Autowired
    private PenaltyRepository penaltyRepository;

    @Autowired
    private TrainerRepository trainerRepository;

    @Transactional
    public void calculateEarnings(Session session) {
        if (session.getStatus() == SessionStatus.COMPLETED) {
            BigDecimal rate = session.getCallType() == CallType.AUDIO ? new BigDecimal("60.0") : new BigDecimal("100.0");
            BigDecimal grossAmount = rate;
            BigDecimal commissionAmount = grossAmount.multiply(new BigDecimal("0.16"));
            BigDecimal netAmount = grossAmount.subtract(commissionAmount);

            Earnings earnings = new Earnings();
            earnings.setTrainer(session.getTrainer());
            earnings.setSession(session);
            earnings.setGrossAmount(grossAmount);
            earnings.setCommissionAmount(commissionAmount);
            earnings.setNetAmount(netAmount);
            earningsRepository.save(earnings);

            Trainer trainer = session.getTrainer();
            trainer.setTotalEarnings(trainer.getTotalEarnings().add(netAmount));
            trainerRepository.save(trainer);
        } else if (session.getStatus() == SessionStatus.MISSED) {
            Penalty penalty = new Penalty();
            penalty.setTrainer(session.getTrainer());
            penalty.setSession(session);
            penalty.setAmount(new BigDecimal("50.0"));
            penalty.setReason("Missed session");
            penaltyRepository.save(penalty);

            Trainer trainer = session.getTrainer();
            trainer.setTotalEarnings(trainer.getTotalEarnings().subtract(new BigDecimal("50.0")));
            trainerRepository.save(trainer);
        }
    }

    public List<Earnings> getTrainerEarnings(Long trainerId) {
        Trainer trainer = trainerRepository.findById(trainerId).orElseThrow();
        return earningsRepository.findByTrainer(trainer);
    }
}
