package org.zerock.mallapi.service;

import com.google.analytics.data.v1beta.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@Log4j2
@RequiredArgsConstructor
@Transactional
public class AnalyticsServiceImpl implements AnalyticsService{

  private static final String GOOGLE_APPLICATION_CREDENTIALS = "/src/main/resources/credentials/credentials.json";

  @Autowired
  private Environment environment;

  @Override
  public void getAnalyticsData() {

    log.info("getAnalyticsData..");
    /**
     * TODO(developer): Replace this variable with your Google Analytics 4 property ID before
     * running the sample.
     */


    String propertyId = environment.getProperty("google.analytics.productId");

    log.info("propertyId....", propertyId);

    try {
      sampleRunReport(propertyId);
    } catch (Exception e) {
      log.error("Error while fetching analytics data: ", e);
    }
  }

  static void sampleRunReport(String propertyId) throws Exception {
    // Using a default constructor instructs the client to use the credentials
    // specified in GOOGLE_APPLICATION_CREDENTIALS environment variable.
    try (BetaAnalyticsDataClient analyticsData = BetaAnalyticsDataClient.create()) {

      RunReportRequest request = RunReportRequest.newBuilder()
                      .setProperty("properties/" + propertyId)
                      .addDimensions(Dimension.newBuilder().setName("city"))
                      .addMetrics(Metric.newBuilder().setName("activeUsers"))
                      .addDateRanges(DateRange.newBuilder().setStartDate("2020-03-31").setEndDate("today"))
                      .build();

      // Make the request.
      RunReportResponse response = analyticsData.runReport(request);

      System.out.println("Report result:");
      // Iterate through every row of the API response.
      for (Row row : response.getRowsList()) {

        System.out.printf(
                "%s, %s%n", row.getDimensionValues(0).getValue(), row.getMetricValues(0).getValue());
      }
    }
  }
}


