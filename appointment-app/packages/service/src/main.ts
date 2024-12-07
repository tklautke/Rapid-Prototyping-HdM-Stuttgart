/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import {Logger} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {AppModule} from './app/app.module';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';

async function bootstrap() {
    // Create an instance of the Nest application using the main AppModule
    const app = await NestFactory.create(AppModule);

    // Global API prefix, which will be prepended to all routes in the application.
    const globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);

    // Port configuration: Use environment variable PORT or default to 3000
    const port = process.env.PORT || 3000;

    // Swagger configuration for API documentation
    const config = new DocumentBuilder()
        .setTitle('Appointment Application')
        .setDescription('API documentation for the Appointment Application, providing endpoints for managing appointments, users, and dealers.')
        .setVersion('1.0')
        .addServer(`http://localhost:${port}`) // Base server URL for Swagger
        .build();

    // Enable Cross-Origin Resource Sharing (CORS) to allow requests from different origins
    app.enableCors();

    // Generate and set up Swagger API documentation
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(globalPrefix, app, document);

    // Start the application and listen on the configured port
    await app.listen(port);
    Logger.log(
        `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
        'Bootstrap'
    );
}

// Execute the bootstrap function to initialize the application
bootstrap();
