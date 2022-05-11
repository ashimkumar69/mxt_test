import * as React from "react";

const TestInput = [
  {
    section: "Basic Information",
    fields: [
      {
        name: "firstName",
        label: "First Name",
        type: {
          type: "text",
          typeValidationMessage: "This is a text field",
        },
        validations: [
          {
            required: true,
            validationMessage: "This field is required",
          },
          {
            type: "letters",
            validationMessage: "This field supports only characters",
          },
          {
            min: 2,
            validationMessage: "Minimum field should be 2",
          },
          {
            max: 100,
            validationMessage: "Maximum field should be 100",
          },
        ],
      },
      {
        name: "lastName",
        label: "Last Name",
        type: {
          type: "text",
          typeValidationMessage: "This is a text field",
        },
        validations: [
          {
            required: true,
            validationMessage: "This field is required",
          },
          {
            type: "letters",
            validationMessage: "This field supports only characters",
          },
          {
            min: 2,
            validationMessage: "Minimum field should be 2",
          },
          {
            max: 100,
            validationMessage: "Maximum field should be 100",
          },
        ],
      },
      {
        name: "email",
        label: "Email",
        type: {
          type: "email",
          typeValidationMessage: "This field requires a valid email address",
        },
        validations: [
          {
            required: true,
            validationMessage: "This field is required",
          },
          {
            min: 6,
            validationMessage: "Minimum field should be 6",
          },
          {
            max: 100,
            validationMessage: "Maximum field should be 100",
          },
        ],
      },
      {
        name: "age",
        label: "Age",
        type: {
          type: "number",
          typeValidationMessage: "This field requires a valid number",
        },
        validations: [
          {
            required: true,
            validationMessage: "This field is required",
          },
          {
            min: 18,
            validationMessage: "Minimum field should be 18",
          },
          {
            max: 56,
            validationMessage: "Maximum field should be 56",
          },
        ],
      },
    ],
  },
  {
    section: "Billing Information",
    fields: [],
  },
];

function isTextLetter(inputTxt) {
  const letters = /^[A-Za-z]+$/;
  if (inputTxt.match(letters)) {
    return "letters";
  } else {
    return "not letters";
  }
}

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  age: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "add":
      return {
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        email: action.payload.email,
        age: action.payload.age,
      };

    default:
      throw new Error("Unexpected action");
  }
}

export default function Home() {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const [fieldData, setFieldData] = React.useState(TestInput);

  const formSubmitHandler = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    setFieldData((prevState) => {
      return [
        ...prevState.map((section) => {
          return {
            ...section,
            fields: section.fields.map((field) => {
              for (let [key, value] of data.entries()) {
                if (field.name === key) {
                  return {
                    ...field,
                    validations: field.validations.map((validation) => {
                      if (validation.required && value && value.length > 0) {
                        return {
                          ...validation,
                          isValid: true,
                        };
                      } else if (
                        validation.type &&
                        validation.type === isTextLetter(value)
                      ) {
                        return {
                          ...validation,
                          isValid: true,
                        };
                      } else if (
                        validation.min &&
                        value &&
                        validation.min <= value.length
                      ) {
                        return {
                          ...validation,
                          isValid: true,
                        };
                      } else if (
                        validation.max &&
                        value &&
                        validation.max >= value.length
                      ) {
                        return {
                          ...validation,
                          isValid: true,
                        };
                      } else {
                        return {
                          ...validation,
                          isValid: false,
                        };
                      }

                      // validations
                    }),
                  };
                }
                // loop
              }

              // field
            }),
          };
        }),
      ];
    });

    dispatch({
      type: "add",
      payload: {
        firstName: data.get("firstName"),
        lastName: data.get("lastName"),
        email: data.get("email"),
        age: data.get("age"),
      },
    });
  };

  React.useEffect(() => {
    let validatedFieldData = true;
    fieldData.forEach((section) => {
      section.fields.forEach((field) => {
        field.validations.forEach((validation) => {
          if (validation.hasOwnProperty("isValid") && !validation.isValid) {
            validatedFieldData = false;
          }
          // validations
        });
        // field
      });
    });

    if (validatedFieldData) {
      console.log(state.firstName, state.lastName, state.email, state.age);
    }
  }, [fieldData, state]);

  return (
    <div>
      {fieldData.map((section, index) => {
        return (
          <div key={index}>
            <h3>{section.section}</h3>
            <form onSubmit={formSubmitHandler}>
              {section.fields.map((field, index) => {
                return (
                  <div key={index}>
                    <label>{field.label}</label>
                    <input name={field.name} type={field.type.type} />
                    <p>{field.type.typeValidationMessage}</p>

                    {field.validations.map((validation, index) => {
                      if (
                        validation.hasOwnProperty("isValid") &&
                        !validation?.isValid
                      ) {
                        return (
                          <p key={index} style={{ color: "red" }}>
                            {validation.validationMessage}
                          </p>
                        );
                      }
                    })}
                  </div>
                );
              })}
              <button type="submit">Submit</button>
            </form>
          </div>
        );
      })}
    </div>
  );
}
