import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';
import { constructQuery, contructLinksMeta } from 'src/core/utils/construct-queries';
import { Audit } from 'src/audit/audit.entity';

@Injectable()
export class UsersService {


  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
  ) { }

  async findAll(page: number | undefined, headers: any): Promise<{ data: User[]; links: any; meta: any }> {
    const filterModel = JSON.parse(headers['x-filter-model']);
    const queryConstruct = constructQuery(filterModel.orSingleQueries);
    const data = await this.userModel.find(queryConstruct).skip(((Number(page) || 1) - 1) * 10).limit(10).exec();
    const totalDocuments = await this.userModel.countDocuments();
    const totalPages = Math.trunc(totalDocuments / 10) + 1;
    return {
      data: data,
      links: {
        prev: (page == 1 ? (null) : (`http://test.com?page=${page - 1}`)),
        next: ((((Number(page) || 1) + 1) >= totalPages) ? (null) : (`http://test.com?page=${(Number(page) || 1) + 1}`)),
        first: "http://test.com?page=1",
        last: `http://test.com?page=${totalPages}`
      },
      meta: {
        current_page: (page || 1),
        links: contructLinksMeta(totalDocuments)
      }
    };
  }

  async findByEmail(email: string): Promise<User[]> {
    return await this.userModel.find({ email }).exec();
  }

  async create(user: User): Promise<User> {
    const createdUser = new this.userModel(user);
    return createdUser.save();
  }

  async update(id: string, user: User): Promise<{ data: User }> {
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(id, user, { new: true });
      return { data: updatedUser };
    } catch (error) {
      throw new Error(`Error updating user with ID ${id}: ${error.message}`);
    }
  }

  async deleteById(id: string): Promise<any> {
    return this.userModel.findByIdAndDelete(id);
  }

}
