import { RequestContext } from '../../../api/common/request-context';
import { TaxCategoryService } from '../../../service/services/tax-category.service';

const createTaxCategory = async (ctx: RequestContext, service: TaxCategoryService, name: string) => {
  const list = await service.findAll(ctx)
  if (list && list.length > 0) {
    const category = list.find(v => v.name === name)
    if (category) return category
  }

  const category = await service.create(ctx, { name });
  return category;
}

export { createTaxCategory }
