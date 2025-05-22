import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      // .setTitle('Technical Assessment API')
      .setVersion('1.0')
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    // await SwaggerModule.loadPluginMetadata(metadata); // <-- here
    SwaggerModule.setup('api', app, documentFactory);
  }
  await app.listen(3000);
}
bootstrap();
