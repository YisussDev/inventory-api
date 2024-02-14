import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Sale } from './sales.entity';
import { Model } from 'mongoose';
import { constructQuery, contructLinksMeta } from 'src/core/utils/construct-queries';
import { Product } from 'src/products/products.entity';
import { Audit } from 'src/audit/audit.entity';
import { v4 as uuidv4 } from 'uuid';
import * as moment from 'moment';

@Injectable()
export class SalesService {

    private moduleName: string = 'Sales';

    constructor(
        @InjectModel('Product') private readonly productModel: Model<Product>,
        @InjectModel('Sale') private readonly saleModel: Model<Sale>,
        @InjectModel('Audit') private readonly auditModel: Model<Audit>,
    ) {
    }

    async findAll(page: number | undefined, headers: any): Promise<{ data: Sale[]; links: any; meta: any }> {
        let filterModel!: any;
        if (headers['x-filter-model']) {
            filterModel = JSON.parse(headers['x-filter-model']);
        }
        else if (!headers['x-filter-model']) {
            filterModel = {};
        }
        const queryConstruct = constructQuery(filterModel.orSingleQueries);
        const data = await this.saleModel.find(queryConstruct).skip(((Number(page) || 1) - 1) * 10).limit(10).exec();
        const totalDocuments = await this.saleModel.countDocuments();
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

    async create(sale: Sale, headers: any): Promise<Sale> {

        const products = JSON.parse(sale.products);
        let saleValid: boolean = true;

        for (const product of products) {
            const productInDB = await this.productModel.findOne({ _id: product._id }).exec();
            if (productInDB < product.quantity) (saleValid = false);
        }
        if (saleValid) {
            for (const product of products) {
                const productInDB = await this.productModel.findOne({ _id: product._id }).exec();
                productInDB.quantity = Number(productInDB.quantity) - Number(product.quantity);
                const updatedProduct = await this.productModel.findByIdAndUpdate(product._id, productInDB, { new: true });
            }
            const idUser: string = headers['x-user'];
            const createAudit = new this.auditModel(
                {
                    _id: uuidv4(),
                    action_type: 'CREATE',
                    module_name: this.moduleName,
                    user_id: idUser || '',
                    date_action: moment().format('L'),
                    data: JSON.stringify(sale),
                }
            );
            createAudit.save();
            const createdSale = new this.saleModel(sale);
            return createdSale.save();
        }
        else {
            throw new HttpException('No Stock', HttpStatus.BAD_GATEWAY);
        }
    }

}
