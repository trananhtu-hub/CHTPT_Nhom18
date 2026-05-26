package microservices.book.quest.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Enables Cross-Origin Resource Sharing (CORS) globally for quest-service endpoints.
 */
@Configuration
@EnableWebMvc
@SuppressWarnings("null")
public class WebConfiguration implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(final CorsRegistry registry) {
        registry.addMapping("/**");
    }
}
