import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './categories.entity';
import { TreeRepository } from 'typeorm';
import { CreateCategoryDTO } from './dto/create-categories.dto';
import { ICategory } from './interfaces/categories.interface';

@Injectable()
export class CategoriesService {

  constructor(
    @InjectRepository(CategoryEntity)
    private readonly projCategoryTreeRepos: TreeRepository<CategoryEntity>
  ) {}


  async findAllNested(): Promise<CategoryEntity[]> {
    console.log('loading categories...')
    const categories = await this.projCategoryTreeRepos.findTrees();

    console.log('loaded categories: ', categories)
    return categories
  }


  async findById(id: string): Promise<CategoryEntity> {
    return await this.projCategoryTreeRepos.findOneOrFail({ where: { id } })
  }

  async findBySlug(slug: string): Promise<CategoryEntity> {
    const letMeGo = await this.projCategoryTreeRepos.findOneOrFail({ where: { slug } })
    return await this.projCategoryTreeRepos.findDescendantsTree(letMeGo)
  }


  async findIdsAncestor(id: string): Promise<CategoryEntity> {
    const findProjCat =  await this.projCategoryTreeRepos.findOneOrFail({ where: { id } })
    const projCatAncestor =  await this.projCategoryTreeRepos.findAncestorsTree(findProjCat)

    if (!projCatAncestor.parent) {
      throw new HttpException(
        'This item does not have anymore parent! (Root item identified)',
        HttpStatus.BAD_REQUEST
      )
    }
    
    return projCatAncestor.parent
  }


  async findIdsDescendants(id: string): Promise<CategoryEntity[]> {
    const findProjCat =  await this.projCategoryTreeRepos.findOneOrFail({ where: { id } })
    const projCatDescendants =  await this.projCategoryTreeRepos.findDescendantsTree(findProjCat)

    if (!projCatDescendants.children) {
      throw new HttpException(
        'This item does not have anymore parent! (Root item identified)',
        HttpStatus.BAD_REQUEST
      )
    }

    // Object.keys(projCatDescendants.children).forEach(key => delete projCatDescendants['children'])
    projCatDescendants.children.forEach(item => {
      delete item['children']
      return item
    })


    return projCatDescendants.children
  }


  async createProjCategory(payload: Partial<CreateCategoryDTO>): Promise<ICategory> {
    console.log('creating project', payload)

    const isSlugExists = await this.projCategoryTreeRepos.findOne({ where: { slug: payload.slug } })
    console.log({ isSlugExists })
    if (isSlugExists)
      throw new HttpException(
        'Category with that slug exists!',
        HttpStatus.BAD_REQUEST
      )

    // Does the payload contains parentId?
    if ( payload.parentId ) {

      let temPayload: any = { ...payload }
      console.log('parentId is present.')
      const isParentExist = await this.projCategoryTreeRepos.findOneOrFail({ where: { id: payload.parentId } })

      console.log('parent exists.', isParentExist)

      temPayload = { ...temPayload, parent: isParentExist }
      delete temPayload['parentId']

      console.log('sanitized DATA!!!', temPayload)

      return await this.projCategoryTreeRepos.save(temPayload)
    }
    else {
      const creating = await this.projCategoryTreeRepos.create(payload)
      this.projCategoryTreeRepos.save(creating)

      console.log('project created', payload, creating)
      
      return creating.toResponseObject()
    }
    
  }


  async update(
    id: string,
    payload: Partial<CreateCategoryDTO>
  ) {

    await this.checkIfItExist(id)

    const isSlugExists = await this.projCategoryTreeRepos.find({ where: { slug: payload.slug } })
    if (isSlugExists)
      throw new HttpException(
        'Category with that slug exists!',
        HttpStatus.BAD_REQUEST
      )


    let tempPayload = {...payload}

    // if (tempPayload.parentId) {
    //   await this.projCategoryTreeRepos.query(`
    //     DELETE FROM public.categories_closure
    //       WHERE id_descendant = '${id}'
    //       OR id_ancestor = '${id}'

    //     .
    //   `)
    // }

    delete tempPayload['parentId']

    await this.projCategoryTreeRepos.update({ id }, payload)

    const isCategoryExists = await this.findById(id)
    return isCategoryExists.toResponseObject()
  }


  async destroy(id: string) {
    await this.checkIfItExist(id)

    // Yes... I just did an SQL query.
    // Now shut up.
    //
    // SELECT c.* 
    //     FROM public.categories c
    //       JOIN public.categories_closure t
    //         ON c.id = t.id_descendant
    //       WHERE t.id_ancestor = '${id}';

    const successRate = await this.projCategoryTreeRepos.query(`

      DELETE FROM public.categories_closure
        WHERE id_descendant = '${id}'
        OR id_ancestor = '${id}';

      DELETE FROM public.categories
        WHERE id = '${id}'
        OR id IN (
          SELECT id_descendant 
            FROM public.categories_closure
            WHERE id_ancestor = '${id}'
        );

      SELECT c.* 
        FROM public.categories c
          JOIN public.categories_closure t 
            ON c.id = t.id_descendant 
          WHERE t.id_ancestor = '${id}';
    `)
    
    if (!successRate) {
      return { id, deleted: true }
    }

  }


  async checkIfItExist(id: string): Promise<{exists: boolean, payload: CategoryEntity}> {

    let isCategoryExists = await this.findById(id)

    if (!isCategoryExists) {
      throw new HttpException(
        'Category not found!',
        HttpStatus.NOT_FOUND
      )
    }

    return {exists: true, payload: isCategoryExists}
  }
}
