import React from "react";
import axios from "axios";

import {BaseResourceComponent} from "./base-resource-component";
import {message, Modal, Tabs} from "antd";
import Title from "antd/lib/typography/Title";
import Form from "antd/es/form";
import Input from "antd/es/input";
import Row from "antd/es/grid/row";
import Col from "antd/es/grid/col";
import Button from "antd/es/button";
import Divider from "antd/es/divider";
import TextArea from "antd/es/input/TextArea";
import {Spin} from "antd/es";
import Switch from "antd/es/switch";
import Select from "antd/es/select";
import Template from "./template/template";

const {Option} = Select;

const {TabPane} = Tabs;

const activeKey = window.location.hash !== '' ? window.location.hash.substr(1) : "basic";

const layout = {
    labelCol: {span: 8},
    wrapperCol: {span: 16},
};

class Website extends BaseResourceComponent {

    basicForm = React.createRef();
    otherForm = React.createRef();
    upgradeForm = React.createRef();
    blogForm = React.createRef();

    initState() {
        return {
            settingsLoading: true
        }
    }

    handleTabClick = key => {
        this.props.history.push(`/admin/website#${key}`)
        this.initForm();

    }

    getSecondTitle() {
        return this.state.res['admin.setting'];
    }

    componentDidMount() {
        super.componentDidMount();
        this.initForm();
    }

    initForm() {
        axios.get("/api/admin/website/settings").then(({data}) => {
            if (data.data.basic != null) {
                this.setBasicFormValue(data.data.basic);
            }
            if (data.data.other != null) {
                this.setOtherFormValue(data.data.other);
            }
            if (data.data.upgrade != null) {
                this.setUpgradeFormValue(data.data.upgrade);
            }
            if (data.data.blog != null) {
                this.setBlogFormValue(data.data.blog);
            }
            this.setState({
                settingsLoading: false
            })
        })
    }

    setBasicFormValue(changedValues) {
        if (this.basicForm.current) {
            let newValues = {...this.state.basic, ...changedValues}
            this.basicForm.current.setFieldsValue(newValues);
            this.setState({
                basic: newValues,
            });
        }
    }

    setOtherFormValue(changedValues) {
        if (this.otherForm.current) {
            let newValues = {...this.state.other, ...changedValues}
            this.otherForm.current.setFieldsValue(newValues);
            this.setState({
                other: newValues,
            });
        }
    }

    setUpgradeFormValue(changedValues) {
        if (this.upgradeForm.current) {
            let newValues = {...this.state.upgrade, ...changedValues}
            this.upgradeForm.current.setFieldsValue(newValues);
            this.setState({
                upgrade: newValues,
            });
        }
    }

    setBlogFormValue(changedValues) {
        if (this.blogForm.current) {
            let newValues = {...this.state.blog, ...changedValues}
            this.blogForm.current.setFieldsValue(newValues);
            this.setState({
                blog: newValues,
            });
            console.info(newValues);
        }
   }

    websiteFormFinish(changedValues, formName) {
        axios.post("/api/admin/website/" + formName, changedValues).then(({data}) => {
            if (!data.error) {
                message.info(data.message);
                this.loadResourceFromServer();
            }
        });
    }

    checkNewVersion = () => {
        axios.get("/api/admin/upgrade/checkNewVersion").then(async ({data}) => {
            if (data.data.upgrade) {
                const title = "V" + data.data.version.version + "-" + data.data.version.buildId + " (" + data.data.version.type + ")";
                Modal.info({
                    title: title,
                    content: data.data.version.changeLog,
                    okText: '?????????',
                    cancelText: '??????',
                    onOk: function () {
                        window.location.href = "/admin/upgrade"
                    }
                });
            } else {
                message.info(this.state.res['notFoundNewVersion'])
            }
        });
    }


