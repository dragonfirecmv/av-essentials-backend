import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { IProject } from './interfaces/projects.interface'
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectEntity } from './projects.entity';
import { Repository, TreeRepository } from 'typeorm';
import { slugifyWithCode } from '../../libs/slugifier/slugifier';
import { CreateProjectDTO } from './dto/create-project.dto';
import { safe } from '../../libs/helper/safeObjects';
import { UserEntity } from '../users/users.entity';
import { CategoryEntity } from '../categories/categories.entity';


function IProjectToDbProjectModel(
  IProjectObject: Partial<IProject>, 
  isFirstTime: boolean = false,
  verificationMode: boolean = false): Partial<ProjectEntity> {

  const pr: Partial<IProject> = { ...IProjectObject }

  let verifyIsFinalized = safe(pr, (isFirstTime ? false : undefined)).validation.is_finalized.$
  let verifyPassed = safe(pr, (isFirstTime ? false : undefined)).validation.passed.$
  let verifyVerified = safe(pr, (isFirstTime ? false : undefined)).validation.verified.$

  // Only admin-guarded route will be able to alter this!
  if (!verificationMode && !isFirstTime) {
    verifyIsFinalized = undefined
    verifyPassed = undefined
    verifyVerified = undefined
  }

  let tmpDb = {
    
    is_finalized: verifyIsFinalized,
    passed: verifyPassed,
    verified: verifyVerified,

    creator: safe(pr, (isFirstTime ? {} : undefined)).creator.$,
    category: safe(pr, (isFirstTime ? {} : undefined)).category.$,
    media: safe(pr, (isFirstTime ? [] : undefined)).media.$,

    slug: safe(pr, (isFirstTime ? "" : undefined)).slug.$,
    title: safe(pr, (isFirstTime ? "" : undefined)).title.$,
    content: safe(pr, (isFirstTime ? "" : undefined)).content.$,
    location: safe(pr, (isFirstTime ? "" : undefined)).location.$,
    locale: safe(pr, (isFirstTime ? "" : undefined)).locale.$,

    funding_target: safe(pr, (isFirstTime ? -1 : undefined)).funding.target.$,
    funding_funded: safe(pr, (isFirstTime ? -1 : undefined)).funding.funded.$,
    funding_currency: safe(pr, (isFirstTime ? "" : undefined)).funding.currency.$,

    payment_bank_name: safe(pr, (isFirstTime ? "" : undefined)).payment.bank_name.$,
    payment_bank_code: safe(pr, (isFirstTime ? -1 : undefined)).payment.bank_code.$,
    payment_account_name: safe(pr, (isFirstTime ? "" : undefined)).payment.account_name.$,
    payment_account_no: safe(pr, (isFirstTime ? -1 : undefined)).payment.account_number.$,

    benefit: safe(pr, (isFirstTime ? [] : undefined)).benefit.$,
    sponsors: safe(pr, (isFirstTime ? [] : undefined)).sponsors.$,
    updates: safe(pr, (isFirstTime ? [] : undefined)).updates.$,
    faq: safe(pr, (isFirstTime ? [] : undefined)).faq.$
  }

  // Cleans any undefined property
  Object.keys(tmpDb).forEach(key => tmpDb[key] === undefined && delete tmpDb[key])
  
  return { ...tmpDb }

}

@Injectable()
export class ProjectsService {

  constructor(
    @InjectRepository(ProjectEntity)
      private readonly projectsRepository: Repository<ProjectEntity>,
    @InjectRepository(UserEntity)
      private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(CategoryEntity)
      private readonly projCategoryRepos: TreeRepository<CategoryEntity>
  ) { }

  /**
   * Show all Projects.
   */
  async showAll(): Promise<IProject[]> {
    const listProject = await this.projectsRepository.find({
      relations: ['creator', 'category']
    })

    return listProject.map((project: ProjectEntity): IProject => project.toResponseObject())
  }

  /**
   * Show all MY Projects.
   */
  async showAllMyProjects(user: UserEntity): Promise<IProject[]> {
    const listProject = await this.projectsRepository.find({ 
      where: { creator: user }, 
      relations: ['creator', 'category']
    })

    return listProject.map((project: ProjectEntity): IProject => project.toResponseObject())
  }


