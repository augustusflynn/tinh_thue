import { InputNumber, Input, Form, DatePicker } from "antd";
import React from "react"

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  DatePicker,
  children,
  ...restProps
}) => {
  const inputNode = 
  inputType === 'number' ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Vui lòng nhập thông tin!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export default EditableCell