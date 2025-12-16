package com.greenmesh.api;

import java.time.Instant;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/status")
public class StatusController {

    @Value("${spring.application.name}")
    private String appName;

    @Value("${spring.profiles.active:}")
    private String activeProfile;

    @GetMapping
    public Map<String, Object> status() {
        return Map.of(
                "service", appName,
                "profile", activeProfile,
                "timestamp", Instant.now().toString(),
                "message", "GreenMesh backend ready (rules first, DM8-ready)");
    }
}
