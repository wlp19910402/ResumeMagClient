import { CloseCircleOutlined } from '@ant-design/icons';
import { Button, Card, Form, Popover } from 'antd';
import React, { FC, useState } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import { connect, Dispatch } from 'umi';
import SkillMaster from '../components/SkillMaster';
import BasicInfoForm from '../components/BasicInfoForm';
import ExperienceForm from '../components/ExperienceForm'
import styles from '../style.less';
import { ResumeDataType, resumeDataDefault } from '../API.d'
type InternalNamePath = (string | number)[];
interface AdvancedFormProps {
  dispatch: Dispatch;
  submitting: boolean;
}
interface ErrorField {
  name: InternalNamePath;
  errors: string[];
}
const AdvancedForm: FC<AdvancedFormProps> = ({ submitting, dispatch }) => {
  const [ form ] = Form.useForm();
  const [ error, setError ] = useState<ErrorField[]>([]);
  const getErrorInfo = (errors: ErrorField[]) => {
    const errorCount = errors.filter((item) => item.errors.length > 0).length;
    if (!errors || errorCount === 0) {
      return null;
    }
    const scrollToField = (fieldKey: string) => {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
      if (labelNode) {
        labelNode.scrollIntoView(true);
      }
    }
    const errorList = errors.map((err) => {
      if (!err || err.errors.length === 0) {
        return null;
      }
      const key = err.name[ 0 ] as string;
      return (
        <li key={ key } className={ styles.errorListItem } onClick={ () => scrollToField(key) }>
          <CloseCircleOutlined className={ styles.errorIcon } />
          <div className={ styles.errorMessage }>{ err.errors[ 0 ] }</div>

        </li>
      );
    })
    return (
      <span className={ styles.errorIcon }>
        <Popover
          title="表单校验信息"
          content={ errorList }
          overlayClassName={ styles.errorPopover }
          trigger="click"
          getPopupContainer={ (trigger: HTMLElement) => {
            if (trigger && trigger.parentNode) {
              return trigger.parentNode as HTMLElement;
            }
            return trigger;
          } }
        >
          <CloseCircleOutlined />
        </Popover>
        {errorCount }
      </span>
    );
  }
  const onFinish = (values: { [ key: string ]: any }) => {
    setError([]);
    console.log(values);
    dispatch({
      type: 'formAndadvancedForm/submitAdvancedForm',
      payload: values,
    });
  }

  const onFinishFailed = (errorInfo: any) => {
    setError(errorInfo.errorFields);
  }

  return (
    <Form
      form={ form }
      layout="vertical"
      hideRequiredMark
      initialValues={ { baseInfo: resumeDataDefault.baseInfo, skillMaster: resumeDataDefault.skillMaster, workExperience: resumeDataDefault.workExperience } }
      onFinish={ onFinish }
      onFinishFailed={ onFinishFailed }
    >
      <PageContainer content="制作resume。">
        <Card title="基本信息" className={ styles.card } bordered={ false }>
          <BasicInfoForm baseInfo={ resumeDataDefault.baseInfo } />
        </Card>
        <Form.Item name="skillMaster">
          <SkillMaster />
        </Form.Item>
        <Form.Item name="workExperience" >
          <ExperienceForm />
        </Form.Item>
      </PageContainer>
      <FooterToolbar>
        { getErrorInfo(error) }
        <Button type="primary" onClick={ () => form?.submit() } loading={ submitting }>
          提交
        </Button>
      </FooterToolbar>
    </Form>
  );
};

export default connect(({ loading }: { loading: { effects: { [ key: string ]: boolean } } }) => ({
  submitting: loading.effects[ 'formAndadvancedForm/submitAdvancedForm' ],
}))(AdvancedForm);
