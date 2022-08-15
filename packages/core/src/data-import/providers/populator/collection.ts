import { UpdateCollectionInput, UpdateRoleInput } from '@vendure/common/lib/generated-types';
import { RequestContext } from '../../../api/common/request-context';
import {
  CollectionService,
} from '../../../service';

const createOrUpdateCollection = async (ctx: RequestContext, service: CollectionService, slug: string, data: any) => {  

  const list = await service.findAll(ctx, { filter: {
    slug: { eq: slug }
  }})

  if (list && list.totalItems > 0) {
    for (const item of list.items) {
      const input: UpdateCollectionInput = {
        id: item.id,
        ...data
      };
      return await service.update(ctx, input);
    }
  }

  const collection = await service.create(ctx, data);
  return collection
}

export { createOrUpdateCollection }
