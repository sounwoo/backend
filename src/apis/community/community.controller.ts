import { Container } from 'typedi';
import { CommunityService } from './community.service';
import { Request, Response, Router } from 'express';
import { asyncHandler } from '../../middleware/async.handler';
import accessGuard from '../../middleware/auth.guard/access.guard';
import { idType, pathType } from '../../common/types';
import { validateDTO } from '../../common/validator/validateDTO';
import { CreateCommunityDTO } from './dto/create.input';
import { FindOneCommunityDTO } from './dto/findOneCommunity';
import { FindManyCommunityDTO } from './dto/findManyCommunity';

class CommunityController {
    router = Router();
    path = '/community';

    constructor(
        private readonly communityService: CommunityService, //
    ) {
        this.init();
    }
    init() {
        this.router.post(
            '/create',
            accessGuard.handle,
            asyncHandler(this.create.bind(this)),
        );
        this.router.get('/', asyncHandler(this.fidneMany.bind(this)));
        this.router.get(
            '/:id',
            accessGuard.handle,
            asyncHandler(this.findeOne.bind(this)),
        );
    }

    async create(req: Request, res: Response) {
        const { id } = req.user as idType;
        const createCommunity = req.body;

        await validateDTO(new CreateCommunityDTO(createCommunity));

        res.status(200).json({
            data: await this.communityService.create({
                id,
                createCommunity,
            }),
        });
    }

    async fidneMany(req: Request, res: Response) {
        const { path } = req.query as pathType;

        path &&
            (await validateDTO(
                new FindManyCommunityDTO(req.query as pathType),
            ));

        res.status(200).json({
            data: await this.communityService.findeMany({ path }),
        });
    }

    async findeOne(req: Request, res: Response) {
        const { id } = req.params as idType;
        await validateDTO(new FindOneCommunityDTO(req.params as idType));

        res.status(200).json({
            data: await this.communityService.findOne({ id }),
        });
    }
}

export default new CommunityController(Container.get(CommunityService));