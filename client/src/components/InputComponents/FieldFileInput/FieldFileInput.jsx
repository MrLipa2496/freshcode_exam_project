import { Field } from 'formik';

const FieldFileInput = ({ classes, ...rest }) => {
  const { fileUploadContainer, labelClass, fileNameClass, fileInput } = classes;

  return (
    <Field name={rest.name}>
      {({ field, form }) => {
        const handleChange = event => {
          const file = event.currentTarget.files[0];
          form.setFieldValue(field.name, file);
        };

        const getFileName = () => {
          return field.value ? field.value.name : '';
        };

        return (
          <div className={fileUploadContainer}>
            <label htmlFor={rest.name} className={labelClass}>
              Choose file
            </label>
            <span className={fileNameClass}>{getFileName()}</span>
            <input
              className={fileInput}
              id={rest.name}
              name={field.name}
              type='file'
              onChange={handleChange}
            />
          </div>
        );
      }}
    </Field>
  );
};

export default FieldFileInput;
