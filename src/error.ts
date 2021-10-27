enum ErrorType {
	DirectivError = 1,
}

export const warn = (msg: string): void => {
	console.warn(msg)
}
export default class DirectivError extends Error {
	constructor(type: number, msg: string) {
		super()

		// this.message = value;
		switch (type) {
			case ErrorType.DirectivError:
				this.name = ErrorType[ErrorType.DirectivError]
				this.message = msg
		}
	}
}
