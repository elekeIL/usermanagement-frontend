export class ErrorMessages {
  static messages(label = "This field"): { type: string; message: string }[] {
    return [
      {
        type: "required",
        message: `${label} is required`,
      },
      {
        type: "unique",
        message: `${label} must be unique`,
      },
      {
        type: "notBlank",
        message: `${label} can not be blank`,
      },
      {
        type: "email",
        message: `${label} is invalid`,
      },
      {
        type: "noSpace",
        message: `Blank space not allowed`,
      },
      {
        type: "minlength",
        message: `Too short`,
      },
      {
        type: "maxlength",
        message: `Too long`,
      },
      {
        type: "invalidPhoneNumber",
        message: `${label} is not valid`,
      },
      {
        type: "validatePhoneNumber",
        message: `${label} is invalid`,
      },
    ];
  }
}
