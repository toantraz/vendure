import { UpdateCollectionInput, UpdateCountryInput, UpdateRoleInput } from '@vendure/common/lib/generated-types';
import { RequestContext } from '../../../api/common/request-context';
import {
  CountryService,
} from '../../../service';

const createOrUpdateCountry = async (ctx: RequestContext, service: CountryService, data: any) => {  
  const code = data.code;
  const list = await service.findAll(ctx, { filter: {
    code: { eq: code }
  }})

  if (list && list.totalItems > 0) {
    for (const item of list.items) {
      const input: UpdateCountryInput = {
        id: item.id,
        ...data,
      };
      return await service.update(ctx, input);
    }
  }

  const country = await service.create(ctx, data);
  return country
}

export { createOrUpdateCountry }
