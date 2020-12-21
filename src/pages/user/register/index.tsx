import {
  AlipayCircleOutlined,
  LockTwoTone,
  MailTwoTone,
  MobileTwoTone,
  ArrowLeftOutlined,
  UserOutlined,
  SwapLeftOutlined,
} from '@ant-design/icons';
import { Alert, Space, message, Tabs } from 'antd';
import React, { useState } from 'react';
import ProForm, { ProFormCaptcha, ProFormCheckbox, ProFormText } from '@ant-design/pro-form';
import { connect, Dispatch, useIntl, FormattedMessage, Link } from 'umi';
import { StateType } from '@/models/login';
import { getFakeCaptcha, LoginParamsType } from '@/services/login';
import { ConnectState } from '@/models/connect';

import styles from './index.less';

interface LoginProps {
  dispatch: Dispatch;
  userLogin: StateType;
  submitting?: boolean;
}

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={ {
      marginBottom: 24,
    } }
    message={ content }
    type="error"
    showIcon
  />
);

const Login: React.FC<LoginProps> = (props) => {
  const { userLogin = {}, submitting } = props;
  const { status, type: loginType } = userLogin;
  const [ type, setType ] = useState<string>('account');
  const intl = useIntl();

  const handleSubmit = (values: LoginParamsType) => {
    const { dispatch } = props;
    dispatch({
      type: 'login/login',
      payload: { ...values, type },
    });
  };
  return (
    <div className={ styles.main }>
      <ProForm
        submitter={ {
          render: (_, dom) => dom.pop(),
          submitButtonProps: {
            loading: submitting,
            size: 'large',
            style: {
              width: '100%',
            },
          },
        } }
        onFinish={ async (values) => {
          handleSubmit(values);
        } }
      >
        <Tabs activeKey={ type } onChange={ setType }>
          <Tabs.TabPane
            key="account"
            tab="注册"
          />
        </Tabs>

        { status === 'error' && loginType === 'account' && !submitting && (
          <LoginMessage
            content={ intl.formatMessage({
              id: 'pages.login.accountLogin.errorMessage',
              defaultMessage: '账户或密码错误（admin/ant.design)',
            }) }
          />
        ) }
        { type === 'account' && (
          <>
            <ProFormText
              fieldProps={ {
                size: 'large',
                prefix: <MobileTwoTone className={ styles.prefixIcon } />,
              } }
              name="mobile"
              placeholder={ intl.formatMessage({
                id: 'pages.login.phoneNumber.placeholder',
                defaultMessage: '手机号',
              }) }
              rules={ [
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.login.phoneNumber.required"
                      defaultMessage="请输入手机号！"
                    />
                  ),
                },
                {
                  pattern: /^1\d{10}$/,
                  message: (
                    <FormattedMessage
                      id="pages.login.phoneNumber.invalid"
                      defaultMessage="手机号格式错误！"
                    />
                  ),
                },
              ] }
            />
            <ProFormCaptcha
              fieldProps={ {
                size: 'large',
                prefix: <MailTwoTone className={ styles.prefixIcon } />,
              } }
              captchaProps={ {
                size: 'large',
              } }
              placeholder={ intl.formatMessage({
                id: 'pages.login.captcha.placeholder',
                defaultMessage: '请输入验证码',
              }) }
              captchaTextRender={ (timing, count) =>
                timing
                  ? `${count} ${intl.formatMessage({
                    id: 'pages.getCaptchaSecondText',
                    defaultMessage: '获取验证码',
                  })}`
                  : intl.formatMessage({
                    id: 'pages.login.phoneLogin.getVerificationCode',
                    defaultMessage: '获取验证码',
                  })
              }
              name="captcha"
              rules={ [
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.login.captcha.required"
                      defaultMessage="请输入验证码！"
                    />
                  ),
                },
              ] }
              onGetCaptcha={ async (mobile) => {
                const result = await getFakeCaptcha(mobile);
                if (result === false) {
                  return;
                }
                message.success('获取验证码成功！验证码为：1234');
              } }
            />
            <ProFormText
              name="userName"
              fieldProps={ {
                size: 'large',
                prefix: <UserOutlined className={ styles.prefixIcon } />,
              } }
              placeholder={ intl.formatMessage({
                id: 'pages.login.username.placeholder',
                defaultMessage: '用户名: admin or user',
              }) }
              rules={ [
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.login.username.required"
                      defaultMessage="请输入用户名!"
                    />
                  ),
                },
              ] }
            />
            <ProFormText.Password
              name="password"
              fieldProps={ {
                size: 'large',
                prefix: <LockTwoTone className={ styles.prefixIcon } />,
              } }
              placeholder={ intl.formatMessage({
                id: 'pages.login.password.placeholder',
                defaultMessage: '密码: ant.design',
              }) }
              rules={ [
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.login.password.required"
                      defaultMessage="请输入密码！"
                    />
                  ),
                },
              ] }
            />
          </>
        ) }

        { status === 'error' && loginType === 'mobile' && !submitting && (
          <LoginMessage content="验证码错误" />
        ) }

      </ProForm>
      <Space className={ styles.other }>
        <Link to="/user/login"><ArrowLeftOutlined />&nbsp;登录</Link>
      </Space>
    </div>
  );
};

export default connect(({ login, loading }: ConnectState) => ({
  userLogin: login,
  submitting: loading.effects[ 'login/login' ],
}))(Login);
