enum ErrorType {
  DirectivError = 1,
}

export default class DirectivError extends Error {
  constructor(type: number, msg: string) {
    super();

    // this.message = value;
    switch (type) {
      case ErrorType.DirectivError:
        this.name = ErrorType[ErrorType.DirectivError];
        this.message = msg;
    }
  }
}
