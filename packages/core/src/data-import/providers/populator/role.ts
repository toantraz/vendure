import { UpdateRoleInput } from '@vendure/common/lib/generated-types';
import { RequestContext } from '../../../api/common/request-context';
import {
  RoleService,
} from '../../../service';
import { RoleDefinition } from '../../types';

const createOrUpdateRole = async (ctx: RequestContext, service: RoleService, role: RoleDefinition) => {
  const list = await service.findAll(ctx, { filter: {
    code: { eq:  role.code }
  }})

  if (list && list.totalItems > 0) {
    for (const item of list.items) {
      const input: UpdateRoleInput = {
        id: item.id,
        description: item.description,
        permissions: item.permissions
      }
      await service.update(ctx, input);
    }
  } else {
    await service.create(ctx, role);
  }
}

export { createOrUpdateRole }