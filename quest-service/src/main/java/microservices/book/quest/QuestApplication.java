package microservices.book.quest;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

@EnableEurekaClient
@SpringBootApplication
public class QuestApplication {

    public static void main(String[] args) {
        SpringApplication.run(QuestApplication.class, args);
    }
}
