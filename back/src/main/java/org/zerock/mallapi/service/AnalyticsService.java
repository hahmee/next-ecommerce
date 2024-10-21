package org.zerock.mallapi.service;

import org.springframework.transaction.annotation.Transactional;
import org.zerock.mallapi.dto.*;

import java.util.List;

@Transactional
public interface AnalyticsService {

  void getAnalyticsData();

}
