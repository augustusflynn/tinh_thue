import React from 'react'
import styled from 'styled-components'

function Footer() {
  return (
    <>
      <StyledFooter>
        &copy; Quản lí chi tiêu
      </StyledFooter>
      <div
        style={{
          height: "150px"
        }}
      />
    </>
  )
}

const StyledFooter = styled.footer`
  text-align: center;
  position: absolute;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  bottom: 0;
  text-align: center;
  border-top: 1px solid #a8a8a855;
  padding-top: 24px;
  padding-bottom: 24px;
  background: #fff;
`

export default Footer