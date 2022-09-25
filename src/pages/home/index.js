import { ArrowRightOutlined } from '@ant-design/icons'
import { Footer, Step } from 'components'
import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

function Home() {
  return (
    <StyledHome>
      <div>
        <Step current={0} />
        <div className='title'>
          <h1>CHỌN LOẠI HÌNH LAO ĐỘNG CỦA BẠN</h1> <br />
        </div>
        <Link className='navigate-section' to='/tax#lte3'>
          <h4>Không ký hợp đồng hoặc ký hợp đồng dưới 3 tháng</h4>
          <ArrowRightOutlined />
        </Link>

        <Link className='navigate-section' to='tax#gte3'>
          <h4>Ký hợp đồng trên 3 tháng</h4>
          <ArrowRightOutlined />
        </Link>
      </div>
      <Footer />
    </StyledHome>
  )
}

const StyledHome = styled.main`
  margin: 0 24px;
  margin-top: 50px;
  
  .title {
    margin-top: 24px;
    text-align: center;
  }

  .navigate-section {
    display: flex;
    align-items: center;
    gap: 5em;
    cursor: pointer;
  }
`

export default Home