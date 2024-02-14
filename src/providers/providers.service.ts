import { Injectable } from '@nestjs/common';
import { Provider } from './providers.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { constructQuery, contructLinksMeta } from 'src/core/utils/construct-queries';
import { Audit } from 'src/audit/audit.entity';
import { v4 as uuidv4 } from 'uuid';
import * as moment from 'moment';

@Injectable()
export class ProvidersService {

    private moduleName: string = 'Provider';

    constructor(
        @InjectModel('Provider') private readonly providerModel: Model<Provider>,
        @InjectModel('Audit') private readonly auditModel: Model<Audit>,
    ) {
    }


    async findAll(page: number | undefined, headers: any): Promise<{ data: Provider[]; links: any; meta: any }> {
        let filterModel!: any;
        if (headers['x-filter-model']) {
            filterModel = JSON.parse(headers['x-filter-model']);
        }
        else if (!headers['x-filter-model']) {
            filterModel = {};
        }
        const queryConstruct = constructQuery(filterModel.orSingleQueries);
        const data = await this.providerModel.find(queryConstruct).skip(((Number(page) || 1) - 1) * 10).limit(10).exec();
        const totalDocuments = await this.providerModel.countDocuments();
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

    async list(): Promise<{ data: Provider[] }> {
        const data = await this.providerModel.find().exec();
        return {
            data: data
        }
    }

    async create(Provider: Provider, headers: any): Promise<Provider> {
        const idUser: string = headers['x-user'];
        const createAudit = new this.auditModel(
            {
                _id: uuidv4(),
                action_type: 'CREATE',
                module_name: this.moduleName,
                user_id: idUser || '',
                date_action: moment().format('L'),
                data: JSON.stringify(Provider),
            }
        );
        createAudit.save();
        const createdProduct = new this.providerModel(Provider);
        return createdProduct.save();
    }

    async update(id: string, Product: Provider, headers: any): Promise<{ data: Provider }> {
        try {
            const updatedProduct = await this.providerModel.findByIdAndUpdate(id, Product, { new: true });
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
        return this.providerModel.findByIdAndDelete(id);
    }

}
