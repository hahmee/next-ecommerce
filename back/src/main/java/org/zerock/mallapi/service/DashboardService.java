package org.zerock.mallapi.service;

import org.springframework.transaction.annotation.Transactional;
import org.zerock.mallapi.dto.*;

@Transactional
public interface DashboardService {

  ChartResponseDTO getSalesList(ChartRequestDTO chartRequestDTO);


}
