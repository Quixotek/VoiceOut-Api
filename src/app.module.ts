import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MONGO_DB_NAME, MONGO_URL } from './config';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ReportModule } from './report/report.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    MongooseModule.forRoot(MONGO_URL, {
      dbName: MONGO_DB_NAME,
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: async () => ({
        autoSchemaFile: true,
        playground: false,
        introspection: true,
        plugins: [ApolloServerPluginLandingPageLocalDefault()],
      }),
    }),
    ReportModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