    render() {

        return (
            <Spin delay={this.getSpinDelayTime()} spinning={this.state.resLoading && this.state.settingsLoading}>
                <Title className='page-header' level={3}>{this.getSecondTitle()}</Title>
                <Divider/>
                <Tabs defaultActiveKey={activeKey} onChange={e => this.handleTabClick(e)}>
                    <TabPane tab="????????????" key="basic">
                        <Row>
                            <Col md={12} xs={24}>
                                <Title level={4}>???????????????????????????????????????</Title>
                                <Divider/>
                                <Form ref={this.basicForm} {...layout}
                                      onValuesChange={(k, v) => this.setBasicFormValue(k, v)}
                                      onFinish={k => this.websiteFormFinish(k, "basic")}
                                >
                                    <Form.Item name='title' label='????????????' rules={[{required: true}]}>
                                        <Input placeholder='?????????????????????'/>
                                    </Form.Item>
                                    <Form.Item name='second_title' label='???????????????'>
                                        <Input placeholder='????????????????????????'/>
                                    </Form.Item>
                                    <Form.Item name='keywords' label='???????????????'>
                                        <Input placeholder='????????????????????????'/>
                                    </Form.Item>
                                    <Form.Item name='description' label='????????????'>
                                        <TextArea rows={5}/>
                                    </Form.Item>
                                    <Divider/>
                                    <Button type='primary' enterbutton='true'
                                            htmlType='submit'>{this.state.res.submit}</Button>
                                </Form>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tab="????????????" key="blog">
                        <Row>
                            <Col md={12} xs={24}>
                                <Title level={4}>????????????</Title>
                                <Divider/>
                                <Form {...layout} ref={this.blogForm}
                                      onValuesChange={(k, v) => this.setBlogFormValue(k, v)}
                                      onFinish={k => this.websiteFormFinish(k, "blog")}
                                >
                                    <Form.Item name='session_timeout' label='??????????????????' rules={[{required: true}]}>
                                        <Input suffix="??????" style={{maxWidth: "120px"}} max={99999} type={"number"}
                                               min={5} placeholder=''/>
                                    </Form.Item>
                                    <Form.Item valuePropName="checked" name='generator_html_status' label='??????????????????'>
                                        <Switch size={"small"}/>
                                    </Form.Item>
                                    <Form.Item valuePropName="checked" name='disable_comment_status' label='????????????'>
                                        <Switch size={"small"}/>
                                    </Form.Item>
                                    <Form.Item valuePropName="checked" name='admin_darkMode' label='????????????'>
                                        <Switch size={"small"}/>
                                    </Form.Item>
                                    <Form.Item valuePropName="checked" name='article_thumbnail_status' label='????????????'>
                                        <Switch size={"small"}/>
                                    </Form.Item>
                                    <Form.Item name='language' label={this.state.res['language']}>
                                        <Select style={{maxWidth: "100px"}}>
                                            <Option value='zh_CN'>{this.state.res['languageChinese']}</Option>
                                            <Option value='en_US'>{this.state.res['languageEnglish']}</Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item name='article_route' label='????????????'>
                                        <Select style={{maxWidth: "100px"}}>
                                            <Option value=''>??????</Option>
                                            <Option value='post'>post</Option>
                                        </Select>
                                    </Form.Item>
                                    <Divider/>
                                    <Button type='primary' enterbutton='true'
                                            htmlType='submit'>{this.state.res.submit}</Button>
                                </Form>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tab={this.state.res['admin.template.manage']} key="template">
                        <Template/>
                    </TabPane>
                    <TabPane tab="????????????" key="other">
                        <Row>
                            <Col md={12} xs={24}>
                                <Title level={4}>ICP????????????????????????</Title>
                                <Divider/>
                                <Form ref={this.otherForm} {...layout}
                                      onValuesChange={(k, v) => this.setBlogFormValue(k, v)}
                                      onFinish={k => this.websiteFormFinish(k, "other")}
                                >
                                    <Form.Item name='icp' label='ICP????????????'>
                                        <TextArea/>
                                    </Form.Item>
                                    <Form.Item name='webCm' label='????????????'>
                                        <TextArea rows={7}/>
                                    </Form.Item>
                                    <Divider/>
                                    <Button type='primary' enterbutton='true'
                                            htmlType='submit'>{this.state.res.submit}</Button>
                                </Form>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tab={this.state.res['admin.upgrade.manage']} key="upgrade">
                        <Row>
                            <Col md={12} xs={24}>
                                <Button type='dashed' onClick={this.checkNewVersion}
                                        style={{float: "right"}}>{this.state.res.checkUpgrade}</Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12} xs={24}>
                                <Form ref={this.upgradeForm} {...layout}
                                      onValuesChange={(k, v) => this.setUpgradeFormValue(k, v)}
                                      onFinish={k => this.websiteFormFinish(k, "upgrade")}
                                >
                                    <Form.Item name='autoUpgradeVersion'
                                               label={this.state.res['admin.upgrade.autoCheckCycle']}>
                                        <Select style={{maxWidth: "100px"}}>
                                            <Select.Option key='86400' value={86400}>
                                                {this.state.res['admin.upgrade.cycle.oneDay']}
                                            </Select.Option>
                                            <Select.Option key='604800' value={604800}>
                                                {this.state.res['admin.upgrade.cycle.oneWeek']}
                                            </Select.Option>
                                            <Select.Option key='1296000' value={1296000}>
                                                {this.state.res['admin.upgrade.cycle.halfMonth']}
                                            </Select.Option>
                                            <Select.Option key='-1' value={-1}>
                                                {this.state.res['admin.upgrade.cycle.never']}
                                            </Select.Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item valuePropName="checked" name='upgradePreview'
                                               label={this.state.res['admin.upgrade.canPreview']}>
                                        <Switch size={"small"}/>
                                    </Form.Item>
                                    <Divider/>
                                    <Button type='primary' enterbutton='true'
                                            htmlType='submit'>{this.state.res.submit}</Button>
                                </Form>
                            </Col>
                        </Row>
                    </TabPane>
                </Tabs>
            </Spin>
        )
    }
}

export default Website;
