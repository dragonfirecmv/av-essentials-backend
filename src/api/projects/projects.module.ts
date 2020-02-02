import { Module } from '@nestjs/common'
import { ProjectsController } from './projects.controller'
import { ProjectsService } from './projects.service'
import { ProjectEntity } from './projects.entity'
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../users/users.entity';
import { CategoryEntity } from '../categories/categories.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProjectEntity, 
      CategoryEntity,
      UserEntity
    ])
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService]
})
export class ProjectsModule {}