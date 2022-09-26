import React from 'react'
import styled from 'styled-components'
import { useLocation } from 'react-router-dom'
import { Footer, Step } from 'components'
import { Card } from 'antd';

function Receipt() {
  const { state } = useLocation();
  const data = state.values;

  function calculateTaxByMonth(tienthunhap, songuoiphuthuoc, bhxh = false) {
    let baohiem
    if (bhxh) {
      baohiem = tienthunhap * 0.08;
    } else {
      baohiem = 0;
    }
    if(tienthunhap <= 11000000){
      let thuethunhap;
      return thuethunhap = 0;
    }
    else{

      const phuphuoc = songuoiphuthuoc * 4400000;
      const thuethunhap = tienthunhap - 11000000 - phuphuoc - baohiem;
      return thuethunhap;
    }
  }

  function calculateTaxGTE3(thuethunhap) {
    if (thuethunhap <= 0) {
      return thuethunhap = 0.0;
    }

    if (thuethunhap <= 5000000) {
      return thuethunhap = thuethunhap * 0.05;
    }

    if (thuethunhap > 5000000 && thuethunhap <= 10000000) {
      return thuethunhap = thuethunhap * 0.1 - 0.25;
    }

    if (thuethunhap > 10000000 && thuethunhap <= 18000000) {
      return thuethunhap = thuethunhap * 0.15 - 0.75;
    }

    if (thuethunhap > 18000000 && thuethunhap <= 32000000) {
      return thuethunhap = thuethunhap * 0.2 - 1.65;
    }

    if (thuethunhap > 32000000 && thuethunhap <= 52000000) {
      return thuethunhap = thuethunhap * 0.25 - 3.25;
    }

    if (thuethunhap > 52000000&& thuethunhap <= 80000000) {
      return thuethunhap = thuethunhap * 0.30 - 5.85;
    }

    if (thuethunhap > 80000000) {
      return thuethunhap = thuethunhap * 0.35 - 9.85;
    }
  }

  function handleCalculateTotal() {
    let tong1 = 0;
    
      for (let thunhap of data.months) {
        tong1 += calculateTaxByMonth(thunhap.income, data.songuoipt, data.bhxh)
      }
    
    
    return tong1;
  }

function soThueDaNop(){
  let tong2 = 0;
  for (let thunhap of data.months) {
     let thuethunhap = calculateTaxByMonth(thunhap.income, data.songuoipt, data.bhxh)
     tong2 +=  calculateTaxGTE3(thuethunhap)
  }

   return tong2;
   
}
function soThueThucTe(){
  let tongThuNhap = 0;
  let thueCoBan = data.months.length * 11000000
  for (let thunhap of data.months) {
    tongThuNhap += thunhap.income
  }
  let tongThuNhapTinhThue = calculateTaxByMonth(tongThuNhap, data.songuoipt, data.bhxh) - thueCoBan;
  let thueTNCNThucTe = calculateTaxGTE3(tongThuNhapTinhThue)
  return thueTNCNThucTe
  
}

function tienThueNhanLai(thuetamnop,thuethucte){
  return thuetamnop - thuethucte;
}
  return (
    <StyledReceipt>
      <div>
        

        <Card
          title="Thông tin thu nhập"
          style={{
            width: 700,
            margin: '5em auto'
          }}
        >
          <div className='table'>
            <table>
              <thead>
                <tr>
                  <th className='mr-3'>Ngày tháng năm</th>
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
                      <td>{data.songuoipt}</td>
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
                  <th>Thu nhập </th>
                  {/* <th>Thu nhập tính thuế </th> */}
                  <th>Thuế thu nhập phải nộp </th>
                </tr>
              </thead>
              <tbody>
                {
                  data.months.map((m) => {
                    // let thuethunhap = calculateTaxByMonth(m.income,data.songuoipt,data.bhxh)
                    return (
                     
                      <tr key={m.month}>
                        <td>{m.month}</td>
                        <td>{m.income}</td>
                        {/* <td>{
                          calculateTaxByMonth(m.income,data.songuoipt,data.bhxh)}</td> */}
                        <td>
                          {
                           
                              calculateTaxGTE3(calculateTaxByMonth(m.income,data.songuoipt,data.bhxh)) 
                          }
                        </td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>
          {/* <div className='table'>
            <table>
              <tr>
                <th>Tổng thuế TNCN </th>
                <th>
                  {handleCalculateTotal()}
                </th>
              </tr>
            </table>
          </div> */}

          <div class='table'>
            <table>
              <thead>
                <tr>
                  <th>Thuế TNCN đã tạm nộp </th>
                  <th>Thuế TNCN thực tế </th>
                  <th>Tiền thuế nhận lại </th>
                 
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{soThueDaNop()}</td>
                  <td>{soThueThucTe()}</td>
                  <td>{tienThueNhanLai(soThueDaNop(),soThueThucTe())}</td>
                </tr>
              </tbody>
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