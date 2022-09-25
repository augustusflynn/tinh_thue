import React, { useState } from 'react'
import styled from 'styled-components'
import { Footer, Step, EditableCell } from 'components'
import { Button, DatePicker, Form, Input, InputNumber, message, Popconfirm, Switch, Table, Typography } from 'antd'
import moment from 'moment'

function Tax({ history }) {
  const OPTION = window.location.hash
  const [editingKey, setEditingKey] = useState('');
  const [form] = Form.useForm();
  const [tableForm] = Form.useForm();
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    tableForm.setFieldsValue(record);
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };


  const save = async (key) => {
    try {
      const row = (await tableForm.validateFields());

      const newData = [...data];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      message.error('Vui lòng nhập đầy đủ thông tin');
    }
  };


  const handleAdd = () => {
    const newData = {
      key: count,
      month: `Tháng ${count + 1}`,
      income: 0
    };
    setData([...data, newData]);
    setCount(count + 1);
    edit(newData);
  };

  const handleDelete = (key) => {
    const newData = data.filter(item => item.key !== key)
    setData(newData)
    setCount(newData.length)
  };

  const columns = [
    {
      title: 'Tháng',
      dataIndex: 'month',
      width: '25%',
      editable: true,
    },
    {
      title: 'Thu nhập (triệu VND)',
      dataIndex: 'income',
      inputType: 'number',
      width: '25%',
      editable: true,
    },
    {
      title: 'Hành động',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link onClick={() => save(record.key)} style={{ marginRight: 8 }}>
              Lưu
            </Typography.Link>
            <Popconfirm title="Bạn có chắc muốn huỷ?" onConfirm={cancel}>
              <Typography.Link>Huỷ</Typography.Link>
            </Popconfirm>
          </span>
        ) : (
          <span>
            <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
              Cập nhật
            </Typography.Link>
            &nbsp;&nbsp;&nbsp;
            <Typography.Link disabled={editingKey !== ''} onClick={() => handleDelete(record.key)}>
              Xoá
            </Typography.Link>
          </span>
        );
      },
    },
  ];

  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'income' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const onSubmit = () => {
    if (count === 0) {
      message.warn("Không có dữ liệu để tính.");
      return;
    }

    if (editingKey === 0 || editingKey) {
      message.warn("Vui lòng hoàn tất điền thông tin vào mẫu.")
      return
    }

    Promise.all([
      form.validateFields(),
      tableForm.validateFields()
    ])
      .then((submitedValue) => {
        history.push('/receipt', {
          values: {
            year: submitedValue[0].year.format("DD/MM/YYYY"),
            name: submitedValue[0].name,
            songuoipt: submitedValue[0].songuoipt,
            bhxh: submitedValue[0].bhxh,
            months: data,
            option: OPTION,
          }
        })
      })
  }

  return (
    <StyledTax>
      <div>
        <Step current={1} />

        <div className="title">
          <h1>
            {
              OPTION === "#gt3" ?
                "Ký hợp đồng trên 3 tháng" :
                "Không ký hợp đồng hoặc ký hợp đồng dưới 3 tháng"
            }
          </h1>
        </div>

        <Form
          layout="vertical"
          form={form}
          onFinish={onSubmit}
        >
          <Form.Item
            label="Năm"
            name="year"
            required
            rules={[
              { required: true, message: "Vui lòng nhập thông tin" }
            ]}
          >
            <DatePicker
              picker='year'
              className='w-100'
              placeholder=''
              disabledDate={(current) => {
                return moment().add(-1, 'month') <= current
              }}
            />
          </Form.Item>
          <Form.Item
            label="Họ và tên"
            name="name"
            required
            rules={[
              { required: true, message: "Vui lòng nhập thông tin" }
            ]}
          >
            <Input />
          </Form.Item>
          {
            OPTION === "#gt3" && (
              <>
                <Form.Item
                  label="Bảo hiểm xã hội"
                  name="bhxh"
                >
                  <Switch />
                </Form.Item>
                <Form.Item
                  label="Số người phụ thuộc"
                  name="songuoipt"
                  required
                  rules={[
                    { required: true, message: "Vui lòng nhập thông tin" }
                  ]}
                >
                  <InputNumber
                    className='w-100'
                    min="0"
                  />
                </Form.Item>
              </>
            )
          }
        </Form>

        <h4>Hãy nhập thu nhập cá nhân mỗi tháng của bạn!</h4>
        <Form form={tableForm}>
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            bordered
            dataSource={data}
            columns={mergedColumns}
            rowClassName="editable-row"
            pagination={false}
          />
        </Form>
        <Button onClick={handleAdd} type="primary" className='my-5'>
          Thêm cột
        </Button>
        <div className='btn-confirm'>
          <Button onClick={onSubmit} type="primary" className='my-5'>
            Tính
          </Button>
        </div>
      </div>
      <Footer />
    </StyledTax>
  )
}

const StyledTax = styled.main`
  margin: 0 24px;
  margin-top: 50px;

  .title {
    text-align: center;
    margin-top: 24px;
  }

  .editable-row .ant-form-item-explain {
    position: absolute;
    top: 100%;
    font-size: 12px;
  }

  .btn-confirm {
    width: 100%;
    display: flex;
    justify-content: center;
  }
`

export default Tax