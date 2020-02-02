import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Param,
  Put,
  Logger,
  UsePipes,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { CreateProjectDTO } from './dto/create-project.dto'
import { ProjectsService } from './projects.service'
import { IProject } from './interfaces/projects.interface'
import { ValidationPipe } from '../../shared/validation.pipe';
import { User, SomeDecor } from '../users/decorator/users.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from '../users/users.entity';


@Controller('api/projects')
export class ProjectsController {

  private logger = new Logger('ProjectsController');

  constructor(
    private readonly projectsService: ProjectsService
  ) { }

  private logData(options: any) {
    options.user && this.logger.log(`USER ${JSON.stringify(options.user)}`)
    options.body && this.logger.log(`BODY ${JSON.stringify(options.body)}`)
    options.id && this.logger.log(`PROJECT ${JSON.stringify(options.id)}`)
  }

  /**
   * Show all registered projects
   */
  @Get()
  showAllProjects(): Promise<IProject[]> {
    return this.projectsService.showAll()
  }


  @Get('by-category/:id')
  showProjectByCategory(
    @Param('id')
    categoryId: string
  ) {
    return this.projectsService.showProjectByCategoryId(categoryId)
  }


  @Get('by-me')
  @UseGuards(AuthGuard('jwt'))
  showProjectsByQuery(
    @User()
      user: UserEntity
  ): Promise<IProject[]> {
    return this.projectsService.showAllMyProjects(user)
  }


  @Get(':slug')
  findBySlug(@Param('slug') slug: string): Promise<IProject> {
    this.logData({ slug });
    return this.projectsService.findBySlug(slug)
  }


  // Create new project.
  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  createProject(
    @User('id') 
      userId: string,
    @Body() 
      projectData: Partial<CreateProjectDTO>
  ): Promise<IProject> {
    
    // this.logData({ user: userId, body: projectData });
    return this.projectsService.create(userId, projectData)
  }


  // Updates our project
  @Put(':slug')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  updateProject(
    @Param('slug') slug: string,
    @User('id') userId: string,
    @Body() newProjectData: Partial<IProject>) {
    // console.log('hehehe', userId)
    return this.projectsService.update(slug, userId, newProjectData)
  }



  // // Verifies our project our project
  // @Put(':slug/verify')
  // @UseGuards(AuthGuard('jwt'))
  // @UsePipes(new ValidationPipe())
  // verifyProject(
  //   @Param('slug') slug: string,
  //   @User('id') userId: string,
  //   @Body() newProjectData: Partial<IProject>) {
  //   // console.log('hehehe', userId)
  //   return this.projectsService.update(slug, userId, newProjectData)
  // }



  @Delete(':slug')
  @UseGuards(AuthGuard('jwt'))
  deleteProject(
    @Param('slug') slug: string,
    @User() user: object): object {
    return this.projectsService.destroy(slug)
  }
}
