import { Pagination } from "nestjs-typeorm-paginate";

export class Common {
  errorMessage(property: string, message: string): Object {
    return { property: property, message: message };
  }

  resErrors(errors: Object[]) {
    return { errors: errors };
  }

  resData<T>(message: T): Object {
    return { data: message };
  }

  resListData<T>(pagination : Pagination<T>): Object {
    return {
      data: pagination.items,
      meta: pagination.meta,
      links: pagination.links,
    };
  }
}
