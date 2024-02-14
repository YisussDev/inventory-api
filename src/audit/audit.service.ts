import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Audit } from './audit.entity';
import { Model } from 'mongoose';
import { constructQuery, contructLinksMeta } from 'src/core/utils/construct-queries';

@Injectable()
export class AuditService {

    constructor(
        @InjectModel('Audit') private readonly auditModel: Model<Audit>,
    ) {
    }

    async findAll(page: number | undefined, headers: any): Promise<{ data: Audit[]; links: any; meta: any }> {
        const filterModel = JSON.parse(headers['x-filter-model']);
        const queryConstruct = constructQuery(filterModel.orSingleQueries);
        const data = await this.auditModel.find(queryConstruct).skip(((Number(page) || 1) - 1) * 10).limit(10).exec();
        const totalDocuments = await this.auditModel.countDocuments();
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

    async create(audit: Audit): Promise<Audit> {
        const createAudit = new this.auditModel(audit);
        return createAudit.save();
    }

}
