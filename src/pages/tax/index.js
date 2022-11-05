import React, { useState } from 'react'
import styled from 'styled-components'
import { Footer, Step, EditableCell } from 'components'
import { Button, DatePicker, Form, Input, InputNumber, message, Popconfirm, Switch, Table, Typography, Card } from 'antd'
import moment from 'moment'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { isBuffer, values } from 'lodash'
ChartJS.register(ArcElement, Tooltip, Legend);




const StyledReceipt = styled.main`
  margin: 0 24px;
  margin-top: 50px;

  .table {
    table {
      width: 100%;
    }
  }
`
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

  const test = () => {
    const res = {}
    data.map(ele => {
      if (!res[ele.type])
        res[ele.type] = 0

      res[ele.type] += ele.income
      console.log(res[ele.type])
      console.log(ele.income)
    }
    )
    console.log(res)
    console.log(Object.values(res))
    return Object.values(res)

  }
  // const getSum =([],day)=>{
  //   const month = new Date(day).getMonth() + 1
  //   const total = 0
  //   for( var i = 1; i <= 12; i++ ){
  //     if([].month[i]=== 5){
  //       total+=[].income[i]
  //     }
  //     console.log(total)
  //     return total
  //   }
  // }

  const dataChart = {
    labels: data.map((ele) => ele.type),
    datasets: [
      {
        label: '# of Votes',
        data: test(),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
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
      title: 'Ngày',
      dataIndex: 'day',
      width: '20%',
      editable: true,

    },
    {
      title: 'Tên khoản chi',
      dataIndex: 'type',
      width: '20%',
      editable: true,
    },
    {
      title: 'Nhập số tiền (VND)',
      dataIndex: 'income',
      inputType: 'number',
      width: '20%',
      editable: true,
    },
    {
      title: 'Mô tả',
      dataIndex: 'content',
      width: '20%',
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
  // const getSum = ([])=>{
  //   let month = 
  //   if(!month){
  //      total = [].reducereduce((previousValue, currentValue) => previousValue + currentValue, 0);

  //   }
  //   return total
  // }

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

  // const onSubmit = () => {
  //   if (count === 0) {
  //     message.warn("Không có dữ liệu để tính.");
  //     return;
  //   }

  //   if (editingKey === 0 || editingKey) {
  //     message.warn("Vui lòng hoàn tất điền thông tin vào mẫu.")
  //     return
  //   }

  //   Promise.all([
  //     form.validateFields(),
  //     tableForm.validateFields()
  //   ])
  //     .then((submitedValue) => {
  //       history.push('/', {
  //         values: {
  //           year: submitedValue[0].year.format("DD/MM/YYYY"),
  //           name: submitedValue[0].name,
  //           gtbt: submitedValue[0].gtbt,
  //           songuoipt: submitedValue[0].songuoipt,
  //           bhxh: submitedValue[0].bhxh,
  //           months: data,
  //           option: OPTION,
  //         }
  //       })
  //     })
  // }

  return (
    <StyledTax>
      <div>


        <div className="title">
          <h1>
            Chào mừng bạn đến với App quản lí chi tiêu
          </h1>
        </div>

        <Form
          layout="vertical"
          form={form}
        // onFinish={onSubmit}
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
          {/* <Form.Item
                  label="Bảo hiểm xã hội"
                  name="bhxh"
                >
                  <Switch />
          </Form.Item>
          <Form.Item
          label = "Giảm trừ bản thân"
          name="gtbt">
              <Input
              defaultValue={11}
              disabled={disabled}
              />
          </Form.Item> */}
          {/* <Form.Item
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
          </Form.Item> */}


        </Form>

        <h4>Hãy nhập các khoản chi của bạn!</h4>
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
          Thêm khoản chi
        </Button>
        {/* <div className='btn-confirm'>
          <Button onClick={onSubmit} type="primary" className='my-5'>
            Tính
          </Button>
        </div> */}

        {/* <div>
      
        <Pie data={dataChart} />
            </div> */}


        <StyledReceipt>
          <div>


            <Card
              title="Thống kê chi tiêu tháng"
              style={{
                width: 700,
                margin: '5em auto'
              }}
            >
              <div className='table'>
                <table>
                  <thead>
                    <tr>
                      <th className='mr-3'>Tháng</th>
                      <th className='mr-3'>Tổng chi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((m) => {
                      return (
                        <tr key={m.day}>
                          <td>{new Date(m.day).getMonth() + 1}</td>
                          <td>{
                            // m.filter((ele)=> {
                            //   return 
                            // })
                          }
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </Card>


          </div>
          <div>
            <h4>
              Biểu đồ chi tiêu
              <Pie data={dataChart} />
            </h4>
          </div>
          <Footer />
        </StyledReceipt>
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