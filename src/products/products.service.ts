import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as moment from 'moment';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './products.entity';
import { constructQuery, contructLinksMeta } from 'src/core/utils/construct-queries';
import { Audit } from 'src/audit/audit.entity';

@Injectable()
export class ProductsService {

    private moduleName: string = 'Products';

    constructor(
        @InjectModel('Product') private readonly productModel: Model<Product>,
        @InjectModel('Audit') private readonly auditModel: Model<Audit>,
    ) {
    }


    async findAll(page: number | undefined, headers: any): Promise<{ data: Product[]; links: any; meta: any }> {
        const filterModel = JSON.parse(headers['x-filter-model']);
        const queryConstruct = constructQuery(filterModel.orSingleQueries);
        const data = await this.productModel.find(queryConstruct).skip(((Number(page) || 1) - 1) * 10).limit(10).exec();
        const totalDocuments = await this.productModel.countDocuments();
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

    async findByEmail(email: string): Promise<Product[]> {
        return await this.productModel.find({ email }).exec();
    }

    async create(Product: Product, headers: any): Promise<Product> {
        const idUser: string = headers['x-user'];
        const createAudit = new this.auditModel(
            {
                _id: uuidv4(),
                action_type: 'CREATE',
                module_name: this.moduleName,
                user_id: idUser || '',
                date_action: moment().format('L'),
                data: JSON.stringify(Product),
            }
        );
        createAudit.save();
        const createdProduct = new this.productModel(Product);
        return createdProduct.save();
    }

    async update(id: string, Product: Product, headers: any): Promise<{ data: Product }> {
        try {
            const updatedProduct = await this.productModel.findByIdAndUpdate(id, Product, { new: true });
            const idUser: string = headers['x-user'];
            const createAudit = new this.auditModel(
                {
                    _id: uuidv4(),
                    action_type: 'UPDATE',
                    module_name: this.moduleName,
                    user_id: idUser || '',
                    date_action: moment().format('L'),
                    data: JSON.stringify(Product),
                }
            );
            createAudit.save();
            return { data: updatedProduct };
        } catch (error) {
            throw new Error(`Error updating Product with ID ${id}: ${error.message}`);
        }
    }

    async deleteById(id: string, headers: any): Promise<any> {
        const idUser: string = headers['x-user'];
        const createAudit = new this.auditModel(
            {
                _id: uuidv4(),
                action_type: 'DELETE',
                module_name: this.moduleName,
                user_id: idUser || '',
                date_action: moment().format('L'),
                data: JSON.stringify(id),
            }
        );
        createAudit.save();
        return this.productModel.findByIdAndDelete(id);
    }

}
