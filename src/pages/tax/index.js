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

  // const getMoney=()=>{
  //  let total = 0;
  //   if(data.day.substring(3,5) === "01"){
      
  //     return total += [].income
  //   }
  //   else{
  //     return total
  //   }
  // }
  // console.log(getMoney(data))
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
  // const getSum =([])=>{
  //   new Arr = []
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
      message.error('Vui l??ng nh???p ?????y ????? th??ng tin');
    }
  };


  const handleAdd = () => {
    const newData = {
      key: count,
      month: `Th??ng ${count + 1}`,
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
      title: 'Ng??y',
      dataIndex: 'day',
      width: '20%',
      editable: true,

    },
    {
      title: 'T??n kho???n chi',
      dataIndex: 'type',
      width: '20%',
      editable: true,
    },
    {
      title: 'Nh???p s??? ti???n (VND)',
      dataIndex: 'income',
      inputType: 'number',
      width: '20%',
      editable: true,
    },
    {
      title: 'M?? t???',
      dataIndex: 'content',
      width: '20%',
      editable: true,
    },

    {
      title: 'H??nh ?????ng',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link onClick={() => save(record.key)} style={{ marginRight: 8 }}>
              L??u
            </Typography.Link>
            <Popconfirm title="B???n c?? ch???c mu???n hu????" onConfirm={cancel}>
              <Typography.Link>Hu???</Typography.Link>
            </Popconfirm>
          </span>
        ) : (
          <span>
            <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
              C???p nh???t
            </Typography.Link>
            &nbsp;&nbsp;&nbsp;
            <Typography.Link disabled={editingKey !== ''} onClick={() => handleDelete(record.key)}>
              Xo??
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
  //     message.warn("Kh??ng c?? d??? li???u ????? t??nh.");
  //     return;
  //   }

  //   if (editingKey === 0 || editingKey) {
  //     message.warn("Vui l??ng ho??n t???t ??i???n th??ng tin v??o m???u.")
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
            Ch??o m???ng b???n ?????n v???i App qu???n l?? chi ti??u
          </h1>
        </div>

        <Form
          layout="vertical"
          form={form}
        // onFinish={onSubmit}
        >
          <Form.Item
            label="N??m"
            name="year"
            required
            rules={[
              { required: true, message: "Vui l??ng nh???p th??ng tin" }
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
            label="H??? v?? t??n"
            name="name"
            required
            rules={[
              { required: true, message: "Vui l??ng nh???p th??ng tin" }
            ]}
          >
            <Input />
          </Form.Item>
          {/* <Form.Item
                  label="B???o hi???m x?? h???i"
                  name="bhxh"
                >
                  <Switch />
          </Form.Item>
          <Form.Item
          label = "Gi???m tr??? b???n th??n"
          name="gtbt">
              <Input
              defaultValue={11}
              disabled={disabled}
              />
          </Form.Item> */}
          {/* <Form.Item
                  label="S??? ng?????i ph??? thu???c"
                  name="songuoipt"
                  required
                  rules={[
                    { required: true, message: "Vui l??ng nh???p th??ng tin" }
                  ]}
                >
                  <InputNumber
                    className='w-100'
                    min="0"
                  />
          </Form.Item> */}


        </Form>

        <h4>H??y nh???p c??c kho???n chi c???a b???n!</h4>
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
          Th??m kho???n chi
        </Button>
        {/* <div className='btn-confirm'>
          <Button onClick={onSubmit} type="primary" className='my-5'>
            T??nh
          </Button>
        </div> */}

        {/* <div>
      
        <Pie data={dataChart} />
            </div> */}


        <StyledReceipt>
          <div>


            <Card
              title="Th???ng k?? chi ti??u"
              style={{
                width: 700,
                margin: '5em auto'
              }}
            >
              <div className='table'>
                <table>
                  <thead>
                    <tr>
                      <th className='mr-3'>Ng??y</th>
                      <th className='mr-3'>T???ng chi(VN??)</th>
                    </tr>
                  </thead>
                  <tbody>
                    
                      {data.map((m)=>{
                        return(
                          <tr>
                          <td>{m.day}</td>
                          <td>{m.income}</td>
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
              Bi???u ????? chi ti??u
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