import React from 'react'
import { Button,Modal,Form,Input,DatePicker,Select } from 'antd'
function AddExpenseModal({
    isExpenseModalVisible,
    handleExpenseCancel,
    onFinish,
}) {
    const [form]=Form.useForm();
  return (
    <Modal
        style={{fontWeight:600}}
        title="Add Expense"
        visible={isExpenseModalVisible}
        onCancel={handleExpenseCancel}
        footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={(values)=>{
                    onFinish(values,"expense");
                    form.resetFields();
                }}
            >
                <Form.Item
                    style={{fontWeight:600}}
                    label="Name"
                    name="name"
                    rules={[
                        {
                            required:true,
                            message:"Please input the name of the transactional!",
                        },
                    ]}
                >
                    <Input type="text" className="custom-input" />
                </Form.Item>
                <Form.Item
                    style={{fontWeight:600}}
                    label="Amount"
                    name="amount"
                    rules={[
                        {
                            required:true,
                            message:"Please input the expense amount",
                        },
                    ]}
                >
                    <Input type="number" className="custom-input" />
                </Form.Item>
                <Form.Item
                    style={{fontWeight:600}}
                    label="Date"
                    name="date"
                    rules={[
                        {
                            required:true,
                            message:"Please Select the expense Date!",
                        },
                    ]}
                >
                    <DatePicker  className="custom-input" format="YYYY-MM-DD" />
                </Form.Item>
                <Form.Item
                    label="Tag"
                    name="tag"
                    style={{fontWeight:600}}
                    rules={[
                        {
                            required:true,
                            message:"Please Select a Tag!",
                        },
                    ]}
                >
                    <Select
                        className="select-input-2"
                        mode="tags" // Add this mode prop to enable custom tags
                        tokenSeparators={[',']}
                    >
                        <Select.Option value="food">Food</Select.Option>
                        <Select.Option value="education">Education</Select.Option>
                        <Select.Option value="office">Office</Select.Option>
                    </Select>
                    
                </Form.Item>
                <Form.Item>
                    <Button
                        style={{padding: "3px 10px"}}
                    
                        className="btn btn-blue" type="primary" htmlType="submit">
                        Add Expense
                    </Button>
                </Form.Item>    
            </Form>
        </Modal>
  );
}

export default AddExpenseModal