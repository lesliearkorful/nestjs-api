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
}
