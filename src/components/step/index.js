import { Steps } from 'antd';
import React from 'react';
import { useHistory } from 'react-router-dom';

const { Step } = Steps;

const Progress = ({ current }) => {
  const history = useHistory();

  return (
    <Steps
      current={(current === undefined || current === null) ? 0 : current}
    >
      <Step
        title="Chọn loại hình lao động"
        description="Thời gian ký hợp đồng"
        onStepClick={() => history.push('/')}
      />
      <Step
        title="Điền thông tin thu nhập"
        description="Điền thông tin thu nhập từng tháng"
        onStepClick={history.goBack}
      />
      <Step
        title="Kết quả thuế thu nhập"
        description="Nhận kết quả thuế thu nhập"
      />
    </Steps>
  )
};

export default Progress;