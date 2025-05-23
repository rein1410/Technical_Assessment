import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Technical Assessment API')
      .setVersion('1.0')
      .build();
    app.enableCors({
     origin: ["http://localhost:4173", "http://localhost:5173", "http://localhost:3001", "http://frontend.docker.localhost"] 
    });

    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);
  }
  await app.listen(3000);
}
bootstrap();
