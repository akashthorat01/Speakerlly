package com.speakerly.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.speakerly.entity.Payment;
import com.speakerly.entity.PaymentStatus;
import com.speakerly.entity.Plan;
import com.speakerly.entity.PlanType;
import com.speakerly.entity.Subscription;
import com.speakerly.entity.User;
import com.speakerly.repository.PaymentRepository;
import com.speakerly.repository.PlanRepository;
import com.speakerly.repository.SubscriptionRepository;
import com.speakerly.repository.UserRepository;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PaymentService {

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private PlanRepository planRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    public Map<String, Object> createOrder(Long userId, String planTypeStr) throws RazorpayException {
        User user = userRepository.findById(userId).orElseThrow();
        PlanType planType = PlanType.valueOf(planTypeStr.toUpperCase());
        Plan plan = planRepository.findByPlanName(planType).orElseThrow();

        BigDecimal amount = plan.getPrice();

        RazorpayClient client = new RazorpayClient(keyId, keySecret);
        JSONObject options = new JSONObject();
        options.put("amount", amount.multiply(new BigDecimal("100")).intValue());
        options.put("currency", "INR");
        options.put("receipt", "speakerly_" + userId + "_" + System.currentTimeMillis());

        Order order = client.orders.create(options);

        Payment payment = new Payment();
        payment.setUser(user);
        payment.setPlan(plan);
        payment.setAmount(amount);
        payment.setRazorpayOrderId(order.get("id"));
        payment.setStatus(PaymentStatus.PENDING);
        paymentRepository.save(payment);

        Map<String, Object> response = new HashMap<>();
        response.put("orderId", order.get("id"));
        response.put("amount", options.get("amount"));
        response.put("currency", "INR");
        response.put("keyId", keyId);
        return response;
    }

    @Transactional
    public Map<String, Object> verifyPayment(Long userId, String razorpayOrderId, String razorpayPaymentId, String razorpaySignature, String planTypeStr) {
        Map<String, Object> response = new HashMap<>();

        try {
            String payload = razorpayOrderId + "|" + razorpayPaymentId;
            Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec secret_key = new SecretKeySpec(keySecret.getBytes("UTF-8"), "HmacSHA256");
            sha256_HMAC.init(secret_key);

            byte[] hash = sha256_HMAC.doFinal(payload.getBytes());
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }

            String expectedSignature = hexString.toString();

            if (expectedSignature.equals(razorpaySignature)) {
                Payment payment = paymentRepository.findByRazorpayOrderId(razorpayOrderId).orElseThrow();
                payment.setRazorpayPaymentId(razorpayPaymentId);
                payment.setRazorpaySignature(razorpaySignature);
                payment.setStatus(PaymentStatus.SUCCESS);
                paymentRepository.save(payment);

                // Activate Subscription
                User user = userRepository.findById(userId).orElseThrow();
                PlanType planType = PlanType.valueOf(planTypeStr.toUpperCase());
                Plan plan = planRepository.findByPlanName(planType).orElseThrow();

                user.setPlanType(planType);
                user.setPlanExpiry(LocalDate.now().plusDays(plan.getDurationDays()));
                userRepository.save(user);

                Subscription sub = new Subscription();
                sub.setUser(user);
                sub.setPlan(plan);
                sub.setStartDate(LocalDate.now());
                sub.setEndDate(LocalDate.now().plusDays(plan.getDurationDays()));
                sub.setIsActive(true);
                subscriptionRepository.save(sub);

                response.put("success", true);
                response.put("planActivated", true);
            } else {
                response.put("success", false);
                response.put("message", "Invalid signature");
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
        }

        return response;
    }

    public List<Payment> getPaymentHistory(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return paymentRepository.findByUser(user);
    }
}
