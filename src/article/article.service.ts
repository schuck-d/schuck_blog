import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
// import { UpdateArticleDto } from './dto/update-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from '@/article/entities/article.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  async create(createArticleDto: CreateArticleDto) {
    const newArticle = this.articleRepository.create(createArticleDto);

    return await this.articleRepository.save(newArticle);
  }

  async findAll() {
    return {
      code: HttpStatus.OK,
      data: await this.articleRepository.find(),
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} article`;
  }

  // update(id: number, updateArticleDto: UpdateArticleDto) {
  //   return `This action updates a #${id} article`;
  // }

  async remove(id: number) {
    return await this.articleRepository.delete(id);
  }
}
