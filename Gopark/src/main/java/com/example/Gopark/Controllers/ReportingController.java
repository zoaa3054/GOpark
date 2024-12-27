package com.example.Gopark.Controllers;

import com.example.Gopark.Services.ReportingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ReportingController {

    @Autowired
    private ReportingService service;

    @GetMapping("/manager/report/{managerId}")
    public void exportManagerReport(@PathVariable Long managerId )
    {
         service.getManagerReports(managerId);
    }
    @GetMapping("/admin/report")
    public void exportAdminReport()
    {
        service.getAdminReport();
    }


}