  async showProjectByCategoryId(categoryId: string): Promise<Partial<IProject[]>> {
    const listProject = await this.projectsRepository.find({ 
      where: { category: categoryId }, 
      relations: ['creator', 'category']
    })
    return listProject.map((project: ProjectEntity): IProject => project.toResponseObject())
  }


  /**
   * Find project by slug.
   * @param slug Project's slug
   */
  async findBySlug(slug: string): Promise<IProject> {
    const selectedProject = await this.projectsRepository.findOne({
      where: { slug },
      relations: ['creator']
    })

    if (!selectedProject) {
      throw new HttpException('Project not found.', HttpStatus.NOT_FOUND)
    }

    return selectedProject.toResponseObject()
  }

  /**
   * Create a new project.
   * @param data Project data object
   */
  async create(
    userId: string,
    data: Partial<CreateProjectDTO>
  ): Promise<IProject> {

    if (!data.category || !data.category.id) {
      throw new HttpException(
        'Please specify category for this project!',
        HttpStatus.BAD_REQUEST
      )
    }

    // First, let's get the project's slug from the title
    // using our special helper function.
    const slugTemp = slugifyWithCode(data.title)

    // Parse our retrieved JSON to our native DB Model.
    const parsedData: Partial<ProjectEntity> = IProjectToDbProjectModel({
      ...data,
      slug: slugTemp,
      validation: {
        is_finalized: false,
        passed: false,
        verified: false
      }
    }, true)

    /**
     * Peepeepoopoo BIG BRAIN TIME!
     * 
     * Since this route is guarded, we will use our logged in user route
     * for setting them as the creator of this project.
     */
    const user = await this.usersRepository.findOne({ where: { id: userId } })

    const category = await this.projCategoryRepos.findOne({ where: { id: data.category.id } })

    const tempProject: Partial<ProjectEntity> = {
      ...parsedData,
      ...{ 
        creator: user,
        category
      }
    }

    // Proceed to create the project with now attached user as the creator.
    const project = await this.projectsRepository.create(tempProject)

    this.projectsRepository.save(project)
    return project.toResponseObject()
  }

  /**
   * Update the selected by slug's data.
   * @param slug The slug of the data candidate
   * @param data The new data to be applied
   */
  async update(
    slug: string, 
    userId: string,
    data: Partial<IProject>
  ): Promise<Partial<IProject>> {

    return this.onlyUpdate(
      slug,
      userId,
      data
    )
  }


  /**
   * Delete a project based on its slug.
   * @param slug target project's slug.
   */
  async destroy(slug: string) {
    const result = await this.projectsRepository.delete({ slug })

    if (result.affected < 1) return { deleted: false }
    return { slug, deleted: true }
  }

  async verifyProject(slug: string, userId, data: Partial<IProject>) {
    return await this.onlyUpdate(
      slug,
      userId,
      data,
      true
    )
  }





  /**
   * Ensure the ownership of selected project based on the user ID.
   * @param project the project to be checked
   * @param userId the claimer's user id.
   */
  private async ensureOwnership(project: ProjectEntity, userId: string) {
    if (project.creator.id !== userId) {
      throw new HttpException('Incorrect User', HttpStatus.UNAUTHORIZED);
    }
  }


  /**
   * Buffer function for everything update-related.
   * @param slug The slug of the data candidate
   * @param data The new data to be applied
   * @param userId 
   * @param verifyMode 
   */
  private async onlyUpdate(
    slug: string, 
    userId: string,
    data: Partial<IProject>,
    verifyMode: boolean = false
  ): Promise<Partial<IProject>> {

    // Parse our JSON data into our scheme compatible model.
    const parsedData = IProjectToDbProjectModel({ ...data }, false, verifyMode)

    // Check whether the project exists.
    let project = await this.projectsRepository.findOne({ 
      where: { slug },
      relations: [ 'creator' ]
    }) 

    if (!project) {
      throw new HttpException(
        'Project not found!',
        HttpStatus.NOT_FOUND
      )
    }

    await this.ensureOwnership(project, userId)

    // UPDATE!
    await this.projectsRepository.update({ slug }, parsedData)

    project = await this.projectsRepository.findOne({ where: { slug }, relations: [ 'creator' ] })
    return project.toResponseObject()
  }

}
