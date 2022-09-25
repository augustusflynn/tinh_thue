import React from 'react'
import styled from 'styled-components'
import { useLocation } from 'react-router-dom'
import { Footer, Step } from 'components'
import { Card } from 'antd';

function Receipt() {
  const { state } = useLocation();
  const data = state.values;

  function calculateTaxLT3(thunhap) {
    if (thunhap < 2) {
      return 0;

    } else {
      return thunhap * 0.01;
    }
  }

  function calculateTaxByMonth(tienthunhap, songuoiphuthuoc, bhxh = false) {
    let baohiem
    if (bhxh) {
      baohiem = tienthunhap * 0.08;
    } else {
      baohiem = 0;
    }
    const phuphuoc = songuoiphuthuoc * 4.4;
    const thuethunhap = tienthunhap - 11 - phuphuoc - baohiem;
    return calculateTaxGTE3(thuethunhap);
  }

  function calculateTaxGTE3(thuethunhap) {
    if (thuethunhap < 0) {
      return thuethunhap = 0.0;
    }

    if (thuethunhap <= 5) {
      return thuethunhap = thuethunhap * 0.05;
    }

    if (thuethunhap > 5 && thuethunhap <= 10) {
      return thuethunhap = thuethunhap * 0.1 - 0.25;
    }

    if (thuethunhap > 10 && thuethunhap <= 18) {
      return thuethunhap = thuethunhap * 0.15 - 0.75;
    }

    if (thuethunhap > 18 && thuethunhap <= 32) {
      return thuethunhap = thuethunhap * 0.2 - 1.65;
    }

    if (thuethunhap > 32 && thuethunhap <= 52) {
      return thuethunhap = thuethunhap * 0.25 - 3.25;
    }

    if (thuethunhap > 52 && thuethunhap <= 80) {
      return thuethunhap = thuethunhap * 0.30 - 5.85;
    }

    if (thuethunhap > 80) {
      return thuethunhap = thuethunhap * 0.35 - 9.85;
    }
  }

  function handleCalculateTotal() {
    let tong = 0;
    if (data.option === "#gt3") {
      for (let thunhap of data.months) {
        tong += calculateTaxByMonth(thunhap.income, data.songuoipt, data.bhxh)
      }
    } else {
      for (let thunhap of data.months) {
        tong += calculateTaxLT3(thunhap.income)
      }
    }
    return tong;
  }

  return (
    <StyledReceipt>
      <div>
        <Step current={2} />

        <Card
          title="Thông tin thu nhập"
          style={{
            width: 400,
            margin: '5em auto'
          }}
        >
          <div className='table'>
            <table>
              <thead>
                <tr>
                  <th className='mr-3'>Năm</th>
                  <th>Họ và tên</th>
                  {
                    data.songuoipt && (
                      <th>Số người phụ thuộc</th>
                    )
                  }
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{data.year}</td>
                  <td>{data.name}</td>
                  {
                    data.songuoipt && (
                      <td>songuoipt</td>
                    )
                  }
                </tr>
              </tbody>
            </table>
          </div>
          <h1>Bảng thuế </h1>
          <div className='table'>
            <table>
              <thead>
                <tr>
                  <th>Tháng</th>
                  <th>Thu nhập</th>
                  <th>Thuế thu nhập</th>
                </tr>
              </thead>
              <tbody>
                {
                  data.months.map((m) => {
                    return (
                      <tr key={m.month}>
                        <td>{m.month}</td>
                        <td>{m.income}</td>
                        <td>
                          {
                            data.option === "#gt3" ?
                              calculateTaxGTE3(m.income) :
                              calculateTaxLT3(m.income)
                          }
                        </td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>
          <div className='table'>
            <table>
              <tr>
                <th>Tổng thuế năm</th>
                <th>
                  {handleCalculateTotal()}
                </th>
              </tr>
            </table>
          </div>
        </Card>
      </div>
      <Footer />
    </StyledReceipt>
  )
}

const StyledReceipt = styled.main`
  margin: 0 24px;
  margin-top: 50px;

  .table {
    table {
      width: 100%;
    }
  }
`

export default Receipt