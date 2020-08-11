export class Common {
  resError<T>(message: T) {
    return { "error": message };
  }

  errorMessage(property: string, message: string) {
    return { "property": property, "message": message };
  }

  resErrors(errors: Map<string, string>[]) {
    return { "errors": errors };
  }

  resData<T>(message: T) {
    return { "data": message };
  }

  resMessage(message: any) {
    return { "message": message };
  }
}
