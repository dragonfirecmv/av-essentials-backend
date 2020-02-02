import { Controller, Get, Post, Param, Body, Put, Delete } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDTO } from './dto/create-categories.dto';
import { CategoryEntity } from './categories.entity';

@Controller('api/categories')
export class CategoriesController {

  constructor (
    private readonly CategoriesService: CategoriesService
  ) {}

  @Get()
  showAllNestedCategories(): Promise<CategoryEntity[]> {
    return this.CategoriesService.findAllNested()
  }

  @Get('by-slug/:slug')
  findCategoryBySlug(
    @Param('slug') projCategorySlug: string
  ) {
    return this.CategoriesService.findBySlug(projCategorySlug)
  }


  @Get('by-id/:id')
  findCategoryById(
    @Param('id') projCategoryId: string
  ) {
    return this.CategoriesService.findById(projCategoryId)
  }


  @Get('by-id/:id/get-parent')
  findCategoryIdAncestor(
    @Param('id') projCategoryId: string
  ) {
    return this.CategoriesService.findIdsAncestor(projCategoryId)
  }


  @Get('by-id/:id/get-children')
  findCategoryIdDescendants(
    @Param('id') projCategoryId: string
  ) {
    return this.CategoriesService.findIdsDescendants(projCategoryId)
  }


  @Post()
  CreateCategory(
    @Body()
      payload: Partial<CreateCategoryDTO>
  ) {
    return this.CategoriesService.createProjCategory(payload)
  }


  // Updates our project
  @Put(':id')
  updateCategory(
    @Param('id') id: string,
    @Body() payload: Partial<CreateCategoryDTO>) {
    // console.log('hehehe', userId)
    return this.CategoriesService.update(id, payload)
  }



  // DELETE the project
  @Delete(':id')
  destroyCategory(
    @Param('id') 
      id: string
  ) {
    return this.CategoriesService.destroy(id)
  }

}
